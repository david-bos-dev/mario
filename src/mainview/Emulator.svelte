<script>
  import { onMount } from "svelte";

  export let core = "n64";
  export let gameUrl = "/rom.zip";

  let gameContainer; // Gefixed: deze variabele ontbrak in je script block

  onMount(() => {
    // Electrobun specifieke fix: 
    // We bouwen het pad handmatig op basis van het protocol
    const protocol = window.location.protocol; // "views:"
    const host = window.location.host;         // Leeg of de app identifier
    
    // Bij Electrobun wijst de root vaak naar de 'views' folder
    const baseUrl = `${protocol}//${host}`;
    
    // Omdat je config zegt: static/data -> views/data
    const dataPath = `${baseUrl}/data/`; 
    // Omdat je config zegt: static/rom.zip -> views/rom.zip
    const fullGameUrl = `${baseUrl}/rom.zip`;

    console.log("EmulatorJS Path:", dataPath);
    console.log("Game URL:", fullGameUrl);

    // @ts-ignore
    window.EJS_player = "#game-container";
    // @ts-ignore
    window.EJS_core = core; 
    // @ts-ignore
    window.EJS_pathtodata = dataPath; 
    // @ts-ignore
    window.EJS_gameUrl = fullGameUrl;

    const script = document.createElement("script");
    script.src = `${dataPath}loader.js`; 
    script.async = true;
    
    // Error handling voor het script zelf
    script.onerror = () => console.error("Failed to load loader.js van:", script.src);
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  });
</script>

<div class="emulator-wrapper">
  <div id="game-container" bind:this={gameContainer}></div>
</div>

<style>
  .emulator-wrapper {
    width: 100vw;
    height: 100vh;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #game-container {
    width: 100%;
    height: 100%;
  }
</style>