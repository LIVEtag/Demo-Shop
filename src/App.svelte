<script>
  import { onMount } from 'svelte';
  import Cart from './Cart.svelte';

  let livetag;

  let sessionId = null;
  let minimized = false;

  let products = [];

  onMount(() => {
    let subscriptions = [];
    initLivetag(function (Livetag) {
      livetag = Livetag;
      subscriptions.push(Livetag.onAddToCart(handleAddToCart));
      subscriptions.push(Livetag.onCheckout(handleCheckout));
    });

    return () => {
      livetag = null;

      subscriptions.forEach((s) => s());
      subscriptions = null;
    };
  });

  function watchSession() {
    livetag.open(sessionId, { minimized });
  }

  function handleAddToCart(_product) {
    const product = products.find((p) => p.option.sku === _product.option.sku);

    if (product) {
      products = products
        .map((p) => p === product ? ({
          ...product,
          quantity: Number(product.quantity) + Number(_product.quantity),
        }) : p);
    } else {
      products = products.concat(_product);
    }
  }

  function handleDelete({ detail: product }) {
    products = products.filter(p => p !== product);
  }

  function handleChangeQuantity({ detail: product }) {
    products = products.map(p => p === product ? ({ ...product }) : p);
  }

  function handleCheckout(_products) {
    const skuMap = Object.fromEntries(products.map(p => [p.option.sku, p]));
    const newProducts = _products.filter(p => !skuMap[p.option.sku]);
    const existingProductsSku = Object.fromEntries(
      _products
        .filter(p => skuMap[p.option.sku])
        .map(p => [p.option.sku, p.quantity]),
    );

    products = products.map(product => ({
      ...product,
      quantity: product.quantity + (existingProductsSku[product.option.sku] || 0),
    })).concat(newProducts);
  }

  function handleCartCheckout() {
    products = [];

    alert('Thanks for the shopping!');
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
      <Cart {products} on:delete={handleDelete} on:changeQuantity={handleChangeQuantity} on:checkout={handleCartCheckout}/>
    </div>
  </div>
</div>
