import { writable, get } from 'svelte/store';

const store = {
  get(key, defaultValue) {
    try {
      return JSON.parse(localStorage.getItem(`livetag.${key}`)) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    localStorage.setItem(`livetag.${key}`, JSON.stringify(value));
  },
};

const initialState = {
  open: false,
  minimized: false,
  translate: null,
  sessionId: null,
};

export const widget = writable(
  Object.assign({}, initialState, store.get('widget', initialState)),
);

export const getState = (store, fn) => {
  const state = get(store);

  fn(state);
};

//
// Persist state to localStorage
//
widget.subscribe((value) => {
  store.set('widget', value);
});
