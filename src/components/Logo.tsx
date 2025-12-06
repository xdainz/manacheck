import { useEffect, useState } from "react";
import logo from "../../logo.txt";
import { Link } from "react-router-dom";

function Logo() {
    const [logoText, setLogoText] = useState<string>("");

    useEffect(() => {
        fetch(logo)
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.text();
            })
            .then(setLogoText)
            .catch((err) => {
                console.error(err);
                setLogoText("Failed to load logo");
            });
    }, []);
    return (
        <div className="logo container mx-3 pt-3">
            <Link to="/">
                <pre>{logoText}</pre>
            </Link>
        </div>
    );
}

export default Logo;
