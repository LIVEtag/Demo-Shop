import App from './App.svelte';

let defaultConfig = { project: undefined, widgetOrigin: undefined, autoInit: false };
let config = Object.assign({}, defaultConfig, window.LivetagConfig);
let app;

function init() {
  if (app) {
    console.info('[Livetag] Already initialized.');

    return;
  }

  app = new App({
    target: document.body,
    props: {
      shopId: config.project,
      widgetOrigin: config.widgetOrigin,
    },
  });

  registerListener();

  console.log('[Livetag] Initialized.');
}

function documentClickHandler(e) {
  if (!app) {
    return;
  }

  if (e.target.dataset && 'livetag' in e.target.dataset) {
    app.$set({
      open: true,
      minimized: 'livetagMinimized' in e.target.dataset,
      sessionId: e.target.dataset.livetag,
    });
  }
}

function registerListener() {
  document.addEventListener('click', documentClickHandler, { passive: true });
}

function removeListeners() {
  document.removeEventListener('click', documentClickHandler);
}

export default {
  init,
  open(sessionId, params = {}) {
    if (!app) {
      initError();

      return;
    }

    app.$set({
      open: true,
      sessionId,
      minimized: params ? Boolean(params.minimized) : false,
    });
  },
  close() {
    if (!app) {
      initError();

      return;
    }

    app.$set({ open: false });
  },
  minimize() {
    if (!app) {
      initError();

      return;
    }

    app.$set({ minimize: true });
  },
  maximize() {
    if (!app) {
      initError();

      return;
    }

    app.$set({ minimize: false });
  },
  on(eventName, listener) {
    if (!app) {
      initError();

      return;
    }

    return app.$on(eventName, listener);
  },
  destroy() {
    if (!app) {
      initError();

      return;
    }

    app.$destroy();
    app = undefined;
    removeListeners();
  },
};

function initError() {
  console.error('[Livetag] Call "Livetag.init()" first.');
}

//
// Initialize Livetag
//
if (config.autoInit) {
  init();
}
