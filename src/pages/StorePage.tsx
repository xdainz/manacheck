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
        <div className="container store-page">
            <div className="box store-banner">
                <img
                    className="store-logo"
                    src={store.image_banner}
                    alt={store.full_name + " logo"}
                />
                <h1>
                    <a
                        className="store-website"
                        href={store.website}
                        target="_blank"
                    >
                        {store.full_name}
                    </a>
                </h1>
            </div>
            <StoreSearch storeName={store.name} />
        </div>
    );
}

export default StorePage;
