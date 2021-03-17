import { removeFromCart, fetchCart, updateCartDisplay, getTotalPrice } from "./cart";

document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  const removeBtns = document.getElementsByClassName("remove");
  const checkout = document.getElementById("checkout");
  var stripe = window.Stripe(
    "pk_test_51IVT4eCRgr8XtIukiWENcc8xpnjz2YS6dB6OSa6yOjjPeSQSKWNmnQ0oDQB5r6afXxTdICjzMUVxgMuWYrUwjAy100xwg5q3jQ"
  );
  console.log({ stripe });
  checkout.addEventListener("click", async () => {
    const lineItems = fetchCart().products.map((item) => ({ price: String(item.productId), quantity: item.quantity }));
    const response = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems,
      successUrl: "http://localhost:9000/success.html",
      cancelUrl: "http://localhost:9000/failure.html"
    });
    console.log(response);
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
      console.log({ productName });
      const productSize = cartItem.dataset.size;
      quantity--;
      if (quantity <= 0) {
        cartItem.remove(); //remove DOM node
      } else {
        quantityElement.textContent = `Quantity: ${quantity}`; //update DOM node
        cartItem.dataset.quantity = quantity;
        subtotalElement.textContent = `Subtotal: $${(productPrice * quantity).toFixed(2)}`;
      }
      console.log({ name: productName, size: productSize });
      //call removeFromCart with the appropriate product
      removeFromCart({ name: productName, size: productSize });
      updateCartDisplay(); //Update number display
      totalElement.textContent = `Total $${getTotalPrice().toFixed(2)}`;
    });
  }
});

function displayCartItems() {
  const container = document.getElementById("cart-contents");
  const cart = fetchCart();
  console.log(cart);
  if (cart.products.length <= 0) {
    console.log(cart.products.length);
    container.innerHTML += `<h2>No Items in Cart</h2>`;
    document.getElementsByTagName("main")[0].classList.add("full");
  } else {
    cart.products.forEach((item) => {
      console.log({ item: item.name });
      container.innerHTML += `<div class="cart-item" data-price="${item.price}" data-size="${item.size}" data-name="${
        item.name
      }" data-quantity="${item.quantity}">
      <div><img src=${item.imageUrl} alt="${item.name}" /></div>
      <p>Size: ${item.size}</p>
      <p>Price: $${item.price.toFixed(2)}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      <button class="remove">Remove One</button>
    </div>`;
    });
    container.innerHTML += `<div><h3 class="total">Total $${getTotalPrice().toFixed(2)}</h3>`;
    container.innerHTML += `<button id="checkout">Checkout</button></div>`;
  }
}
