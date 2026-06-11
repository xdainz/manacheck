import { NavLink } from "react-router-dom";
import { storeList } from "../constants";
import Logo from "../components/Logo";
import useTranslation from "../hooks/useTranslation";
import Footer from "./Footer";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const { language, setLanguage, t } = useTranslation();

    return (
        <div className="app-shell">
            <header className="site-header">
                <div className="site-header-inner">
                    <Logo className="site-logo" />
                    <nav className="site-nav mx-auto" aria-label="Primary">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            {t("nav.home")}
                        </NavLink>
                        {storeList.map((store) => (
                            <NavLink
                                key={store.name}
                                to={`/${store.name}`}
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                {store.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="lang-toggle" role="group" aria-label="Language">
                        <button
                            type="button"
                            className={
                                language === "en"
                                    ? "lang-button active"
                                    : "lang-button"
                            }
                            onClick={() => setLanguage("en")}
                            aria-pressed={language === "en"}
                        >
                            EN
                        </button>
                        <button
                            type="button"
                            className={
                                language === "es"
                                    ? "lang-button active"
                                    : "lang-button"
                            }
                            onClick={() => setLanguage("es")}
                            aria-pressed={language === "es"}
                        >
                            ES
                        </button>
                    </div>
                </div>
            </header>
            <main className="app-main">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
