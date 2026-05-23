type SheetRow = {
    NAME: string;
    URL: string;
};

// defaults
const googleSheetId = "1tSxr2csJL4O19_Q0ARCDsxHzguy9d66X8aLD30c7OiM";
const defaultUrl = `https://docs.google.com/spreadsheets/d/${googleSheetId}/export?format=csv&gid=`;

export async function fetchSheetCsv(storeId: number): Promise<SheetRow[]> {
    const res = await fetch(defaultUrl + storeId);
    if (!res.ok) {
        throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
    }

    const csvText = await res.text();
    return parseCsv(csvText);
}

function parseCsv(csvText: string): SheetRow[] {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) return [];

    const headers = splitCsvLine(lines[0]).map((h) => h.trim());
    const rows: SheetRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = splitCsvLine(lines[i]);
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ?? "";
        });

        rows.push({
            NAME: row["NAME"] ?? "",
            URL: row["URL"] ?? "",
        });
    }

    return rows;
}

function splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current);
    return result.map((v) => v.trim());
}
