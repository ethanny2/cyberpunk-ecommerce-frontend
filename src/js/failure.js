import { handleCommandLineMessage } from "./index";
const failureMessage = `Your checkout was unexpectedly interrupted or stopped, please try again.`;
document.addEventListener("DOMContentLoaded", () => {
  handleCommandLineMessage(failureMessage);
});
