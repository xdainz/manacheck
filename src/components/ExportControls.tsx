import { useState } from "react";
import useTranslation from "../hooks/useTranslation";
import { exportGroupedList, exportList } from "../lib/export";
import type { ExportGroup } from "../lib/export";
import type { Card } from "../types/types";

interface ExportControlsProps {
    list: Card[];
    groups?: ExportGroup[];
    className: string;
}

export default function ExportControls({
    list,
    groups,
    className,
}: ExportControlsProps) {
    const { t } = useTranslation();
    const [exporting, setExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            if (groups && groups.length > 0) {
                await exportGroupedList(groups);
            } else {
                await exportList(list);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("exportList failed", e);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className={className}>
            <button
                className="button"
                onClick={handleExport}
                disabled={exporting}
            >
                {exporting ? t("export.copying") : t("export.copy")}
            </button>
            <div>
                {copied ? (
                    <span className="text-success">{t("export.copied")}</span>
                ) : null}
            </div>
        </div>
    );
}
