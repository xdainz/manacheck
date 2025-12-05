import Footer from "./Footer";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div>
            {children}
            <Footer />
        </div>
    );
}

export default Layout;
