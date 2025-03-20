import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import NodeStdlibBrowser from "vite-plugin-node-stdlib-browser";

export default defineConfig({
  plugins: [react(), NodeStdlibBrowser()],
  resolve: {
    alias: {
      global: "vite-plugin-node-stdlib-browser/global",
    },
  },
});
