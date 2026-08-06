const NASA_KEY = import.meta.env.VITE_NASA_KEY;

export async function loadApodPage() {
  await loadApod();
}

async function loadApod() {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch APOD");
    }

    const data = await response.json();

    if (data.media_type !== "image") return;

    document.querySelector("#fact-image").src = data.url;
    document.querySelector("#fact-image").alt = data.title;
    document.querySelector("#fact-title").textContent = data.title;
    document.querySelector("#fact-description").textContent = data.explanation;

    await loadWikipediaFact(data.title);
  } catch (error) {
    console.error("NASA API:", error);
  }
}

async function loadWikipediaFact(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    );

    if (!response.ok) return;

    const data = await response.json();

    if (!data.extract) return;

    document.querySelector("#fact-text").textContent = data.extract;

    if (data.content_urls?.desktop?.page) {
      document.querySelector("#wiki-button").href =
        data.content_urls.desktop.page;
    }
  } catch (error) {
    console.error("Wikipedia API:", error);
  }
}
