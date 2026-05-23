import { useParams } from "react-router-dom";
import StoreSearch from "../components/StoreSearch";
import { storeList } from "../constants";

function StorePage() {
    const { name } = useParams();

    if (name) {
        if (!storeList.some((item) => item.name === name)) {
            // redirect to 404
        }

        return (
            <div className="container mt-3 max-width-800">
                <h1>{name}</h1>
                <StoreSearch storeName={name} />
            </div>
        );
    }
}

export default StorePage;
