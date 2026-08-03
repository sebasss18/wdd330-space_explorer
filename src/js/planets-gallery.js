const gallery = document.querySelector("#gallery-grid");

export async function loadPlanets() {
  try {
    const response = await fetch(
      "https://images-api.nasa.gov/search?q=planet&media_type=image",
    );
    const data = await response.json();

    const images = data.collection.items
      .filter((item) => item.links?.[0]?.href)
      .slice(0, 60);

    renderImages(images);
  } catch (error) {
    console.error("Error loading planets:", error);
  }
}

function renderImages(images) {
  gallery.innerHTML = "";

  images.forEach((item) => {
    const title = item.data[0].title;
    const image = item.links[0].href;
    const description = item.data[0].description || "No description available.";

    gallery.insertAdjacentHTML(
      "beforeend",
      `
      <article class="image-card">
        <img src="${image}" alt="${title}">
        <h3>${title}</h3>
        <button class="favorite-btn">Add to favorites</button>
        <p class="planet-hint">Explore this planet</p>
        <p class="planet-description">${description}</p>
      </article>
      `,
    );
  });

  document.querySelectorAll(".image-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!event.target.classList.contains("favorite-btn")) {
        card.classList.toggle("show-description");
      }
    });
  });

  document.querySelectorAll(".favorite-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
      saveFavorite(images[index]);
      window.location.href = "favorites.html";
    });
  });
}

function saveFavorite(item) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const favorite = {
    name: item.data[0].title,
    image: item.links[0].href,
    description: item.data[0].description || "No description available.",
    dateSaved: new Date().toLocaleDateString(),
  };

  const exists = favorites.some((planet) => planet.name === favorite.name);

  if (!exists) {
    favorites.push(favorite);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}
