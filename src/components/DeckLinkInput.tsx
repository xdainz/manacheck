import useTranslation from "../hooks/useTranslation";

interface DeckLinkInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    clearAriaLabel: string;
    inputAriaLabel?: string;
    disabled?: boolean;
}

export default function DeckLinkInput({
    value,
    onChange,
    placeholder,
    clearAriaLabel,
    inputAriaLabel,
    disabled = false,
}: DeckLinkInputProps) {
    const { t } = useTranslation();

    return (
        <div className="input-row">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="form-control"
                required
                aria-label={inputAriaLabel}
            />
            <button
                type="button"
                className="input-clear"
                onClick={() => onChange("")}
                disabled={!value || disabled}
                aria-label={clearAriaLabel}
            >
                {t("result.clear")}
            </button>
        </div>
    );
}
