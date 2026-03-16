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
			"static/data": "views/mainview/data",
			"static/rom.zip": "views/mainview/rom.zip",
		},
		// Ignore Vite output in watch mode — HMR handles view rebuilds separately
		watchIgnore: ["dist/**"],
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: true,
			defaultRenderer: 'cef',
		},
		win: {
			bundleCEF: false,
		},
	},
} satisfies ElectrobunConfig;
