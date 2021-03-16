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

export function handleCommandLineMessage(msg) {
  var allElements = document.getElementsByClassName("typing");
  for (var j = 0; j < allElements.length; j++) {
    var currentElementId = allElements[j].id;
    var currentElementIdContent = msg;
    var element = document.getElementById(currentElementId);
    var devTypeText = currentElementIdContent;
    // type code
    var i = 0,
      isTag,
      text;
    (function type() {
      text = devTypeText.slice(0, ++i);
      if (text === devTypeText) return;
      element.innerHTML = text + `<span class='blinker'>&#32;</span>`;
      var char = text.slice(-1);
      if (char === "<") isTag = true;
      if (char === ">") isTag = false;
      if (isTag) return type();
      setTimeout(type, 40);
    })();
  }
}
