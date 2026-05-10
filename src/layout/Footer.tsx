import { Link } from "react-router-dom";

function Footer() {
    return (
        <>
            <div className="footer mt-5 text-center">
                <a
                    href="https://github.com/xdainz/manacheck"
                    target="_blank"
                    className="brand"
                >
                    Manacheck
                </a>{" "}
                was developed by{" "}
                <a href="https://github.com/xdainz" target="_blank">
                    xdainz
                </a>
                <br />
                <Link to={"/store"}>Stores (Experimental)</Link>
            </div>
        </>
    );
}

export default Footer;
