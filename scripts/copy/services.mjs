/**
 * Writes the service-page copy into both message catalogues.
 *
 * The service list is doc 01 §2.2's candidate categories. Copy describes the
 * work only: no prices, turnaround times, warranties or guarantees (doc 03 §3).
 * Gujarati is a draft pending fluent-speaker review, like the rest of gu.json.
 *
 * Run: node scripts/copy/services.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const en = {
  servicePages: {
    title: "Services",
    metaDescription:
      "Laptop, desktop, CCTV and printer repair, upgrades and maintenance from Creative Enterprise in Rajkot.",
    badge: "Sales and service under one roof",
    headline: "Repairs, upgrades and support, handled in Rajkot",
    subhead:
      "From a laptop that will not boot to a CCTV system for your shop. Tell us the problem and we take it from there.",
    primaryCta: "Request a service",
    secondaryCta: "Browse products",
    candidateNotice:
      "This service list is being confirmed with the business. Pricing, turnaround and warranty are agreed with you directly; nothing is quoted on this site.",
    gridHeading: "What we can help with",
    gridSubtitle:
      "Pick a service to see what it covers and how a request works.",
    learnMore: "See what is covered",
    processHeading: "How a service request works",
    processSubtitle: "The same four steps, whatever the job.",
    steps: {
      tell: {
        title: "Tell us what is wrong",
        body: "Describe the problem or what you need set up. A rough description is enough.",
      },
      assess: {
        title: "We take a look",
        body: "Bring the device in, or ask about an on-site visit for installations and office equipment.",
      },
      agree: {
        title: "We agree the next step",
        body: "We explain what we found and agree the work with you before going ahead.",
      },
      done: {
        title: "Collect it or we come to you",
        body: "Pick it up from the store in Rajkot, or we finish the job on site.",
      },
    },
    productsBridge: {
      title: "Need new hardware instead?",
      body: "Sometimes replacing beats repairing. Browse laptops, desktops and components, sold by the same team that services them.",
      cta: "Browse products",
    },
    breadcrumb: "Breadcrumb",
    covers: "What it covers",
    signs: "Signs you need it",
    problem: "The problem it solves",
    requestHeading: "Request this service",
    requestUnavailable:
      "Requests are not set up yet because no contact details have been supplied. This will work once the business adds them.",
    related: "Other services",
    candidateBadge: "Being confirmed",
  },
  serviceCatalogue: {
    repair: {
      title: "Laptop & desktop repair",
      summary:
        "Diagnosis and repair for laptops and desktops that will not start, overheat, crash or run slowly.",
      problem:
        "A machine you rely on stops working, and you need to know whether it can be fixed and what it involves.",
      covers: [
        "Fault diagnosis",
        "Component replacement",
        "Power and charging faults",
        "Overheating and fan issues",
      ],
      signs: [
        "Will not power on or boot",
        "Shuts down or overheats",
        "Random crashes or blue screens",
        "Unusual noises",
      ],
    },
    screen: {
      title: "Laptop screen replacement",
      summary: "Replacement of cracked, flickering or dead laptop displays.",
      problem: "A damaged screen makes a working laptop unusable.",
      covers: [
        "Cracked or broken panels",
        "Flickering or lines on screen",
        "Backlight faults",
        "Hinge and bezel issues",
      ],
      signs: [
        "Cracks or dark patches",
        "Flicker or coloured lines",
        "Screen stays black",
        "Loose or stiff hinge",
      ],
    },
    upgrades: {
      title: "Hardware upgrades",
      summary:
        "Memory, storage and component upgrades, with compatibility checked first.",
      problem: "A computer that is too slow for the work it now has to do.",
      covers: [
        "RAM upgrades",
        "SSD upgrades and data move",
        "Graphics and component swaps",
        "Compatibility check before any purchase",
      ],
      signs: [
        "Slow start-up and loading",
        "Running out of storage",
        "Struggles with newer software",
        "Games or design tools lag",
      ],
    },
    software: {
      title: "Software troubleshooting",
      summary:
        "Help with operating system problems, setup, updates and unwanted software.",
      problem: "The hardware is fine, but the software stops you working.",
      covers: [
        "Operating system issues",
        "Setup and configuration",
        "Update problems",
        "Removing unwanted software",
      ],
      signs: [
        "Errors at start-up",
        "Programs will not open",
        "Pop-ups or unexpected behaviour",
        "Updates fail",
      ],
    },
    cctv: {
      title: "CCTV installation & repair",
      summary:
        "Camera installation, cabling, configuration and fault-finding for homes and shops.",
      problem:
        "You need to see what happens at your home or business, reliably.",
      covers: [
        "Site assessment",
        "Camera and recorder installation",
        "Cabling and configuration",
        "Fault-finding on existing systems",
      ],
      signs: [
        "New premises or no cameras yet",
        "Cameras offline or blurry",
        "Recorder not saving footage",
        "Gaps in coverage",
      ],
    },
    printer: {
      title: "Printer repair & setup",
      summary: "Servicing, repair and setup for home and office printers.",
      problem:
        "A printer that jams, will not connect or prints badly holds up the whole office.",
      covers: [
        "Paper jams and feed faults",
        "Print quality problems",
        "Network and Wi-Fi setup",
        "Routine servicing",
      ],
      signs: [
        "Frequent jams",
        "Streaks or faded prints",
        "Will not connect",
        "Error lights",
      ],
    },
    amc: {
      title: "Maintenance & AMC",
      summary:
        "Ongoing maintenance arrangements for businesses. Ask what a contract would cover.",
      problem:
        "Keeping several machines healthy without waiting for each one to fail.",
      covers: [
        "Planned maintenance visits",
        "Multiple devices under one arrangement",
        "Ongoing technical support",
        "Scope agreed with you",
      ],
      signs: [
        "Several computers in an office",
        "Repeated small faults",
        "No one in-house for IT",
        "Equipment you cannot afford to lose",
      ],
    },
  },
};

const gu = {
  servicePages: {
    title: "સેવાઓ",
    metaDescription:
      "રાજકોટમાં ક્રિએટિવ એન્ટરપ્રાઇઝ તરફથી લેપટોપ, ડેસ્કટોપ, CCTV અને પ્રિન્ટર રિપેર, અપગ્રેડ અને મેઇન્ટેનન્સ.",
    badge: "વેચાણ અને સર્વિસ એક જ છત નીચે",
    headline: "રિપેર, અપગ્રેડ અને સપોર્ટ, રાજકોટમાં",
    subhead:
      "ચાલુ ન થતા લેપટોપથી લઈને તમારી દુકાન માટે CCTV સુધી. સમસ્યા જણાવો, બાકીનું અમે સંભાળીશું.",
    primaryCta: "સર્વિસ માટે વિનંતી કરો",
    secondaryCta: "પ્રોડક્ટ્સ જુઓ",
    candidateNotice:
      "આ સેવાઓની યાદી વ્યવસાય સાથે પુષ્ટિ થઈ રહી છે. ભાવ, સમય અને વોરંટી તમારી સાથે સીધા નક્કી થાય છે; આ સાઇટ પર કોઈ ભાવ અપાતો નથી.",
    gridHeading: "અમે શેમાં મદદ કરી શકીએ",
    gridSubtitle:
      "શું આવરી લેવાય છે અને વિનંતી કેવી રીતે થાય છે તે જોવા સેવા પસંદ કરો.",
    learnMore: "શું આવરી લેવાય છે તે જુઓ",
    processHeading: "સર્વિસ વિનંતી કેવી રીતે થાય છે",
    processSubtitle: "કામ ગમે તે હોય, આ જ ચાર પગલાં.",
    steps: {
      tell: {
        title: "સમસ્યા જણાવો",
        body: "સમસ્યા કે શું સેટઅપ કરવું છે તે વર્ણવો. સામાન્ય વર્ણન પૂરતું છે.",
      },
      assess: {
        title: "અમે તપાસીએ",
        body: "ડિવાઇસ લાવો, અથવા ઇન્સ્ટોલેશન અને ઓફિસ સાધનો માટે ઓન-સાઇટ મુલાકાત વિશે પૂછો.",
      },
      agree: {
        title: "આગળનું પગલું નક્કી કરીએ",
        body: "અમને શું મળ્યું તે સમજાવીએ અને આગળ વધતા પહેલા કામ તમારી સાથે નક્કી કરીએ.",
      },
      done: {
        title: "લઈ જાઓ અથવા અમે આવીએ",
        body: "રાજકોટ સ્ટોર પરથી લઈ જાઓ, અથવા અમે સ્થળ પર કામ પૂરું કરીએ.",
      },
    },
    productsBridge: {
      title: "નવું હાર્ડવેર જોઈએ છે?",
      body: "ક્યારેક રિપેર કરતા બદલવું સારું. લેપટોપ, ડેસ્કટોપ અને કમ્પોનન્ટ્સ જુઓ, જે ટીમ સર્વિસ કરે છે તે જ વેચે છે.",
      cta: "પ્રોડક્ટ્સ જુઓ",
    },
    breadcrumb: "બ્રેડક્રમ્બ",
    covers: "શું આવરી લેવાય છે",
    signs: "તમને ક્યારે જરૂર છે",
    problem: "તે કઈ સમસ્યા ઉકેલે છે",
    requestHeading: "આ સેવા માટે વિનંતી કરો",
    requestUnavailable:
      "વિનંતીઓ હજી ગોઠવાઈ નથી કારણ કે કોઈ સંપર્ક વિગતો આપવામાં આવી નથી. વ્યવસાય તે ઉમેરે પછી આ કામ કરશે.",
    related: "અન્ય સેવાઓ",
    candidateBadge: "પુષ્ટિ બાકી",
  },
  serviceCatalogue: {
    repair: {
      title: "લેપટોપ અને ડેસ્કટોપ રિપેર",
      summary:
        "ચાલુ ન થતા, ગરમ થતા, ક્રેશ થતા કે ધીમા લેપટોપ અને ડેસ્કટોપ માટે નિદાન અને રિપેર.",
      problem:
        "જે મશીન પર તમે નિર્ભર છો તે બંધ પડે, અને તે સુધરી શકે કે નહીં તે જાણવું હોય.",
      covers: [
        "ખામી નિદાન",
        "કમ્પોનન્ટ બદલી",
        "પાવર અને ચાર્જિંગ ખામી",
        "ગરમી અને ફેન સમસ્યા",
      ],
      signs: [
        "ચાલુ કે બૂટ થતું નથી",
        "બંધ થઈ જાય કે ગરમ થાય",
        "અચાનક ક્રેશ",
        "અસામાન્ય અવાજ",
      ],
    },
    screen: {
      title: "લેપટોપ સ્ક્રીન રિપ્લેસમેન્ટ",
      summary: "તૂટેલી, ઝબકતી કે બંધ લેપટોપ સ્ક્રીન બદલવી.",
      problem: "તૂટેલી સ્ક્રીન ચાલતા લેપટોપને નકામું બનાવે છે.",
      covers: [
        "તૂટેલી પેનલ",
        "ઝબકતી સ્ક્રીન કે લાઇન",
        "બેકલાઇટ ખામી",
        "હિન્જ અને બેઝલ સમસ્યા",
      ],
      signs: [
        "તિરાડ કે કાળા ડાઘ",
        "ઝબક કે રંગીન લાઇન",
        "સ્ક્રીન કાળી રહે",
        "ઢીલો કે કડક હિન્જ",
      ],
    },
    upgrades: {
      title: "હાર્ડવેર અપગ્રેડ",
      summary: "મેમરી, સ્ટોરેજ અને કમ્પોનન્ટ અપગ્રેડ, પહેલા સુસંગતતા ચકાસીને.",
      problem: "કમ્પ્યુટર હવેના કામ માટે ખૂબ ધીમું છે.",
      covers: [
        "RAM અપગ્રેડ",
        "SSD અપગ્રેડ અને ડેટા ટ્રાન્સફર",
        "ગ્રાફિક્સ અને કમ્પોનન્ટ બદલી",
        "ખરીદી પહેલા સુસંગતતા ચકાસણી",
      ],
      signs: [
        "ધીમું શરૂ થવું",
        "સ્ટોરેજ ભરાઈ ગયું",
        "નવા સોફ્ટવેરમાં મુશ્કેલી",
        "ગેમ કે ડિઝાઇન ટૂલ અટકે",
      ],
    },
    software: {
      title: "સોફ્ટવેર ટ્રબલશૂટિંગ",
      summary: "ઓપરેટિંગ સિસ્ટમ, સેટઅપ, અપડેટ અને અનિચ્છનીય સોફ્ટવેરમાં મદદ.",
      problem: "હાર્ડવેર બરાબર છે, પણ સોફ્ટવેર કામ અટકાવે છે.",
      covers: [
        "ઓપરેટિંગ સિસ્ટમ સમસ્યા",
        "સેટઅપ અને કોન્ફિગરેશન",
        "અપડેટ સમસ્યા",
        "અનિચ્છનીય સોફ્ટવેર દૂર કરવું",
      ],
      signs: [
        "શરૂઆતમાં એરર",
        "પ્રોગ્રામ ખૂલતા નથી",
        "પોપ-અપ કે અણધાર્યું વર્તન",
        "અપડેટ નિષ્ફળ",
      ],
    },
    cctv: {
      title: "CCTV ઇન્સ્ટોલેશન અને રિપેર",
      summary:
        "ઘર અને દુકાન માટે કેમેરા ઇન્સ્ટોલેશન, કેબલિંગ, કોન્ફિગરેશન અને ખામી શોધ.",
      problem: "તમારા ઘર કે વ્યવસાય પર શું થાય છે તે ભરોસાપૂર્વક જોવું.",
      covers: [
        "સ્થળ મૂલ્યાંકન",
        "કેમેરા અને રેકોર્ડર ઇન્સ્ટોલેશન",
        "કેબલિંગ અને કોન્ફિગરેશન",
        "હાલની સિસ્ટમમાં ખામી શોધ",
      ],
      signs: [
        "નવી જગ્યા કે કેમેરા નથી",
        "કેમેરા ઓફલાઇન કે ઝાંખા",
        "રેકોર્ડર ફૂટેજ સાચવતું નથી",
        "કવરેજમાં ખાલી જગ્યા",
      ],
    },
    printer: {
      title: "પ્રિન્ટર રિપેર અને સેટઅપ",
      summary: "ઘર અને ઓફિસ પ્રિન્ટર માટે સર્વિસિંગ, રિપેર અને સેટઅપ.",
      problem:
        "જામ થતું, કનેક્ટ ન થતું કે ખરાબ છાપતું પ્રિન્ટર આખી ઓફિસ અટકાવે છે.",
      covers: [
        "પેપર જામ અને ફીડ ખામી",
        "પ્રિન્ટ ગુણવત્તા સમસ્યા",
        "નેટવર્ક અને Wi-Fi સેટઅપ",
        "નિયમિત સર્વિસિંગ",
      ],
      signs: [
        "વારંવાર જામ",
        "લીટી કે ઝાંખું પ્રિન્ટ",
        "કનેક્ટ થતું નથી",
        "એરર લાઇટ",
      ],
    },
    amc: {
      title: "મેઇન્ટેનન્સ અને AMC",
      summary:
        "વ્યવસાયો માટે ચાલુ મેઇન્ટેનન્સ વ્યવસ્થા. કરારમાં શું આવરી લેવાય તે પૂછો.",
      problem: "દરેક મશીન બગડે તેની રાહ જોયા વિના અનેક મશીનો સારા રાખવા.",
      covers: [
        "આયોજિત મેઇન્ટેનન્સ મુલાકાત",
        "એક વ્યવસ્થા હેઠળ અનેક ડિવાઇસ",
        "ચાલુ ટેકનિકલ સપોર્ટ",
        "તમારી સાથે નક્કી થયેલ વ્યાપ",
      ],
      signs: [
        "ઓફિસમાં અનેક કમ્પ્યુટર",
        "વારંવાર નાની ખામી",
        "અંદર IT માટે કોઈ નથી",
        "ગુમાવી ન શકાય તેવા સાધનો",
      ],
    },
  },
};

for (const [file, add] of [
  ["src/i18n/messages/en.json", en],
  ["src/i18n/messages/gu.json", gu],
]) {
  const catalogue = JSON.parse(readFileSync(file, "utf8"));
  Object.assign(catalogue, add);
  writeFileSync(file, `${JSON.stringify(catalogue, null, 2)}\n`);
}
console.log("service copy written to both catalogues");
