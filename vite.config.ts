import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

import pkg from "./package.json" with { type: "json" };
import { execSync } from "child_process";

const rawRepoUrl = "https://github.com/david-bos-dev/mario/"
const repoUrl = rawRepoUrl.replace(/^git\+/, "").replace(/\.git$/, "");
const commitHash = execSync("git rev-parse HEAD").toString().trim();
const commitUrl = `${repoUrl}/commit/${commitHash}`;

export default defineConfig({
	plugins: [svelte()],
	root: "src/mainview",
	publicDir: path.resolve(__dirname, "static"),
	build: {
		outDir: "../../dist",
		emptyOutDir: true,
	},
	define: {
		__BUILD_INFO__: {
			commitHash: JSON.stringify(commitHash),
			commitUrl: JSON.stringify(commitUrl),
			buildTime: JSON.stringify(new Date().toISOString())
		}
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
