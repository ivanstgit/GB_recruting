import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .use(resourcesToBackend(
        (language, namespace) => import(`./locales/${language}/${namespace}.json`)))

i18n.init({
    // debug: true,
    fallbackLng: {
        default: ['ru'],
        ru: ['ru']
    }
})

export default i18n;