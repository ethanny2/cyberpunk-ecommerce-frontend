[![GitHub issues](https://img.shields.io/github/issues/ethanny2/cyberpunk-ecommerce-frontend)](https://github.com/ethanny2/cyberpunk-ecommerce-frontend/issues)[![GitHub forks](https://img.shields.io/github/forks/ethanny2/cyberpunk-ecommerce-frontend)](https://github.com/ethanny2/cyberpunk-ecommerce-frontend/network)[![GitHub stars](https://img.shields.io/github/stars/ethanny2/cyberpunk-ecommerce-frontend)](https://github.com/ethanny2/cyberpunk-ecommerce-frontend/stargazers)[![GitHub license](https://img.shields.io/github/license/ethanny2/cyberpunk-ecommerce-frontend)](https://github.com/ethanny2/cyberpunk-ecommerce-frontend/blob/main/LICENSE)[![Twitter Badge](https://img.shields.io/badge/chat-twitter-blue.svg)](https://twitter.com/ArrayLikeObj)


# Cyberpunk Themed eCommerce store 

## [https://elseifclothing.netlify.app/](https://elseifclothing.netlify.app/)


<p align="center">
  <img  src="https://media3.giphy.com/media/9YQOEXWsHmjFYptoyi/giphy.gif" alt="Demo gif">
</p>

## Background

The original concept for the site was to sell clothing for my short-lived clothing brand **"else-if" clothing**. The site was originally hosted on Big Cartel and was made using their custom platform which abstracted the product backend and gave developers a nice interface to interact with the backend through templating and ruby + Coffeescript.

This site is meant to emulate the 80s / 90s cyberpunk aesthetic commonly seen in pop culture by having the UI look like a CRT monitor with scanlines, text being animated like a command prompt etc...

**Goals (for rehosting site)** : 
   - Optimize the bundle size and lighthouse scores
   - Completely redo the design [because the site previously ran with CoffeeScript and some templating language from Big Cartel](https://github.com/bigcartel/dugway)
   - Replace the Big Cartel backend with Stripe Client side checkout

## Technology used
- SCSS
- webpack 5 
- Stripe Checkout
- Threejs
- Draco Compression of GLTF models
- Image optimizations with webp + fallbacks
- Intersection Observer
- webgl lens flare effect
- Client side cart system with persistence through localStorage
  
## Concepts

### Threejs + Draco Compression

Integrating the Three.js webgl library with webpack 5 to display the graphic on the home page. I applied [Draco compression](https://google.github.io/draco/) to my .gltf model to drastically reduce the size of the models and thus the websites bundle size. Models were converted to draco compressed gltfs via the [gltf-pipeline CLI](https://github.com/CesiumGS/gltf-pipeline).
```
const dracoDecodePath = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/";
const loader = new GLTFLoader(manager);
const dracoLoader = new DRACOLoader(manager);
dracoLoader.setDecoderPath(dracoDecodePath);
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.preload();
loader.setDRACOLoader(dracoLoader);
```

### Stripe Checkout + Local Storage Cart

Since the Big Cartel backend attached to this site is no longer active I opted to have the entire store operate on the client side with checkout via the Stripe client side library.
```
checkout.addEventListener("click", async () => {
    const lineItems = fetchCart().products.map((item) => ({ price: String(item.productId), quantity: item.quantity }));
    await stripe.redirectToCheckout({
      mode: "payment",
      lineItems,
      successUrl: "https://elseifclothing.netlify.app/success",
      cancelUrl: "https://elseifclothing.netlify.app/failure"
    });
  });
```

The cart is a quick implementation written on the client side with persistence. 

```
...
export function fetchCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || { products: [] };
}
export function updateCartDisplay() {
  document.getElementById("lblCartCount").textContent = getTotalItems() || "";
}

export function addToCart(newProduct) {
  const cart = fetchCart();
  const foundIndex = cart.products.findIndex(
    (product) => product.name === newProduct.name && product.size === newProduct.size
  );
  if (foundIndex !== -1) {
    cart.products[foundIndex].quantity++;
  } else {
    newProduct.quantity = 1;
    cart.products.push(newProduct);
  }
  updateCart(cart);
}
...
```

### Intersection Observer API (w/ Polyfill)

Implementing the polyfill version (so I can test on my older phone) of the Intersection Observer API so that when certain text is scrolled into the viewport a terminal/ command prompt effect types out the text.

```
function createObserver() {
  const cmd = document.getElementsByClassName("typing")[0];
  let observer;
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: [0.5]
  };
  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(cmd);
}

function handleIntersect(entries, observer) {
  const cmd = document.getElementsByClassName("typing")[0];
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0.5) {
      handleCommandLineMessage(introMessage);
      // Only happens once
      observer.unobserve(cmd);
    }
  });
}
```

### webpack 5 bundling

Using my own custom webpack 5 dev and production configuration to have a local dev-server with [hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/) and optimizied production build with minification, auto-prefixing for CSS properties and more. The upgrade from webpack 4 -> webpack 5 makes bundling static assets  (images, json files etc...) very easy.
```
/* loads nearly all assets; no external plugins */
{
        test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|webp|woff2|woff|eot)$/i,
        type: "asset/resource"
},
```


### webp images with fallback

Running a script as a pre-build step convert all png/jpg files to webp versions to cut back on bundle sizes for browsers that do support webp images.
```
(async () => {
  const img = await imagemin([path.resolve(__dirname, "src/static/images/*.{jpg,png}").replace(/\\/g, "/")], {
    destination: path.resolve(__dirname, "src/static/images/").replace(/\\/g, "/"),
    plugins: [imageminWebp({ quality: 70 })]
  });
  console.log(img);
  console.log("Done converting images");
})();

```
