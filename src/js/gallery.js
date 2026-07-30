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
      .slice(0, 30);
    images.forEach((item) => {
      const title = item.data[0].title;
      const description =
        item.data[0].description || "No description available.";
      const image = item.links[0].href;
      gallery.insertAdjacentHTML(
        "beforeend",
        `
          <article class="image-card">

            <img
              src="${image}"
              alt="${title}"
            >

            <div class="card-content">

              <h3>
                ${title}
              </h3>

              <button
                class="preview-btn"
                type="button"
                data-title="${title}"
                data-image="${image}"
                data-description="${description.replace(/"/g, "&quot;")}"
              >
                Preview
              </button>

            </div>

          </article>
        `,
      );
    });
    createModalEvents();
  } catch (error) {
    console.error("Error loading NASA images:", error);
  }
}
function createModalEvents() {
  const buttons = document.querySelectorAll(".preview-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title;
      const image = button.dataset.image;
      const description = button.dataset.description;
      openModal(title, image, description);
    });
  });
}
function openModal(title, image, description) {
  document.querySelector(".image-modal")?.remove();
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
    <div class="modal-content">

      <button
        class="close-modal"
        type="button"
      >
        ✕
      </button>


      <img
        src="${image}"
        alt="${title}"
      >


      <h2>
        ${title}
      </h2>


      <p>
        ${description}
      </p>


    </div>
  `;
  document.body.appendChild(modal);
  const closeButton = modal.querySelector(".close-modal");
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    modal.remove();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
loadGallery();
