import { loadHeaderFooter } from "./utils.mjs";
import { initHamburgerMenu } from "./hambutton.js";
import { loadGallery } from "./gallery.js";
import { initSearch } from "./searchBar.js";

async function init() {
  await loadHeaderFooter();
  initHamburgerMenu();
  await loadGallery();
  initSearch();
}

init();