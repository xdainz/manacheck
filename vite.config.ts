import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Allow setting a custom `base` at build time via VITE_BASE env var.
// Example in workflow: `VITE_BASE: \/my-repo-name\/` (when deploying to project pages)
const base = process.env.VITE_BASE || "/";

// https://vite.dev/config/
export default defineConfig({
    base,
    plugins: [react()],
});
