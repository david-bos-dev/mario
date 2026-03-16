<script>
  import { onMount } from "svelte";

  // Define your "env variables" as props
  export let core = "n64";
  export let gameUrl = "/rom.zip";

  let gameContainer;

  onMount(() => {
    // Gebruik absolute paden vanaf de root van de server/app
    // @ts-ignore
    window.EJS_player = "#game-container";
    // @ts-ignore
    window.EJS_core = core;
    // @ts-ignore
    window.EJS_pathtodata = "/data/";
    // @ts-ignore
    window.EJS_gameUrl = gameUrl;

    const script = document.createElement("script");
    script.src = "/data/loader.js"; 
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  });
</script>

<div class="emulator-wrapper">
  <div id="game-container" bind:this={gameContainer}></div>
</div>

<style>
  .emulator-wrapper {
    width: 100%;
    height: 100%; /* Or 100vh depending on your layout */
    background: #000;
  }

  #game-container {
    width: 100%;
    height: 100%;
  }
</style>
