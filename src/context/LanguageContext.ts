import { createContext } from "react";
import type { Language } from "../lib/translations";

export interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
    language: "en",
    setLanguage: () => {},
});
