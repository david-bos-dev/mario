import { BrowserView, BrowserWindow, RPCSchema, Updater } from "electrobun/bun";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://127.0.0.1:${DEV_SERVER_PORT}`;

type RPC = {
    bun: RPCSchema<{
        requests: {
            openDevTools: { params: {}; response: void; };
            exitVictor: { params: {}; response: void; };
        };
        messages: {};
    }>;
    // 1. ADD MESSAGES TO THE WEBVIEW
    webview: RPCSchema<{
        requests: {};
        messages: {
            updateStatus: {
                state: "checking" | "downloading" | "applying" | "done" | "error";
            };
        };
    }>;
};

async function getMainViewUrl(): Promise<string> {
    const channel = await Updater.localInfo.channel();
    if (channel === "dev") {
        try {
            await fetch(DEV_SERVER_URL, { method: "HEAD" });
            console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
            return DEV_SERVER_URL;
        } catch {
            console.log("Vite dev server not running. Run 'bun run dev:hmr' for HMR support.");
        }
    }
    return "views://mainview/index.html";
}

const url = await getMainViewUrl();
let mainWindow: BrowserWindow;

const RPC = BrowserView.defineRPC<RPC>({
    maxRequestTime: 10000,
    handlers: {
        requests: {
            openDevTools: () => { mainWindow.webview.openDevTools(); },
            exitVictor: () => { mainWindow.close(); }
        },
    },
});

mainWindow = new BrowserWindow({
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

console.log("Svelte app started!");

async function enforceUpdatesIfOnline() {
    const channel = await Updater.localInfo.channel();
    if (channel === "dev") return;

    try {
        const updateAvailable = await Updater.checkForUpdate();

        if (updateAvailable) {
            await Updater.downloadUpdate();

            await Updater.applyUpdate(); 
        }
    } catch (error) {
        console.log("User is offline or update check failed. Proceeding normally.");
    }
}

// Fire the update check immediately after the window loads
enforceUpdatesIfOnline();