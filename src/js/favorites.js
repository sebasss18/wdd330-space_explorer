const favoritesGrid = document.querySelector("#favorites-grid");

export function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.length) {
    favoritesGrid.innerHTML = "<p>No favorite planets saved yet.</p>";
    return;
  }

  favoritesGrid.innerHTML = "";

  favorites.forEach((favorite, index) => {
    favoritesGrid.insertAdjacentHTML(
      "beforeend",
      `
      <article class="image-card" data-index="${index}">
        <img src="${favorite.image}" alt="${favorite.name || favorite.title}">
        <div class="card-content">
          <h3>${favorite.name || favorite.title}</h3>
          <p class="favorite-description">${favorite.description}</p>
          <small>Saved: ${favorite.dateSaved}</small>
          <button class="remove-btn" type="button">Remove</button>
        </div>
      </article>
      `,
    );
  });

  favoritesGrid.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const card = button.closest(".image-card");
      const index = Number(card.dataset.index);

      removeFavorite(index);
    });
  });
}

favoritesGrid?.addEventListener("click", (event) => {
  const card = event.target.closest(".image-card");

  if (!card || event.target.closest(".remove-btn")) return;

  card.classList.toggle("show-description");
});

function removeFavorite(index) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.splice(index, 1);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  loadFavorites();
}
