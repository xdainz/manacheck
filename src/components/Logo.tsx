import { useEffect, useState } from "react";
import logo from "../../logo.txt";
import { Link } from "react-router-dom";

interface LogoProps {
    className?: string;
}

function Logo({ className }: LogoProps) {
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
    const wrapperClass = className ? `logo ${className}` : "logo";

    return (
        <div className={wrapperClass}>
            <Link to="/">
                <pre>{logoText}</pre>
            </Link>
        </div>
    );
}

export default Logo;
