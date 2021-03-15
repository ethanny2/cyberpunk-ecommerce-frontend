import "../sass/page_styling.scss";
import "../sass/entireTheme.scss";
// import { addToCart, fetchCart, getTotalItems, getTotalPrice, removeFromCart } from "./cart";

export function registerNavEvent(callback) {
  const closeBtn = document.getElementById("closeMenu");
  const logo = document.getElementById("logo");
  const nav = document.getElementsByTagName("nav")[0];
  let root = document.documentElement;
  closeBtn.addEventListener("click", () => {
    if (nav.classList.contains("hidden")) {
      root.style.setProperty("--navWidth", "3rem");
    } else {
      root.style.setProperty("--navWidth", "0rem");
    }
    nav.classList.toggle("hidden");
    logo.classList.toggle("hidden");
    if (callback) callback();
  });
  logo.addEventListener("click", () => {
    if (nav.classList.contains("hidden")) {
      root.style.setProperty("--navWidth", "3rem");
    } else {
      root.style.setProperty("--navWidth", "0rem");
    }
    nav.classList.toggle("hidden");
    logo.classList.toggle("hidden");
    if (callback) callback();
  });
}
