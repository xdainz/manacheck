import useTranslation from "../hooks/useTranslation";
import type { ExportGroup } from "../lib/export";
import type { Card } from "../types/types";
import ExportControls from "./ExportControls";

function SearchResult({
    list,
    groups,
    margin_top,
}: {
    list: Card[];
    groups?: ExportGroup[];
    margin_top: string;
}) {
    const { t } = useTranslation();

    // Intentionally sums single-card prices, ignoring Quantity (see CLAUDE.md)
    const totalPrice =
        Math.round(
            list.reduce((accumulator, card) => {
                return accumulator + (isNaN(card.ck_price) ? 0 : card.ck_price);
            }, 0) * 100,
        ) / 100;

    return (
        <div
            className={
                "box mb-2 search-result deck-comparator mt-" + margin_top
            }
        >
            <div className="row g-3 align-items-center">
                <div className="col-12 col-md-6 col-lg-3">
                    <h2 className="mb-0">{t("result.title")}</h2>
                </div>
                <div className="col-6 col-md-3 col-lg-3">
                    <p className="mb-0">
                        <strong>{t("result.cardsFound")}</strong> {list.length}
                    </p>
                </div>
                <div className="col-6 col-md-3 col-lg-3">
                    <p className="mb-0">
                        <strong>{t("result.totalPrice")}</strong>{" "}
                        <span className="price">${totalPrice}</span>
                    </p>
                </div>
                <div className="col-12 col-md-12 col-lg-3">
                    <ExportControls
                        list={list}
                        groups={groups}
                        className="export-controls w-100"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchResult;
