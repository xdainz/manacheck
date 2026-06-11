import { Link } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="container mt-3 max-width-800">
            <h1 className="pink-text">404</h1>
            <h2>{t("notFound.title")}</h2>
            <h3>
                {t("notFound.goPrefix")}
                <Link to="/">{t("notFound.goLink")}</Link>
                {t("notFound.goSuffix")}
            </h3>
        </div>
    );
}
