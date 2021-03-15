import { registerNavEvent } from ".";

import { updateCartDisplay } from "./cart";

document.addEventListener("DOMContentLoaded", () => {
  registerNavEvent();
  updateCartDisplay();
});
