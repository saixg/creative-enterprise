"""
Background removal for the interim hero assets.

Reads every PNG in IN_DIR, removes the background with rembg, and writes a
transparent PNG of the same name to OUT_DIR.

Why this exists: no original photography has been supplied (docs/DECISIONS.md
D-008, D-012, D-013). The owner and product renders are cut out of the approved
design reference instead. This is an interim measure — replace the outputs
with real photography as soon as it arrives.

Usage (from a virtualenv with `rembg[cpu]` installed):
    python cutout.py IN_DIR OUT_DIR [MODEL]

MODEL defaults to `isnet-general-use`, which keeps fine edges (hair, cables,
the printer's paper tray) best. Its weights are ~178 MB; on a slow connection
`u2netp` (4.5 MB) is a workable fallback at some cost to edge quality. Alpha
matting is enabled for the owner only, where the hair edge matters.
"""

import sys
from pathlib import Path

from rembg import new_session, remove

# Subjects that benefit from alpha matting (soft edges such as hair).
MATTED = {"owner"}

# Crops whose background is part of the design and must be kept as-is: the
# card photos are composed into cards with their own masks.
KEEP_BACKGROUND = {"phone", "repair"}


def main(in_dir: Path, out_dir: Path, model: str) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    session = new_session(model)
    print(f"model    {model}")

    for src in sorted(in_dir.glob("*.png")):
        name = src.stem
        if name.startswith("_"):
            continue  # contact sheets and other helpers

        data = src.read_bytes()
        if name in KEEP_BACKGROUND:
            (out_dir / src.name).write_bytes(data)
            print(f"kept     {name}")
            continue

        result = remove(
            data,
            session=session,
            alpha_matting=name in MATTED,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=12,
            alpha_matting_erode_size=8,
        )
        (out_dir / src.name).write_bytes(result)
        print(f"cut out  {name}")


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        sys.exit("usage: python cutout.py IN_DIR OUT_DIR [MODEL]")
    model_name = sys.argv[3] if len(sys.argv) == 4 else "isnet-general-use"
    main(Path(sys.argv[1]), Path(sys.argv[2]), model_name)
