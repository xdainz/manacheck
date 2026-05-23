import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container mt-3 max-width-800">
            <h1 className="pink-text">404</h1>
            <h2>Page not found.</h2>
            <h3>
                Go <Link to="/">back</Link> to the homepage.
            </h3>
        </div>
    );
}
