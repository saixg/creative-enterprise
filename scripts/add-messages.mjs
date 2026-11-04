/**
 * One-off helper used while building the homepage: merges new message keys into
 * both catalogues without disturbing existing ones.
 *
 * Kept in the repo because translation keys get added often and doing it by
 * hand across two files is how catalogues drift apart. `npm run test` has a
 * parity test that fails if they ever do.
 */
import { readFileSync, writeFileSync } from "node:fs";

const files = {
  en: "src/i18n/messages/en.json",
  gu: "src/i18n/messages/gu.json",
};

const additions = {
  en: {
    nav: {
      brands: "Brands",
      offers: "Offers",
      newArrivals: "New Arrivals",
    },
    hero: {
      panelsLabel:
        "Products sold and serviced here: laptops, desktops, components, CCTV, printers and accessories.",
    },
    products: {
      viewAll: "View all",
    },
    featured: {
      badge: "New Arrivals",
      headline: "Next-Gen Laptops Now at Creative Enterprise",
      subheadline:
        "Latest laptops, desktops and computer components with genuine products, expert support and after-sales service.",
      primaryCta: "Explore Laptops",
      secondaryCta: "Get IT Services",
      imagePending: "Product image pending",
      trust: {
        genuine: "Genuine products",
        warranty: "Warranty support",
        expert: "Expert service",
        response: "Quick response",
      },
    },
    offers: {
      heading: "Offers",
      subtitle: "Current promotions from the store.",
      emptyTitle: "No offers published yet",
      emptyBody:
        "Offers appear here once the business publishes them. Nothing is shown in the meantime — we do not advertise discounts that have not been confirmed.",
    },
    brands: {
      heading: "Brands we work with",
      subtitle:
        "Brands appearing in the current catalogue. Ask us about availability for any brand you need.",
      notice:
        "Brand names are listed from catalogue data only. No authorised-dealer or partnership relationship is claimed.",
    },
    promo: {
      builds: {
        title: "Custom PC Builds",
        body: "Build your setup with guidance on parts, compatibility and budget. Tell us what you need it for and we will put a configuration together.",
        cta: "Enquire about a build",
      },
      repair: {
        title: "Laptop & Desktop Repair",
        body: "Diagnostics, hardware replacement and upgrades for laptops and desktops. Bring the machine in or ask about on-site support.",
        cta: "Book a service",
      },
    },
    services: {
      eyebrow: "Services",
      heading: "Technical services and support",
      subtitle:
        "Repair, installation and maintenance handled in Rajkot — the other half of what we do.",
      cta: "Browse all services",
      notice:
        "Service availability, pricing and turnaround are confirmed with you directly. Nothing is quoted here until the business has published it.",
      items: {
        repair: {
          title: "Laptop & desktop repair",
          body: "Fault diagnosis, component replacement and screen replacement.",
        },
        upgrades: {
          title: "Hardware upgrades",
          body: "Memory, storage and component upgrades, with compatibility checked first.",
        },
        cctv: {
          title: "CCTV installation & repair",
          body: "Camera installation, cabling, configuration and fault-finding.",
        },
        printer: {
          title: "Printer support",
          body: "Printer servicing, repair and setup for home and office.",
        },
        amc: {
          title: "Maintenance & AMC",
          body: "Ongoing maintenance arrangements for businesses. Ask us what a contract would cover.",
        },
      },
    },
    why: {
      heading: "Why choose Creative Enterprise",
      subtitle:
        "Sales and service under one roof, from a shop you can walk into.",
      location: "Rajkot, Gujarat",
      reasons: {
        genuine: {
          title: "Genuine products",
          body: "We supply genuine hardware and tell you plainly what you are buying.",
        },
        expert: {
          title: "Expert technical support",
          body: "The same people who sell the hardware also service it.",
        },
        guidance: {
          title: "Honest guidance",
          body: "Advice on what actually suits your use and budget, not the biggest sale.",
        },
        local: {
          title: "Local presence",
          body: "A physical store in Rajkot, so support does not mean a courier and a wait.",
        },
      },
    },
    finalCta: {
      heading: "Tell us what you need and we will help you choose",
      subtitle:
        "Enquire about a product, or book a repair. We will get back to you with real availability and pricing.",
      productCta: "Explore products",
      serviceCta: "Book a service",
    },
  },

  gu: {
    nav: {
      brands: "બ્રાન્ડ્સ",
      offers: "ઓફર્સ",
      newArrivals: "નવી આવક",
    },
    hero: {
      panelsLabel:
        "અહીં વેચાતા અને સર્વિસ થતા પ્રોડક્ટ્સ: લેપટોપ, ડેસ્કટોપ, કમ્પોનન્ટ્સ, CCTV, પ્રિન્ટર અને એક્સેસરીઝ.",
    },
    products: {
      viewAll: "બધું જુઓ",
    },
    featured: {
      badge: "નવી આવક",
      headline: "ક્રિએટિવ એન્ટરપ્રાઇઝ પર હવે નેક્સ્ટ-જેન લેપટોપ",
      subheadline:
        "અસલ પ્રોડક્ટ્સ, નિષ્ણાત સપોર્ટ અને વેચાણ પછીની સેવા સાથે નવીનતમ લેપટોપ, ડેસ્કટોપ અને કમ્પ્યુટર કમ્પોનન્ટ્સ.",
      primaryCta: "લેપટોપ જુઓ",
      secondaryCta: "IT સેવાઓ મેળવો",
      imagePending: "પ્રોડક્ટ ઇમેજ બાકી છે",
      trust: {
        genuine: "અસલ પ્રોડક્ટ્સ",
        warranty: "વોરંટી સપોર્ટ",
        expert: "નિષ્ણાત સર્વિસ",
        response: "ઝડપી પ્રતિસાદ",
      },
    },
    offers: {
      heading: "ઓફર્સ",
      subtitle: "સ્ટોરની વર્તમાન ઓફર્સ.",
      emptyTitle: "હજી કોઈ ઓફર પ્રકાશિત નથી",
      emptyBody:
        "વ્યવસાય ઓફર્સ પ્રકાશિત કરે પછી તે અહીં દેખાશે. ત્યાં સુધી કશું બતાવાતું નથી — અમે અપુષ્ટ ડિસ્કાઉન્ટની જાહેરાત કરતા નથી.",
    },
    brands: {
      heading: "અમે જે બ્રાન્ડ્સ સાથે કામ કરીએ છીએ",
      subtitle:
        "વર્તમાન કેટલોગમાં દેખાતી બ્રાન્ડ્સ. તમને જોઈતી કોઈપણ બ્રાન્ડની ઉપલબ્ધતા વિશે અમને પૂછો.",
      notice:
        "બ્રાન્ડ નામો ફક્ત કેટલોગ ડેટામાંથી દર્શાવેલ છે. કોઈ અધિકૃત ડીલર કે ભાગીદારીનો દાવો કરવામાં આવતો નથી.",
    },
    promo: {
      builds: {
        title: "કસ્ટમ PC બિલ્ડ",
        body: "પાર્ટ્સ, સુસંગતતા અને બજેટ પર માર્ગદર્શન સાથે તમારું સેટઅપ બનાવો. તમને શા માટે જોઈએ છે તે જણાવો, અમે કોન્ફિગરેશન તૈયાર કરીશું.",
        cta: "બિલ્ડ વિશે પૂછો",
      },
      repair: {
        title: "લેપટોપ અને ડેસ્કટોપ રિપેર",
        body: "લેપટોપ અને ડેસ્કટોપ માટે ડાયગ્નોસ્ટિક્સ, હાર્ડવેર બદલી અને અપગ્રેડ. મશીન લાવો અથવા ઓન-સાઇટ સપોર્ટ વિશે પૂછો.",
        cta: "સર્વિસ બુક કરો",
      },
    },
    services: {
      eyebrow: "સેવાઓ",
      heading: "ટેકનિકલ સેવાઓ અને સપોર્ટ",
      subtitle:
        "રાજકોટમાં રિપેર, ઇન્સ્ટોલેશન અને મેઇન્ટેનન્સ — અમારા કામનો બીજો અડધો ભાગ.",
      cta: "બધી સેવાઓ જુઓ",
      notice:
        "સેવાની ઉપલબ્ધતા, ભાવ અને સમય તમારી સાથે સીધા નક્કી થાય છે. વ્યવસાય પ્રકાશિત ન કરે ત્યાં સુધી અહીં કોઈ ભાવ અપાતો નથી.",
      items: {
        repair: {
          title: "લેપટોપ અને ડેસ્કટોપ રિપેર",
          body: "ખામી નિદાન, કમ્પોનન્ટ બદલી અને સ્ક્રીન રિપ્લેસમેન્ટ.",
        },
        upgrades: {
          title: "હાર્ડવેર અપગ્રેડ",
          body: "મેમરી, સ્ટોરેજ અને કમ્પોનન્ટ અપગ્રેડ, પહેલા સુસંગતતા ચકાસીને.",
        },
        cctv: {
          title: "CCTV ઇન્સ્ટોલેશન અને રિપેર",
          body: "કેમેરા ઇન્સ્ટોલેશન, કેબલિંગ, કોન્ફિગરેશન અને ખામી શોધ.",
        },
        printer: {
          title: "પ્રિન્ટર સપોર્ટ",
          body: "ઘર અને ઓફિસ માટે પ્રિન્ટર સર્વિસિંગ, રિપેર અને સેટઅપ.",
        },
        amc: {
          title: "મેઇન્ટેનન્સ અને AMC",
          body: "વ્યવસાયો માટે ચાલુ મેઇન્ટેનન્સ વ્યવસ્થા. કરારમાં શું આવરી લેવાય તે પૂછો.",
        },
      },
    },
    why: {
      heading: "ક્રિએટિવ એન્ટરપ્રાઇઝ શા માટે",
      subtitle:
        "વેચાણ અને સર્વિસ એક જ છત નીચે, એવી દુકાનમાં જ્યાં તમે આવી શકો.",
      location: "રાજકોટ, ગુજરાત",
      reasons: {
        genuine: {
          title: "અસલ પ્રોડક્ટ્સ",
          body: "અમે અસલ હાર્ડવેર આપીએ છીએ અને તમે શું ખરીદો છો તે સ્પષ્ટ જણાવીએ છીએ.",
        },
        expert: {
          title: "નિષ્ણાત ટેકનિકલ સપોર્ટ",
          body: "જે લોકો હાર્ડવેર વેચે છે તે જ તેની સર્વિસ પણ કરે છે.",
        },
        guidance: {
          title: "પ્રામાણિક માર્ગદર્શન",
          body: "તમારા ઉપયોગ અને બજેટને ખરેખર અનુકૂળ હોય તેની સલાહ, સૌથી મોટા વેચાણની નહીં.",
        },
        local: {
          title: "સ્થાનિક હાજરી",
          body: "રાજકોટમાં ભૌતિક સ્ટોર, એટલે સપોર્ટ માટે કુરિયર અને રાહ જોવાની જરૂર નથી.",
        },
      },
    },
    finalCta: {
      heading: "તમને શું જોઈએ છે તે જણાવો, અમે પસંદગીમાં મદદ કરીશું",
      subtitle:
        "પ્રોડક્ટ વિશે પૂછો, અથવા રિપેર બુક કરો. અમે વાસ્તવિક ઉપલબ્ધતા અને ભાવ સાથે સંપર્ક કરીશું.",
      productCta: "પ્રોડક્ટ્સ જુઓ",
      serviceCta: "સર્વિસ બુક કરો",
    },
  },
};

/** Deep-merge additions into the catalogue, never overwriting an existing leaf. */
function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] ??= {};
      merge(target[key], value);
    } else if (target[key] === undefined) {
      target[key] = value;
    }
  }
  return target;
}

for (const [locale, file] of Object.entries(files)) {
  const catalogue = JSON.parse(readFileSync(file, "utf8"));
  merge(catalogue, additions[locale]);
  writeFileSync(file, `${JSON.stringify(catalogue, null, 2)}\n`);
  console.log(`merged ${locale}`);
}
