import { useState } from "react";
import useTranslation from "../hooks/useTranslation";

export default function SupportedSitesTooltip() {
    const { t } = useTranslation();
    const [showHint, setShowHint] = useState(false);

    const hint = t("common.supportedSites");

    // Tooltip opens on hover/focus via CSS; the click toggle covers touch
    // devices, where neither hover nor title attributes work.
    return (
        <button
            type="button"
            className={
                "lang-button info-tooltip" + (showHint ? " show-tooltip" : "")
            }
            aria-label={hint}
            data-tooltip={hint}
            onClick={() => setShowHint((value) => !value)}
            onBlur={() => setShowHint(false)}
        >
            ?
        </button>
    );
}
