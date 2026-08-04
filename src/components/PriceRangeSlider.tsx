interface PriceRangeSliderProps {
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    step?: number;
    onChange: (min: number, max: number) => void;
    minAriaLabel?: string;
    maxAriaLabel?: string;
}

function PriceRangeSlider({
    min,
    max,
    valueMin,
    valueMax,
    step = 1,
    onChange,
    minAriaLabel,
    maxAriaLabel,
}: PriceRangeSliderProps) {
    const range = Math.max(max - min, step);
    const minPercent = ((valueMin - min) / range) * 100;
    const maxPercent = ((valueMax - min) / range) * 100;

    const handleMinChange = (raw: number) => {
        onChange(Math.min(raw, valueMax), valueMax);
    };

    const handleMaxChange = (raw: number) => {
        onChange(valueMin, Math.max(raw, valueMin));
    };

    return (
        <div className="price-range-slider">
            <div className="price-range-readout">
                <span>${valueMin}</span>
                <span>${valueMax}</span>
            </div>
            <div className="price-range-track-wrap">
                <div className="price-range-track" />
                <div
                    className="price-range-fill"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />
                <input
                    type="range"
                    className="price-range-input"
                    min={min}
                    max={max}
                    step={step}
                    value={valueMin}
                    onChange={(e) => handleMinChange(Number(e.target.value))}
                    aria-label={minAriaLabel}
                />
                <input
                    type="range"
                    className="price-range-input"
                    min={min}
                    max={max}
                    step={step}
                    value={valueMax}
                    onChange={(e) => handleMaxChange(Number(e.target.value))}
                    aria-label={maxAriaLabel}
                />
            </div>
        </div>
    );
}

export default PriceRangeSlider;
