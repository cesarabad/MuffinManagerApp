import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./assets/i18n/es.json";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es }
  },
  lng: navigator.language.slice(0,2), // Detecta el idioma del dispositivo
  fallbackLng: "es", // Si el idioma no está disponible, usa inglés
  interpolation: { escapeValue: false }
});

export default i18n;


