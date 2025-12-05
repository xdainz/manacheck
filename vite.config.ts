import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    base: "/manacheck",
    plugins: [react()],
    server: {
        proxy: {
            // Proxy manabox requests during development to avoid CORS
            "/api/manabox": {
                target: "https://manabox.app",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/manabox/, ""),
                configure: (proxy) => {
                    // Add headers on the proxied request so remote servers see a normal browser request
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader(
                            "User-Agent",
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
                        );
                        proxyReq.setHeader("Referer", "https://manabox.app/");
                        proxyReq.setHeader(
                            "Accept",
                            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                        );
                    });
                },
            },
            // Proxy Moxfield API requests during development to avoid CORS
            "/api/moxfield": {
                target: "https://api2.moxfield.com",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/moxfield/, ""),
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader(
                            "User-Agent",
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
                        );
                        proxyReq.setHeader(
                            "Accept",
                            "application/json, text/plain, */*"
                        );
                    });
                },
            },
        },
    },
});
