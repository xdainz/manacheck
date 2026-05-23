import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./layout/Layout";
import StorePage from "./pages/StorePage";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:name" element={<StorePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
