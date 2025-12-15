import type { Card } from "../types/CardType";
import ExportControls from "./ExportControls";

function SearchResult({ list }: { list: Card[] }) {
    const totalPrice =
        Math.round(
            list.reduce((accumulator, card) => {
                return accumulator + card.ck_price;
            }, 0) * 100
        ) / 100;

    return (
        <div className="box mb-3 search-result mt-3">
            <div className="row g-3 align-items-center">
                <div className="col-12 col-md-6 col-lg-3">
                    <h2 className="mb-0">Search Results</h2>
                </div>
                <div className="col-6 col-md-3 col-lg-3">
                    <p className="mb-0">
                        <strong>Cards Found:</strong> {list.length}
                    </p>
                </div>
                <div className="col-6 col-md-3 col-lg-3">
                    <p className="mb-0">
                        <strong>Total Price:</strong>{" "}
                        <span className="price">${totalPrice}</span>
                    </p>
                </div>
                <div className="col-12 col-md-12 col-lg-3">
                    <ExportControls list={list} className="w-100" />
                </div>
            </div>
        </div>
    );
}

export default SearchResult;
