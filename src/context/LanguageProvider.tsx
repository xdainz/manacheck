import { useCallback, useEffect, useMemo, useState } from "react";
import type { Language } from "../lib/translations";
import { LanguageContext } from "./LanguageContext";

const LANGUAGE_STORAGE_KEY = "manacheck.lang";

function getInitialLanguage(): Language {
    if (typeof window === "undefined" || !window.localStorage) return "en";
    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === "en" || stored === "es") return stored;
    } catch {
        // ignore storage errors
    }
    return "en";
}

export default function LanguageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = useCallback((next: Language) => {
        setLanguageState(next);
        try {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
        } catch {
            // ignore storage errors
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(
        () => ({ language, setLanguage }),
        [language, setLanguage],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
