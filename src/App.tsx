import { HashRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./layout/Layout";

function App() {
    return (
        <HashRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Layout>
        </HashRouter>
    );
}

export default App;
