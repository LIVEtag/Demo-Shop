<script>
  import { onMount } from 'svelte';
  import Cart from './Cart.svelte';

  let products = [
    /*{
      sku: '265d2ee1-16f5-3a93-b953-ed661e448866',
      title: 'Quidem cupiditate.',
      photo: 'https://picsum.photos/seed/35/200',
      link: 'http://mclaughlin.com/quos-reprehenderit-beatae-eligendi-qui-aut-est-ut',
      option: { size: 'M', color: 'BlueViolet', price: 130.36 },
      quantity: 2,
    },
    {
      sku: '265d2ee1-16f5-3a93-b953-ed661e448866',
      title: 'Quidem cupiditate.',
      photo: 'https://picsum.photos/seed/35/200',
      link: 'http://mclaughlin.com/quos-reprehenderit-beatae-eligendi-qui-aut-est-ut',
      option: { size: 'M', color: 'BlueViolet', price: 130.36 },
      quantity: 1,
    },
    {
      sku: '265d2ee1-16f5-3a93-b953-ed661e448866',
      title: 'Quidem cupiditate.',
      photo: 'https://picsum.photos/seed/35/200',
      link: 'http://mclaughlin.com/quos-reprehenderit-beatae-eligendi-qui-aut-est-ut',
      option: { size: 'M', color: 'BlueViolet', price: 130.36 },
      quantity: 1,
    },*/
  ];

  onMount(() => {
    let unsubscribe;
    initLivetag(function (livetag) {
      unsubscribe = livetag.onAddToCart(handleAddToCart);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

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

<div class="app">
  <Cart {products} on:delete={handleDelete} on:changeQuantity={handleChangeQuantity} on:checkout={handleCheckout}/>
</div>
