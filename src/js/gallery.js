const gallery = document.querySelector("#gallery-grid");

export async function loadGallery() {
  try {
    const queries = [
      "milky way",
      "nebula",
      "galaxy",
      "stars",
      "deep space",
      "solar system",
    ];

    const responses = await Promise.all(
      queries.map((query) =>
        fetch(
          `https://images-api.nasa.gov/search?q=${query}&media_type=image`,
        ).then((response) => response.json()),
      ),
    );

    const images = responses
      .flatMap((data) => data.collection.items)
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
    console.error("Error loading NASA images:", error);
  }
}

loadGallery();