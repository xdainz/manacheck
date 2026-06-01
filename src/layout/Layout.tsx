import { NavLink } from "react-router-dom";
import { storeList } from "../constants";
import Logo from "../components/Logo";
import Footer from "./Footer";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
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
                            Home
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
                </div>
            </header>
            <main className="app-main">{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
