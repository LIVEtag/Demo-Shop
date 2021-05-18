<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const extractOption = ({ price, uuid, sku, ...options } = {}) => options;

  export let product = {
    externalId: '',
    photo: '',
    link: '',
    option: {
      sku: '',
      price: 0,
    },
    quantity: 0
  };

  let option;
  $: option = Object.entries(extractOption(product.option)).map(([k, v]) => `${k}: ${v}`).join(', ');

  function onDelete() {
    dispatch('delete', product);
  }

  function onChangeQty(e) {
    let qty = +e.target.value;
    product.quantity = qty > 0 ? (qty > 100 ? 100 : qty) : 1;

    dispatch('changeQuantity', product);
  }
</script>

<div class="product">
  <div class="product__photo">
    <div>
      <img src="{product.photo}" alt="{product.title}"/>
    </div>

    <div class="product__delete">
      <button class="btn" type="button" on:click={onDelete}>Delete</button>
    </div>
  </div>

  <div class="product__info">
    <div class="product__title">
      <a class="product__link" href="{product.link}" target="_blank" rel="noopener">{product.title}</a>
    </div>

    <div class="product__price">
      <b>Price</b>: ${product.option.price}
    </div>

    <div class="product__sku"><b>SKU</b>: {product.option.sku}</div>

    <div class="product__option">
      <b>Option</b>: {option}
    </div>

    <div class="product__qty">
      <label>
        <b>Qty</b>: <input type="number" bind:value={product.quantity} min="1" max="100" step="1" on:change={onChangeQty}/>
      </label>
    </div>
  </div>
</div>

<style>
  .product {
    display: flex;
    gap: 0.7em;
  }

  .product__photo {
    line-height: 0;
  }

  .product__photo img {
    width: 75px;
    height: 75px;
    object-fit: scale-down;
    border: 1px solid #bbb;
    padding: 1px;
  }

  .product__info {
    flex: 1;
  }

  .product__qty {
    margin-top: 1em;
  }

  .product__title {
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 0.4em;
  }

  .product__price {
    margin: 1em 0;
    font-size: 1.2em;
  }

  .product__link {
    text-rendering: optimizeLegibility;
    color: #007185;
    text-decoration: none;
    border-bottom: 1px solid #fff;
  }

  .product__link:hover {
    border-bottom: 1px solid currentColor;
  }

  .product__delete {
    text-align: center;
    margin-top: 0.6em;
  }
</style>
