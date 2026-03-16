import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "victor_emulator",
		identifier: "standalone.victor_emulator.davidnet.net",
		version: "0.0.1",
	},
	build: {
		// Vite builds to dist/, we copy from there
		copy: {
			"dist/index.html": "views/mainview/index.html",
			"dist/assets": "views/mainview/assets",
			"static/data": "views/data",
			"static/rom.zip": "views/rom.zip",
		},
		// Ignore Vite output in watch mode — HMR handles view rebuilds separately
		watchIgnore: ["dist/**"],
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: true,
			defaultRenderer: 'cef',
			chromiumFlags: {
				"enable-gpu": true,
				"ignore-gpu-blocklist": true,
				// Crucial for WebGL/WebGL2 on many Linux distros:
				"use-gl": "desktop",
				"enable-webgl": true,
				"enable-webgl2": true,
				// If "disable-gpu-sandbox" didn't work, try this:
				"no-sandbox": true,
				// Force the GPU rasterizer
				"enable-gpu-rasterization": true,
			}
		},
		win: {
			bundleCEF: false,
		},
	},
} satisfies ElectrobunConfig;
