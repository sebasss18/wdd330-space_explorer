export async function loadHeaderFooter() {
  const header = document.querySelector("#main-header");
  const footer = document.querySelector("#main-footer");

  if (header) {
    const response = await fetch("/partials/header.html");
    const text = await response.text();

    console.log(text);

    header.innerHTML = text;
  }

  if (footer) {
    const response = await fetch("/partials/footer.html");
    footer.innerHTML = await response.text();
  }
}