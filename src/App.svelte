<script>
  import { widget, getState } from './store';
  import Widget from './Widget.svelte';
  import Loader from './Loader.svelte';
  import { drag } from './draggable';
  import { beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte';
  import {
    createSignal,
    SIGNAL_CHECKOUT,
    SIGNAL_CLOSE,
    SIGNAL_INIT,
    SIGNAL_MINIMIZE,
    SIGNAL_PRODUCT_ADD_TO_CART,
    SIGNAL_PRODUCT_VIEW,
    SIGNAL_READY,
    SIGNAL_RESTORE,
  } from './signal';
  import { createWidgetUrl } from './create-widget-url';
  import { generateUid, getUid, storeUid } from './uid';

  let uid = getUid() || generateUid();
  storeUid(uid);

  let dispatch = createEventDispatcher();

  let channel;
  let port;
  let loadingError = false;

  //
  // Shop props
  //
  export let shopId;
  export let widgetOrigin;
  export let sessionId = null;
  let isDesktop = true;

  //
  // Widget state props
  //
  export let open = false;
  export let minimized = false;
  let ready = false;
  let translate = null;

  $: widgetUrl = createWidgetUrl({ origin: widgetOrigin, project: shopId, uid, sessionId, isDesktop });
  $: translateStyle = minimized && translate && (translate.x || translate.y) ? `translate3d(${translate.x || 0}px, ${translate.y || 0}px, 0)` : '';

  beforeUpdate(() => {
    if (!open && loadingError) {
      loadingError = false;
    }
  });

  afterUpdate(() => {
    signal(SIGNAL_MINIMIZE, minimized);
    widget.set({ open, minimized, sessionId, translate });
  });

  //
  // Get initial state data and unsubscribe from store
  //
  getState(widget, (state) => {
    open = state.open;
    minimized = state.minimized;
    sessionId = state.sessionId;
    translate = state.translate;
  });

  function close() {
    open = false;
    ready = false;
    minimized = false;
    translate = null;
  }

  function minimize() {
    minimized = true;
  }

  function restore() {
    minimized = false;
    translate = null;
  }

  const signalHandlers = {
    [SIGNAL_READY]: (event, data) => {
      ready = true;

      signal(SIGNAL_MINIMIZE, minimized);
    },
    [SIGNAL_MINIMIZE]: (event, data) => {
      minimize();
    },
    [SIGNAL_CLOSE]: (event, data) => {
      close();
    },
    [SIGNAL_RESTORE]: (event, data) => {
      restore();

      signal(SIGNAL_MINIMIZE, minimized);
    },
    [SIGNAL_PRODUCT_ADD_TO_CART]: (event, data) => {
      dispatch('addToCart', data);
    },
    [SIGNAL_PRODUCT_VIEW]: (event, data) => {
      dispatch('viewProduct', data);
    },
    [SIGNAL_CHECKOUT]: (event, data) => {
      dispatch('checkout', data);
    },
  };

  function signal(type, payload = null) {
    if (port) {
      port.postMessage(createSignal(type, payload));
    }
  }

  const onLoad = function ({ target: { contentWindow } }) {
    channel = new MessageChannel();
    port = channel.port1;
    port.onmessage = handleSignal;

    function onMessage(e) {
      if (e.origin === widgetOrigin && e.data === 'loaded') {
        contentWindow.postMessage(createSignal(SIGNAL_INIT), widgetOrigin, [channel.port2]);

        window.removeEventListener('message', onMessage);
      }
    }

    window.addEventListener('message', onMessage);
  };

  function handleSignal(event) {
    const { data } = event;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Livetag] Signal', data);
    }

    if (signalHandlers[data.type]) {
      signalHandlers[data.type](event, data.payload);
    }
  }

  function handleIframeError() {
    loadingError = true;
  }

  function onDragEnd({ detail: { x, y } }) {
    if (translate === null || (translate.x !== x || translate.y !== y)) {
      translate = { x, y };
    }
  }
</script>

<div id="livetag">
  {#if open}
    <div class="livetag__box {minimized ? 'livetag__box--minimized' : ''}" style="transform: {translateStyle}" use:drag={minimized} on:drag-end={onDragEnd}>
      {#if !ready && !loadingError}
        <Loader/>
      {/if}

      {#if !loadingError}
        <Widget src={widgetUrl} {ready} {minimized} {onLoad} onError={handleIframeError} timeout={1000}/>
      {:else}
        <div class="livetag__error" on:click={close}>Error loading widget.</div>
      {/if}

      {#if minimized}
        <div class="livetag__overlay"></div>

        <div class="livetag__btns">
          <button class="livetag__btn livetag__btn-restore" on:click={restore}>Restore</button>
          <button class="livetag__btn livetag__btn-close" on:click={close}>Close</button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :root {
    --livetag-loader-size: 48px;
    --livetag-widget-width--minimized: 240px;
    --livetag-widget-height--minimized: calc(var(--livetag-widget-width--minimized) * 1.6);
  }

  .livetag__btns {
    position: absolute;
    top: 0;
  }

  .livetag__error {
    display: flex;
    place-content: center;
    place-items: center;
    height: 100%;
  }

  .livetag__box {
    background-color: rgba(0, 0, 0, 0.55);
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    z-index: 2147483647;
  }

  .livetag__box--minimized {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 10px;
    margin-right: 10px;
    user-select: none;
    line-height: 0;
    width: var(--livetag-widget-width--minimized);
    height: var(--livetag-widget-height--minimized);
    box-shadow: 0 0 6px 2px #aaa;
    border-radius: 10px;
    overflow: hidden;
  }

  .livetag__overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
</style>
