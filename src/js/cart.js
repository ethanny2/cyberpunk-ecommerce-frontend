const CART_KEY = "ELSEIF-CART";
/*Cart looks like 
  {
    products: [
      {
        imgUrl,
        price,
        quantity,
        name
      }
    ]
  }
*/
export function fetchCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || { products: [] };
}
export function updateCartDisplay() {
  document.getElementById("lblCartCount").textContent = getTotalItems() || "";
}

export function addToCart(newProduct) {
  const cart = fetchCart();
  console.log({ cart });
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

export function removeFromCart(removeProduct) {
  const cart = fetchCart();
  if (cart.products.length < 0) return;
  const foundIndex = cart.products.findIndex(
    (product) => product.name === removeProduct.name && product.size === removeProduct.size
  );
  if (foundIndex !== -1) {
    const foundItem = cart.products[foundIndex];
    if (foundItem.quantity === 1) {
      cart.products.splice(foundIndex, 1);
    } else {
      foundItem.quantity--;
    }
    updateCart(cart);
  }
}

export function getTotalItems() {
  const cart = fetchCart();
  if (cart.products.length > 0) {
    return cart.products.reduce((total, curVal) => (total += curVal.quantity), 0);
  }
  return 0;
}

export function getTotalPrice() {
  const cart = fetchCart();
  if (cart.products.length > 0) {
    return cart.products.reduce((total, curVal) => (total += curVal.price * curVal.quantity), 0);
  }
  return 0;
}

export function updateCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
