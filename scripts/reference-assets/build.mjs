/**
 * Interim hero asset pipeline.
 *
 *   crop    node scripts/reference-assets/build.mjs crop  <workDir>
 *   cutout  python scripts/reference-assets/cutout.py <workDir>/crops <workDir>/cut [model]
 *   key     node scripts/reference-assets/build.mjs key <workDir>
 *   publish node scripts/reference-assets/build.mjs publish <workDir>
 *
 * No original photography has been supplied, so the owner, product renders,
 * card photos, landmark and logo mark are cut out of the approved design
 * references (docs/DECISIONS.md D-012, D-013). Every box below is a rectangle
 * in the reference file; keeping them here makes each asset's provenance
 * auditable and lets them be regenerated if a crop needs adjusting.
 *
 * These are INTERIM assets. When real photography or the approved logo SVG is
 * supplied, replace the published files and delete the corresponding box.
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const HERO = "design-references/reference-02-owner-hero.jpg";
const LOGO = "design-references/reference-03-brand-logo.jpg";
/**
 * High-resolution product renders supplied by the owner (1536×1024). Where a
 * product exists here it supersedes the low-resolution crop from reference 02.
 * Boxes from this file are skipped if it has not been added to the repo yet.
 */
const RENDERS = "design-references/reference-04-product-renders.png";

/** Crop boxes, in reference pixels. */
const boxes = {
  owner: { src: HERO, left: 872, top: 108, width: 452, height: 456 },
  laptop: { src: HERO, left: 776, top: 168, width: 184, height: 150 },
  tower: { src: HERO, left: 1180, top: 158, width: 172, height: 178 },
  cctv: { src: HERO, left: 1388, top: 198, width: 130, height: 110 },
  printer: { src: HERO, left: 1282, top: 338, width: 166, height: 110 },
  tools: { src: HERO, left: 758, top: 352, width: 104, height: 100 },
  phone: { src: HERO, left: 1034, top: 570, width: 124, height: 100 },
  repair: { src: HERO, left: 1392, top: 566, width: 160, height: 106 },
  landmark: { src: HERO, left: 0, top: 690, width: 350, height: 210 },
  logo: { src: LOGO, left: 48, top: 88, width: 310, height: 290 },

  // From the hi-res renders. `laptop` and `tower` here replace the boxes above.
  "hr-laptop": { src: RENDERS, left: 172, top: 182, width: 600, height: 332 },
  "hr-tower": { src: RENDERS, left: 892, top: 112, width: 428, height: 456 },
  "hr-headphones": {
    src: RENDERS,
    left: 262,
    top: 606,
    width: 318,
    height: 306,
  },
  "hr-gpu": { src: RENDERS, left: 826, top: 626, width: 544, height: 298 },
};

/**
 * Where each cut-out lands in `public/`, and how much to upscale it.
 *
 * Upscaling adds no detail — it only stops the browser doing a worse resize on
 * high-density screens. The reference is 1600×900, so these assets are soft at
 * large sizes; that is a known limitation until originals arrive.
 */
const publish = {
  owner: { to: "public/images/hero/owner.png", scale: 2, trim: true },
  laptop: { to: "public/images/hero/laptop.png", scale: 2, trim: true },
  tower: { to: "public/images/hero/tower.png", scale: 2, trim: true },
  cctv: { to: "public/images/hero/cctv.png", scale: 2, trim: true },
  printer: { to: "public/images/hero/printer.png", scale: 2, trim: true },
  tools: { to: "public/images/hero/tools.png", scale: 2, trim: true },
  phone: { to: "public/images/hero/card-products.png", scale: 2, trim: false },
  repair: { to: "public/images/hero/card-services.png", scale: 2, trim: false },
  landmark: {
    to: "public/images/hero/rajkot-landmark.png",
    scale: 2,
    trim: true,
  },
  logo: { to: "public/images/brand/logo-mark.png", scale: 1, trim: true },

  // Hi-res renders win where both exist: publishing them later overwrites the
  // reference-02 laptop and tower.
  "hr-laptop": { to: "public/images/hero/laptop.png", scale: 1, trim: true },
  "hr-tower": { to: "public/images/hero/tower.png", scale: 1, trim: true },
  "hr-headphones": {
    to: "public/images/products/headphones.png",
    scale: 1,
    trim: true,
  },
  "hr-gpu": { to: "public/images/products/gpu.png", scale: 1, trim: true },
};

/**
 * Assets that are flat artwork on a pale field rather than objects. A salient-
 * object model keeps one "thing" and throws the rest away (it kept only the
 * clock tower from the landmark), so these are keyed with colour-to-alpha
 * instead: each pixel's opacity is how far it darkens the background colour.
 * That is exact for ink-on-paper art and leaves soft tints soft.
 */
const COLOUR_TO_ALPHA = new Set(["landmark", "logo"]);

/** Estimate the field colour from the image's top corners. */
function fieldColour(data, width, channels) {
  const samples = [];
  for (const x0 of [0, width - 12]) {
    for (let y = 0; y < 12; y++) {
      for (let x = x0; x < x0 + 12; x++) {
        const i = (y * width + x) * channels;
        samples.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
  }
  return [0, 1, 2].map((c) => {
    const v = samples.map((s) => s[c]).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  });
}

async function colourToAlpha(src, dest) {
  const { data, info } = await sharp(src)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const bg = fieldColour(data, width, channels);
  const out = Buffer.alloc(width * height * 4);

  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    // Opacity = the strongest darkening across channels, relative to the field.
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (bg[c] - data[i + c]) / bg[c]);
    a = Math.min(1, Math.max(0, (a - 0.04) / 0.96)); // drop the faint field tint
    const o = p * 4;
    for (let c = 0; c < 3; c++) {
      // Un-mix from the field: p = bg·(1−a) + f·a  →  f = (p − bg·(1−a)) / a
      const f = a > 0 ? (data[i + c] - bg[c] * (1 - a)) / a : 0;
      out[o + c] = Math.max(0, Math.min(255, Math.round(f)));
    }
    out[o + 3] = Math.round(a * 255);
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(dest);
}

const [mode, workDir] = process.argv.slice(2);
if (!mode || !workDir) {
  console.error("usage: build.mjs <crop|key|publish> <workDir>");
  process.exit(1);
}

if (mode === "crop") {
  const out = join(workDir, "crops");
  mkdirSync(out, { recursive: true });
  for (const [name, b] of Object.entries(boxes)) {
    if (!existsSync(b.src)) {
      console.warn("skipped ", name, "- source not in repo:", b.src);
      continue;
    }
    await sharp(b.src)
      .extract({ left: b.left, top: b.top, width: b.width, height: b.height })
      .png()
      .toFile(join(out, `${name}.png`));
    console.log("cropped ", name);
  }
} else if (mode === "key") {
  // Run after cutout.py: replaces its output for the flat-artwork assets.
  const crops = join(workDir, "crops");
  const cut = join(workDir, "cut");
  mkdirSync(cut, { recursive: true });
  for (const name of COLOUR_TO_ALPHA) {
    const src = join(crops, `${name}.png`);
    if (!existsSync(src)) continue;
    await colourToAlpha(src, join(cut, `${name}.png`));
    console.log("keyed   ", name);
  }
} else if (mode === "publish") {
  const cut = join(workDir, "cut");
  const available = new Set(
    readdirSync(cut).map((f) => f.replace(/\.png$/, "")),
  );

  for (const [name, p] of Object.entries(publish)) {
    if (!available.has(name)) {
      console.warn("missing ", name);
      continue;
    }
    let image = sharp(join(cut, `${name}.png`)).ensureAlpha();
    if (p.trim) image = image.trim({ threshold: 4 });

    const { data, info } = await image
      .png()
      .toBuffer({ resolveWithObject: true });
    const target = sharp(data).resize({
      width: Math.round(info.width * p.scale),
      kernel: "lanczos3",
    });

    mkdirSync(join(p.to, ".."), { recursive: true });
    const meta = await target.png({ compressionLevel: 9 }).toFile(p.to);
    console.log(
      "published",
      name.padEnd(9),
      `${meta.width}x${meta.height}`,
      "->",
      p.to,
    );
  }
} else {
  console.error(`unknown mode: ${mode}`);
  process.exit(1);
}
