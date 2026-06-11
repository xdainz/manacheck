import { useParams } from "react-router-dom";
import StoreSearch from "../components/StoreSearch";
import { storeList } from "../constants";
import NotFound from "./NotFound";

function StorePage() {
    const { name } = useParams();

    const store = storeList.find(
        (item) => item.name.toLocaleLowerCase() === name?.toLocaleLowerCase(),
    );

    if (!store) {
        return <NotFound />;
    }

    return (
        <div className="container home-page">
            <StoreSearch storeName={store.name} />
        </div>
    );
}

export default StorePage;
