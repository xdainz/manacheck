import { useState } from "react";
import type { Card } from "../types/CardType";
import { exportList } from "../hooks/compareDecks";

export default function ExportControls({ list }: { list: Card[] }) {
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
        <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
                {copied ? <span className="text-success">Copied!</span> : null}
            </div>
            <button
                className="button mx-auto my-3"
                onClick={handleExport}
                disabled={exporting}
            >
                {exporting ? "Copying…" : "Copy to clipboard"}
            </button>
        </div>
    );
}
