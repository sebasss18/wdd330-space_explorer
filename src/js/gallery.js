const gallery = document.querySelector("#gallery-grid");
let galleryData = [];

export async function loadGallery() {
  if (!gallery) return;

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
      .slice(0, 30);

    renderImages(images);
  } catch (error) {
    console.error("Error loading NASA images:", error);
  }
}

export function renderImages(images) {
  if (!gallery) return;

  galleryData = [];
  gallery.innerHTML = "";

  images.forEach((item, index) => {
    const title = item.data[0].title;
    const description = item.data[0].description || "No description available.";
    const image = item.links[0].href;

    galleryData.push({ title, image, description });

    gallery.insertAdjacentHTML(
      "beforeend",
      `
      <article class="image-card">
        <img src="${image}" alt="${title}">
        <div class="card-content">
          <h3>${title}</h3>
          <button class="preview-btn" type="button" data-id="${index}">
            Preview
          </button>
        </div>
      </article>
      `,
    );
  });
}

if (gallery) {
  gallery.addEventListener("click", (event) => {
    const button = event.target.closest(".preview-btn");
    if (!button) return;

    const item = galleryData[button.dataset.id];
    if (!item) return;

    openModal(item.title, item.image, item.description);
  });
}

function openModal(title, image, description) {
  document.querySelector(".image-modal")?.remove();

  const modal = document.createElement("div");
  modal.className = "image-modal";

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal" type="button">✕</button>
      <img src="${image}" alt="${title}">
      <h2>${title}</h2>
      <p>${description}</p>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
