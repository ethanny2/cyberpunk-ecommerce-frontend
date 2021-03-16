import shirt1 from "../static/images/shirt1_chucky.png";
import shirt2 from "../static/images/shirt2_white.png";
import { addToCart, fetchCart, updateCartDisplay } from "./cart";

const products = {
  "shop-shirt1": {
    imageUrl: shirt1,
    price: 40,
    name: `Carti Child's Play`,
    productId: "price_1IVTPQCRgr8XtIukFtECP5E8"
  },
  "shop-shirt2": {
    imageUrl: shirt2,
    price: 30,
    name: `Mirror AWGE`,
    productId: "price_1IVTPjCRgr8XtIukFdV9P92i"
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const pages = document.getElementsByClassName("SPA");
  const homeBtn = document.getElementsByClassName("home");
  const addToCartBtns = document.getElementsByClassName("addCart");
  for (let i = 0; i < addToCartBtns.length; i++) {
    addToCartBtns[i].addEventListener("click", findProductName);
  }
  for (let i = 0; i < homeBtn.length; i++) {
    homeBtn[i].addEventListener("click", navigateHomePage);
  }
  for (let i = 0; i < pages.length; i++) {
    pages[i].addEventListener("click", (e) => {
      if (e.target.localName == "img") {
        removeAllActive(pages);

        console.log({ target: e.target });
        const newPageId = e.target.closest(".SPA-link").dataset.name;
        console.log(newPageId);
        const newPage = document.getElementById(newPageId);
        newPage.classList.add("active");
        newPage.scrollIntoView();
      }
    });
  }
});

function findProductName(e) {
  const product = products[e.target.parentNode.parentNode.parentNode.children[0].dataset.name];
  const size = e.target.parentNode.parentNode.children[2].value;
  product.size = size;
  addToCart(product);
  console.log(fetchCart());
  updateCartDisplay();
}

function removeAllActive(pages) {
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.remove("active");
  }
}

function navigateHomePage() {
  const pages = document.getElementsByClassName("SPA");
  removeAllActive(pages);
  const homePage = document.getElementById("shop-main");
  console.log({ homePage });
  homePage.classList.add("active");
  homePage.scrollIntoView();
}
