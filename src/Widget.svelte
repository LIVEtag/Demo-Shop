<script>
  import { onDestroy, onMount } from 'svelte';

  export let src = '';
  export let ready = false;
  export let minimized = false;
  export let timeout = 10000;
  export let onLoad = () => undefined;
  export let onError = () => undefined;

  let timeoutId;

  onMount(() => {
    timeoutId = setTimeout(() => {
      onError();
    }, timeout);
  });

  onDestroy(() => {
    clearTimeout(timeoutId);
  });

  function handleLoad(event) {
    clearTimeout(timeoutId);

    onLoad(event);
  }
</script>

<iframe
  title="Livetag"
  class="livetag__iframe {ready ? 'livetag__iframe--ready' : ''} {minimized ? 'livetag__iframe--minimized' : ''}"
  src={src}
  on:load={handleLoad}
  allow="fullscreen; autoplay;"
  allowtransparency="true"
></iframe>

<style>
  .livetag__iframe {
    width: 100% !important;
    height: 100% !important;
    opacity: 0 !important;
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    position: relative !important;
    top: initial !important;
    left: initial !important;
    right: initial !important;
    bottom: initial !important;
    box-sizing: border-box !important;
  }

  .livetag__iframe--ready {
    opacity: 1 !important;
    transition: opacity 0.2s ease-in;
    padding: 3em !important;
  }

  .livetag__iframe--minimized {
    padding: 0 !important;
  }
</style>
