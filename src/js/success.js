import { handleCommandLineMessage } from "./index";
import { clearCart, updateCartDisplay } from "./cart";
const successMessage = `You have successfully checked out. Thank you for your patronage.`;

document.addEventListener("DOMContentLoaded", () => {
  handleCommandLineMessage(successMessage);
  clearCart();
  updateCartDisplay();
});
