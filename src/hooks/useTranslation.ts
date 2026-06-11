import { useCallback, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translate } from "../lib/translations";
import type { TranslationKey } from "../lib/translations";

export default function useTranslation() {
    const { language, setLanguage } = useContext(LanguageContext);

    const t = useCallback(
        (key: TranslationKey, params?: Record<string, string | number>) =>
            translate(language, key, params),
        [language],
    );

    return { language, setLanguage, t };
}
