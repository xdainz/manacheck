import { useState } from "react";
import type { Card } from "../types/CardType";
import { exportList } from "../hooks/compareDecks";

interface ExportControlsProps {
    list: Card[];
    className: string;
}

export default function ExportControls({
    list,
    className,
}: ExportControlsProps) {
    const [exporting, setExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportList(list);
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
                {exporting ? "Copying…" : "Copy to clipboard"}
            </button>
            <div>
                {copied ? <span className="text-success">Copied!</span> : null}
            </div>
        </div>
    );
}
