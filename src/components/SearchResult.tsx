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
        <div className="box mb-3 search-result row my-3">
            <h2 className="col-sm-12 col-lg-3">Search Results</h2>
            <p className="col-sm-6 col-lg-3">Cards Found: {list.length}</p>
            <p className="col-sm-6 col-lg-3">
                Total Price: <label className="price">${totalPrice}</label>
            </p>
            <ExportControls list={list} className="col-sm-12 col-lg-3" />
        </div>
    );
}

export default SearchResult;
