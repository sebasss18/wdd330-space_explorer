const gallery = document.querySelector("#gallery-grid");
const searchInput = document.querySelector(".search-box input");
const searchForm = document.querySelector(".search-box");

export function initSearch() {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) return;

    await searchImages(query);
  });
}

async function searchImages(query) {
  try {
    gallery.innerHTML = "";

    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${query}&media_type=image`,
    );

    const data = await response.json();

    const images = data.collection.items
      .filter((item) => item.links?.[0]?.href)
      .slice(0, 20);

    images.forEach((item) => {
      const title = item.data[0].title;
      const image = item.links[0].href;

      gallery.insertAdjacentHTML(
        "beforeend",
        `
          <article class="image-card">
            <img src="${image}" alt="${title}">

            <div class="card-content">
              <h3>${title}</h3>

              <button class="preview-btn">
                Preview
              </button>
            </div>
          </article>
        `,
      );
    });
  } catch (error) {
    console.error("Error searching NASA images:", error);
  }
}

initSearch();