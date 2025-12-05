import { useEffect, useState } from "react";
import logo from "../../logo.txt";

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
        <div className="pre">
            <pre>{logoText}</pre>
        </div>
    );
}

export default Logo;
