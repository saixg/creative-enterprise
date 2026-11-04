/**
 * Writes the admin-area copy into both message catalogues.
 * Gujarati is a draft pending review, like the rest of gu.json.
 *
 * Run: node scripts/copy/admin.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const en = {
  admin: {
    metaTitle: "Admin",
    signIn: {
      title: "Admin sign in",
      subtitle: "For Creative Enterprise staff only.",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      submitting: "Signing in...",
      errors: {
        invalid: "That email and password did not match an account.",
        not_admin: "This account does not have admin access.",
      },
      back: "Back to the website",
    },
    nav: {
      dashboard: "Dashboard",
      products: "Products",
      services: "Services",
      inquiries: "Inquiries",
      requests: "Service requests",
      content: "Website content",
      soon: "Next",
    },
    signOut: "Sign out",
    signedInAs: "Signed in as {email}",
    viewSite: "View website",
    dashboard: {
      title: "Dashboard",
      subtitle: "A live view of what is in the database.",
      products: "Products",
      published: "{count} published",
      inquiries: "New inquiries",
      requests: "New service requests",
      empty:
        "The database is empty. The website still shows the placeholder catalogue until products are added here.",
      nextTitle: "Coming next",
      nextBody:
        "Product editing, inquiry and service request inboxes, and website content controls are the next milestone. This shell proves sign-in and access control first.",
    },
    checking: "Checking access...",
  },
};

const gu = {
  admin: {
    metaTitle: "એડમિન",
    signIn: {
      title: "એડમિન સાઇન ઇન",
      subtitle: "ફક્ત ક્રિએટિવ એન્ટરપ્રાઇઝ સ્ટાફ માટે.",
      email: "ઇમેઇલ",
      password: "પાસવર્ડ",
      submit: "સાઇન ઇન",
      submitting: "સાઇન ઇન થઈ રહ્યું છે...",
      errors: {
        invalid: "આ ઇમેઇલ અને પાસવર્ડ કોઈ ખાતા સાથે મેળ ખાતા નથી.",
        not_admin: "આ ખાતાને એડમિન ઍક્સેસ નથી.",
      },
      back: "વેબસાઇટ પર પાછા જાઓ",
    },
    nav: {
      dashboard: "ડેશબોર્ડ",
      products: "પ્રોડક્ટ્સ",
      services: "સેવાઓ",
      inquiries: "પૂછપરછ",
      requests: "સર્વિસ વિનંતીઓ",
      content: "વેબસાઇટ સામગ્રી",
      soon: "આગળ",
    },
    signOut: "સાઇન આઉટ",
    signedInAs: "{email} તરીકે સાઇન ઇન",
    viewSite: "વેબસાઇટ જુઓ",
    dashboard: {
      title: "ડેશબોર્ડ",
      subtitle: "ડેટાબેઝમાં શું છે તેનું જીવંત દૃશ્ય.",
      products: "પ્રોડક્ટ્સ",
      published: "{count} પ્રકાશિત",
      inquiries: "નવી પૂછપરછ",
      requests: "નવી સર્વિસ વિનંતીઓ",
      empty:
        "ડેટાબેઝ ખાલી છે. અહીં પ્રોડક્ટ્સ ઉમેરાય ત્યાં સુધી વેબસાઇટ પ્લેસહોલ્ડર કેટલોગ બતાવે છે.",
      nextTitle: "આગળ શું",
      nextBody:
        "પ્રોડક્ટ એડિટિંગ, પૂછપરછ અને સર્વિસ વિનંતી ઇનબોક્સ, અને વેબસાઇટ સામગ્રી નિયંત્રણ આગળનો તબક્કો છે. આ માળખું પહેલા સાઇન ઇન અને ઍક્સેસ નિયંત્રણ સાબિત કરે છે.",
    },
    checking: "ઍક્સેસ ચકાસી રહ્યા છીએ...",
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
console.log("admin copy written to both catalogues");
