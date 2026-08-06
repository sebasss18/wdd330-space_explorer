const NASA_KEY =
  import.meta.env.VITE_NASA_API_KEY ||
  import.meta.env.NASA_API_KEY ||
  "rW1lLhuWfUF6cYDnBIGwy62l5SEhWSiRIdW2X7Ae";

const SPACE_TOPICS = [
  "Space",
  "Astronomy",
  "Solar System",
  "Black hole",
  "Mars",
  "Moon",
  "Galaxy",
  "Nebula",
  "Star",
  "Cosmos",
];

let apodPageLoaded = false;

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
  if (apodPageLoaded) return;
  apodPageLoaded = true;

  if (document.readyState === "loading") {
    await new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
  }

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

    if (data.media_type !== "image") {
      throw new Error("APOD response was not an image.");
    }

    setImage(data.url, data.title);
    setText("#fact-title", data.title);
    setText(
      "#fact-description",
      data.explanation || "No description available.",
    );

    await loadWikipediaFact(data.title);
  } catch (error) {
    console.error("NASA API:", error);

    const topic = SPACE_TOPICS[Math.floor(Math.random() * SPACE_TOPICS.length)];
    const fallbackTitle = `Space topic: ${topic}`;
    const fallbackDescription = `A space-themed article from Wikipedia will appear here as a fun fact.`;

    setImage("/images/placeholder.jpg", fallbackTitle);
    setText("#fact-title", fallbackTitle);
    setText("#fact-description", fallbackDescription);

    await loadWikipediaFact(topic);
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
