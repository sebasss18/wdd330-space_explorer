import { loadHeaderFooter } from "./utils.mjs";
import { initHamburgerMenu } from "./hambutton.js";

async function init() {
  await loadHeaderFooter();
  initHamburgerMenu();
}

init();