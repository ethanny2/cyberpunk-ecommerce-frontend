// import shirt1 from "../static/images/shirt1_chucky.png";
// import shirt2 from "../static/images/shirt2_white.png";
// const pagesData = [
//   `     <div class="SPA active" id="shop-shirt1">
// <h1>Carti "Child's Play"</h1>
// <figure class="product">
//   <a class="SPA-link" href="javascript:;" data-name="shop-shirt1">
//     <img alt="Chucky Carti Shirt" src="${shirt1}" />
//   </a>
//   <figcaption>Carti "Child's Play"</figcaption>
//   <br />
//   <i>$40.00</i>
//   <br />
//   <div class="product--actions">
//     <button>Add To Cart</button>
//     <label for="size">Size</label>
//     <select name="size" id="size">
//       <option value="xs">XS</option>
//       <option value="sm">SM</option>
//       <option value="md">MD</option>
//       <option value="lg">LG</option>
//       <option value="xl">XL</option>
//     </select>
//   </div>
// </figure>
// </div>`,
//   `
// <div class="SPA active" id="shop-shirt2">
//   <h1>Mirror AWGE</h1>
//   <figure class="product">
//     <a class="SPA-link" href="javascript:;" data-name="shop-shirt2">
//       <img alt="Playboi Carti hand drawn tee" src="${shirt2}" />
//     </a>
//     <figcaption>Mirror AWGE</figcaption>
//     <br />
//     <i>$30.00</i>
//     <br />
//     <div class="product--actions">
//       <button>Add To Cart</button>
//       <label for="size">Size</label>
//       <select name="size" id="size">
//         <option value="xs">XS</option>
//         <option value="sm">SM</option>
//         <option value="md">MD</option>
//         <option value="lg">LG</option>
//         <option value="xl">XL</option>
//       </select>
//     </div>
//   </figure>
// </div>`
// ];

document.addEventListener("DOMContentLoaded", () => {
  const pages = document.getElementsByClassName("SPA");
  const homeBtn = document.getElementsByClassName("home");
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
}
