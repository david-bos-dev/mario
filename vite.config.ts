import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
	plugins: [svelte()],
	root: "src/mainview",
	publicDir: path.resolve(__dirname, "static"),
	build: {
		outDir: "../../dist",
		emptyOutDir: true,
	},
	server: {
        port: 5173,
        strictPort: true,
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        }
    },
    preview: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        }
    }
});