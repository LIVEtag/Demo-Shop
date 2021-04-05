<script>
  import { onMount } from 'svelte';
  import Cart from './Cart.svelte';

  let livetag;

  let sessionId = null;
  let minimized = false;

  let products = [];

  onMount(() => {
    let unsubscribe;
    initLivetag(function (_livetag) {
      livetag = _livetag;
      unsubscribe = _livetag.onAddToCart(handleAddToCart);
    });

    return () => {
      livetag = undefined;

      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  function watchSession() {
    livetag.open(sessionId, { minimized });
  }

  function handleAddToCart(product) {
    products = [...products, { ...product, quantity: product.quantity || 1 }];
  }

  function handleDelete({ detail: product }) {
    products = products.filter(p => p !== product);
  }

  function handleChangeQuantity({ detail: product }) {
    products = products.map(p => p === product ? ({ ...product }) : p);
  }

  function handleCheckout() {
    console.log('[Cart] Checkout', products.map(({ sku }) => sku));
  }
</script>

<div class="grid">
  <div class="component dream-shadow">
    <h2 class="component__title">DEMO Livestream</h2>

    <div class="btn__group">
      <button class="btn" type="button" data-livetag="">Watch Now</button>
    </div>

    <div class="btn__group">
      <button class="btn" type="button" data-livetag="" data-livetag-minimized>Watch Now (minimized)</button>
    </div>

    <div class="btn__group">
      <button class="btn" type="button" data-livetag="3">Watch Session 3</button>
    </div>

    <fieldset>
      <legend>Watch specific session</legend>

      <div class="btn__group">
        <button class="btn" type="button" on:click={watchSession}>Watch</button>
        <input class="input" type="text" bind:value={sessionId} placeholder="Session Id"/>
      </div>

      <div class="btn__group">
        <label><input class="input" type="checkbox" bind:checked={minimized}/> Minimized</label>
      </div>
    </fieldset>
  </div>

  <div class="component dream-shadow">
    <div class="app">
      <Cart {products} on:delete={handleDelete} on:changeQuantity={handleChangeQuantity} on:checkout={handleCheckout}/>
    </div>
  </div>
</div>
