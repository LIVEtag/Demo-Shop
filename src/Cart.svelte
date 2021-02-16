<script>
  import { createEventDispatcher } from 'svelte';
  import Product from './Product.svelte';

  const dispatch = createEventDispatcher();

  export let products = [];

  let total;
  $: total = Math.floor(products.reduce((total, { quantity, option: { price } }) => total + quantity * price, 0) * 100) / 100;

  let productsCount;
  $: productsCount = products.length;

  function handleCheckout() {
    dispatch('checkout');
  }
</script>

<style>
  .products__product {
    margin-bottom: 1.5em;
    font-size: 0.9em;
    line-height: 1.3em;
  }

  .cart__checkout {
    margin-top: 1em;
  }

  .cart__total {
    font-size: 1.2em;
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid #6b6191;
  }

  .cart__gift {
    font-size: 0.8em;
    margin-top: 0.3em;
  }

  .cart__gift input[type=checkbox] {
    padding: 0;
    margin: 0;
  }

  .cart__subtotal {
    font-size: 1.1em;
  }

  .cart__checkout .btn {
    font-size: 1.2em;
    border: 1px solid;
    background-color: #fff;
    color: #6b6191;
    border-radius: 3px;
    padding: 0.5em 1em;
  }
</style>

<div class="cart">
  <h2 class="component__title">Shopping Cart</h2>

  <div class="products">
    {#if products && products.length > 0}
      {#each products as product, i}
        <div class="products__product">
          <Product {product} on:delete on:changeQuantity/>
        </div>
      {/each}

      <div class="cart__total">
        <div class="cart__subtotal">
          <span>Subtotal ({productsCount} item{productsCount > 1 ? 's' : ''})</span>: <b>${total}</b>
        </div>

        <div class="cart__gift">
          <label><input type="checkbox"/> This order contains a gift</label>
        </div>
      </div>

      <div class="cart__checkout">
        <button class="btn" type="button" on:click={handleCheckout}>Proceed to checkout</button>
      </div>
    {:else}
      Your Cart is empty
    {/if}
  </div>
</div>
