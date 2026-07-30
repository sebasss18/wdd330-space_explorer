export function initHamburgerMenu() {
  const button = document.querySelector("#menu-button");
  const menu = document.querySelector("#nav-menu");
  const navigation = document.querySelector(".navigation");

  if (!button || !menu || !navigation) return;

  button.addEventListener("click", () => {
    menu.classList.toggle("open");
    navigation.classList.toggle("show");
  });

  button.addEventListener("click", () => {
    menu.classList.toggle("show");
    document.querySelector("#main-header").classList.toggle("menu-open");
  });
}
