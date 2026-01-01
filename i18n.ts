// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./public/locales/en/translation.json";
import vi from "./public/locales/vi/translation.json";

i18n.use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
        },
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false, // React đã xử lý việc escape các ký tự đặc biệt
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json", // Đường dẫn đến file ngôn ngữ
        },
    });

export default i18n;
