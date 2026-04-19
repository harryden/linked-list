import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Import translations directly for synchronous access (critical for tests and initial load)
import enTranslation from "../../public/locales/en/translation.json";
import svTranslation from "../../public/locales/sv/translation.json";

const resources = {
  en: { translation: enTranslation },
  sv: { translation: svTranslation },
};

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources, // Provide static resources as a baseline
    supportedLngs: ["en", "sv"],
    load: "languageOnly",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
