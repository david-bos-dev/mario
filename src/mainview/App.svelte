<script lang="ts">
  import { onMount } from "svelte";
  import Emulator from "./Emulator.svelte";
  import Loader from "./Loader.svelte";
  import Electrobun, { Electroview } from "electrobun/view";
  import type { RPCSchema } from "electrobun/view";

  let loading = $state(true);

  type RPC = {
    bun: RPCSchema<{
      requests: {
        openDevTools: { params: {}; response: void };
        exitVictor: { params: {}; response: void };
      };
      messages: {};
    }>;
    webview: RPCSchema<{
      requests: {};
      messages: {};
    }>;
  };

  // 1. Definieer het recept
  const rpcSchema = Electroview.defineRPC<RPC>({
    handlers: {
      requests: {},
      messages: {},
    },
  });

  // 2. MAAK DE INSTANTIE AAN (Dit miste je!)
  const electrobun = new Electrobun.Electroview({ rpc: rpcSchema });
  const rpc = electrobun.rpc;

  onMount(() => {
    setTimeout(() => {
      const canvas = document.createElement("canvas");
      const gl2 = canvas.getContext("webgl2");
      const gl1 = canvas.getContext("webgl");

      console.log("WebGL 2 support:", !!gl2);
      console.log("WebGL 1 support:", !!gl1);

      if (!gl2 && !gl1) {
        console.error(
          "GPU Acceleration is totally disabled in this CEF instance.",
        );
        error = "GPU Acceleration disabled in CEF!";
      }

      loading = false;

      window.addEventListener("keydown", (event) => {
        if (event.code === "KeyG") {
          rpc!.request("exitVictor", {});
        }
      });
    }, 1000);
  });

  let error = $state("");
</script>

{#if error}
  <div class="center">
    <p style="font-size: 3rem; color: red">
      Victor heeft een dodelijke error opgelopen.
    </p>
    <p style="color: white;">{error}</p>
    <button onclick={() => rpc!.request("openDevTools", {})}>
      Open DevTools
    </button>
    <button
      onclick={() => {
        location.reload();
      }}>Reset victor</button
    >
  </div>
{:else if !loading}
  <div class="main">
    <Emulator />
    <div class="bottombar">
      <button
        onclick={() => {
          location.reload();
        }}>Reset victor</button
      >
      <button onclick={() => rpc!.request("openDevTools", {})}>
        Open DevTools
      </button>
      <button onclick={() => (location.href = "https://google.com")}>
        Unblocked google.com
      </button>
      <button onclick={() => rpc!.request("exitVictor", {})}>
        Exit (G)
      </button>
    </div>
  </div>
{:else}
  <div class="center">
    <Loader />
  </div>
{/if}

<style>
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    flex-direction: column;
    gap: 1rem;
  }

  .main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .bottombar {
    background-color: black;
    padding: 0.5rem;
  }

  button {
    color: black;
    background-color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
</style>
