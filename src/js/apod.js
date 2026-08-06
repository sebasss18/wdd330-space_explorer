const NASA_KEY =
  import.meta.env.VITE_NASA_API_KEY || import.meta.env.NASA_API_KEY || "";

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setImage(src, alt) {
  const element = document.querySelector("#fact-image");
  if (element) {
    element.src = src;
    element.alt = alt;
  }
}

export async function loadApodPage() {
  await loadApod();
}

async function loadApod() {
  try {
    if (!NASA_KEY) {
      setText("#fact-title", "APOD unavailable");
      setText("#fact-description", "The NASA API key is missing.");
      setText(
        "#fact-text",
        "Add VITE_NASA_API_KEY to your environment to enable this page.",
      );
      return;
    }

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch APOD");
    }

    const data = await response.json();

    if (data.media_type !== "image") return;

    setImage(data.url, data.title);
    setText("#fact-title", data.title);
    setText(
      "#fact-description",
      data.explanation || "No description available.",
    );

    await loadWikipediaFact(data.title);
  } catch (error) {
    console.error("NASA API:", error);
    setText("#fact-title", "Unable to load APOD");
    setText("#fact-description", "Please try again later.");
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

    setText("#fact-text", data.extract);

    const wikiButton = document.querySelector("#wiki-button");
    if (wikiButton && data.content_urls?.desktop?.page) {
      wikiButton.href = data.content_urls.desktop.page;
    }
  } catch (error) {
    console.error("Wikipedia API:", error);
  }
}
