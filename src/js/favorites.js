const favoritesGrid = document.querySelector("#favorites-grid");

export function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.length) {
    favoritesGrid.innerHTML = "<p>No favorite planets saved yet.</p>";
    return;
  }

  favoritesGrid.innerHTML = "";

  favorites.forEach((planet) => {
    favoritesGrid.insertAdjacentHTML(
      "beforeend",
      `
      <article class="image-card">
        <img src="${planet.image}" alt="${planet.name}">
        <h3>${planet.name}</h3>
        <p>${planet.description}</p>
        <small>Saved: ${planet.dateSaved}</small>
        <button class="remove-btn">Remove</button>
      </article>
      `,
    );
  });

  document.querySelectorAll(".remove-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
      removeFavorite(index);
    });
  });
}

function removeFavorite(index) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.splice(index, 1);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  loadFavorites();
}
