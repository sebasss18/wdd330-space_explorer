const NASA_KEY =
  import.meta.env.VITE_NASA_API_KEY || import.meta.env.NASA_API_KEY || "";

const SPACE_TOPICS = [
  "Space",
  "Astronomy",
  "Universe",
  "Cosmos",
  "Solar System",
  "Sun",
  "Mercury",
  "Venus",
  "Earth",
  "Moon",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
  "Exoplanet",
  "Planet",
  "Asteroid",
  "Comet",
  "Galaxy",
  "Milky Way",
  "Andromeda Galaxy",
  "Nebula",
  "Orion Nebula",
  "Star",
  "Supernova",
  "Black hole",
  "Hubble Space Telescope",
  "James Webb Space Telescope",
  "International Space Station",
  "Apollo 11",
  "Voyager 1",
  "Mars Rover",
  "Curiosity",
  "Perseverance",
  "NASA",
  "Space exploration",
  "Astrophysics",
  "Cosmology",
  "Extraterrestrial life",
  "Habitable zone",
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

  await loadApod();
}

async function loadApod() {
  const cached = getCachedData();

  if (cached) {
    setImage(cached.image, cached.title);
    setText("#fact-title", cached.title);
    setText("#fact-description", cached.description);
    setText("#fact-text", cached.summary);

    const wikiButton = document.querySelector("#wiki-button");

    if (wikiButton) {
      wikiButton.href = cached.link;
    }

    return;
  }

  try {
    const nasaResponse = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,
    );

    const nasaData = await nasaResponse.json();

    if (nasaData.media_type !== "image") {
      return loadApod();
    }

    setImage(nasaData.url, nasaData.title);
    setText("#fact-title", nasaData.title);
    setText("#fact-description", nasaData.explanation);
    setText("#fact-text", "Loading space information...");

    const topic = SPACE_TOPICS[Math.floor(Math.random() * SPACE_TOPICS.length)];

    const wikiResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
    );

    const wikiData = await wikiResponse.json();

    let summary = "";
    let link = "#";

    if (wikiData.extract) {
      summary = wikiData.extract;
      link = wikiData.content_urls.desktop.page;

      setText("#fact-text", summary);

      const wikiButton = document.querySelector("#wiki-button");

      if (wikiButton) {
        wikiButton.href = link;
      }
    }

    saveCachedData({
      image: nasaData.url,
      title: nasaData.title,
      description: nasaData.explanation,
      summary,
      link,
    });
  } catch (error) {
    console.error("APOD error:", error);

    setText("#fact-text", "Unable to load space information right now.");
  }
}
