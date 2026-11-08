import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from https://<user>.github.io/TV_Shows_Explorer/
  base: "/TV_Shows_Explorer/",
  plugins: [react()],
});
