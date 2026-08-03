import { loadHeaderFooter } from "./utils.mjs";
import { initHamburgerMenu } from "./hambutton.js";
import { loadGallery } from "./gallery.js";
import { loadPlanets } from "./planets-gallery.js";
import { initSearch } from "./searchBar.js";
import { loadFavorites } from "./favorites.js";

async function init() {
  await loadHeaderFooter();
  initHamburgerMenu();

  const path = window.location.pathname;

  if (path === "/" || path.endsWith("/index.html")) {
    await loadGallery();
    initSearch();
  }

  if (path.includes("/planets/")) {
    await loadPlanets();
  }

  if (path.includes("/favorites/")) {
    loadFavorites();
  }
}

init();
