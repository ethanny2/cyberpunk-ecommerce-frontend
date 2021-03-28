import { removeFromCart, fetchCart, updateCartDisplay, getTotalPrice } from "./cart";

document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  const removeBtns = document.getElementsByClassName("remove");
  const checkout = document.getElementById("checkout");
  window.addEventListener("resize", resizePage);
  var stripe = window.Stripe(
    "pk_test_51IVT4eCRgr8XtIukiWENcc8xpnjz2YS6dB6OSa6yOjjPeSQSKWNmnQ0oDQB5r6afXxTdICjzMUVxgMuWYrUwjAy100xwg5q3jQ"
  );
  checkout.addEventListener("click", async () => {
    const lineItems = fetchCart().products.map((item) => ({ price: String(item.productId), quantity: item.quantity }));
    await stripe.redirectToCheckout({
      mode: "payment",
      lineItems,
      successUrl: "https://elseifclothing.netlify.app/success",
      cancelUrl: "https://elseifclothing.netlify.app/failure"
    });
  });
  for (let i = 0; i < removeBtns.length; i++) {
    const button = removeBtns[i];
    button.addEventListener("click", (e) => {
      const cartItem = e.target.parentNode;
      const quantityElement = cartItem.children[3];
      const subtotalElement = cartItem.children[4];
      const totalElement = document.getElementsByClassName("total")[0];
      let quantity = Number(cartItem.dataset.quantity);
      const productName = cartItem.dataset.name;
      const productPrice = Number(cartItem.dataset.price);
      const productSize = cartItem.dataset.size;
      quantity--;
      if (quantity <= 0) {
        cartItem.remove(); //remove DOM node
      } else {
        quantityElement.textContent = `Quantity: ${quantity}`; //update DOM node
        cartItem.dataset.quantity = quantity;
        subtotalElement.textContent = `Subtotal: $${(productPrice * quantity).toFixed(2)}`;
      }
      //call removeFromCart with the appropriate product
      removeFromCart({ name: productName, size: productSize });
      updateCartDisplay(); //Update number display
      totalElement.textContent = `Total $${getTotalPrice().toFixed(2)}`;
    });
  }
});

function displayCartItems() {
  const container = document.getElementById("cart-contents");
  const main = document.getElementsByTagName("main")[0];
  const cart = fetchCart();
  if (cart.products.length <= 0) {
    container.innerHTML += `<h2>No Items in Cart</h2>`;
    main.classList.add("full");
  } else {
    resizePage();
    cart.products.forEach((item) => {
      container.innerHTML += `<div class="cart-item" data-price="${item.price}" data-size="${item.size}" data-name="${
        item.name
      }" data-quantity="${item.quantity}">
      <div>
        <picture>
          <source srcset="${item.webpUrl}" type="image/webp" />
          <source srcset="${item.pngUrl}" type="image/png" />
          <img src="${item.pngUrl}" alt="${item.name}" />
        </picture>
      </div>
      <p>Size: ${item.size}</p>
      <p>Price: $${item.price.toFixed(2)}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      <button class="remove">Remove One</button>
    </div>`;
    });

    container.innerHTML += `<div><p class="total">Total $${getTotalPrice().toFixed(2)}</p>`;
    container.innerHTML += `<button id="checkout">Checkout</button></div>`;
  }
}

function resizePage() {
  const main = document.getElementsByTagName("main")[0];
  if (window.screen.width >= 600) {
    main.classList.add("full");
  }
}
