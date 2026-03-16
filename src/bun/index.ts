import { BrowserView, BrowserWindow, RPCSchema, Updater } from "electrobun/bun";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://127.0.0.1:${DEV_SERVER_PORT}`;

type RPC = {
	bun: RPCSchema<{
		requests: {
			openDevTools: {
				params: {};
				response: void;
			};
		};
		messages: {};
	}>;
	webview: RPCSchema<{
		requests: {};
		messages: {};
	}>;
};


// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === "dev") {
		try {
			await fetch(DEV_SERVER_URL, { method: "HEAD" });
			console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
			return DEV_SERVER_URL;
		} catch {
			console.log(
				"Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
			);
		}
	}
	return "views://mainview/index.html";
}

// Create the main application window
const url = await getMainViewUrl();
let mainWindow: BrowserWindow;

const RPC = BrowserView.defineRPC<RPC>({
	maxRequestTime: 10000,
	handlers: {
		requests: {
			openDevTools: () => {
				mainWindow.webview.openDevTools();
			},
		},
	},
});

mainWindow= new BrowserWindow({
	title: "DE PEAK VICTOR EMULATOR",
	url,
	rpc: RPC,
	frame: {
		width: 900,
		height: 700,
		x: 200,
		y: 200,
	}
});

mainWindow.maximize();



console.log("Svelte app started!");
