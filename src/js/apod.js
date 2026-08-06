const NASA_KEY =
  import.meta.env.VITE_NASA_API_KEY ||
  import.meta.env.NASA_API_KEY ||
  "rW1lLhuWfUF6cYDnBIGwy62l5SEhWSiRIdW2X7Ae";

const SPACE_TOPICS = [
  "Space",
  "Astronomy",
  "Universe",
  "Cosmos",
  "Outer space",
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
  "Dwarf planet",
  "Asteroid",
  "Asteroid belt",
  "Comet",
  "Meteor",
  "Meteorite",
  "Meteoroid",
  "Kuiper Belt",
  "Oort Cloud",
  "Galaxy",
  "Milky Way",
  "Andromeda Galaxy",
  "Whirlpool Galaxy",
  "Sombrero Galaxy",
  "Nebula",
  "Orion Nebula",
  "Crab Nebula",
  "Eagle Nebula",
  "Ring Nebula",
  "Horsehead Nebula",
  "Lagoon Nebula",
  "Star",
  "Protostar",
  "Red giant",
  "White dwarf",
  "Brown dwarf",
  "Neutron star",
  "Pulsar",
  "Magnetar",
  "Binary star",
  "Supernova",
  "Hypernova",
  "Black hole",
  "Supermassive black hole",
  "Event horizon",
  "Accretion disk",
  "Quasar",
  "Dark matter",
  "Dark energy",
  "Big Bang",
  "Cosmic microwave background",
  "Expansion of the universe",
  "Gravity",
  "General relativity",
  "Space-time",
  "Light-year",
  "Parsec",
  "Constellation",
  "Cassiopeia",
  "Orion",
  "Ursa Major",
  "Polaris",
  "Sirius",
  "Betelgeuse",
  "Rigel",
  "Alpha Centauri",
  "Proxima Centauri",
  "Hubble Space Telescope",
  "James Webb Space Telescope",
  "International Space Station",
  "Apollo program",
  "Apollo 11",
  "Voyager 1",
  "Voyager 2",
  "Cassini–Huygens",
  "Mars Rover",
  "Curiosity",
  "Perseverance",
  "Ingenuity",
  "Artemis program",
  "Space Shuttle",
  "Rocket",
  "Satellite",
  "Space exploration",
  "NASA",
  "European Space Agency",
  "SpaceX",
  "Blue Origin",
  "Cosmology",
  "Astrophysics",
  "Astronomical object",
  "Observable universe",
  "Interstellar medium",
  "Interstellar travel",
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

  if (document.readyState === "loading") {
    await new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
  }

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
    if (wikiButton) wikiButton.href = cached.link;

    return;
  }

  try {
    const topic = SPACE_TOPICS[Math.floor(Math.random() * SPACE_TOPICS.length)];

    const [nasaResponse, wikiResponse] = await Promise.all([
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`),
      fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
      ),
    ]);

    const nasaData = await nasaResponse.json();
    const wikiData = await wikiResponse.json();

    if (nasaData.media_type === "image") {
      setImage(nasaData.url, nasaData.title);
      setText("#fact-title", nasaData.title);
      setText("#fact-description", nasaData.explanation);
    }

    let summary = "";
    let link = "#";

    if (wikiData.extract) {
      summary = wikiData.extract;
      link = wikiData.content_urls.desktop.page;

      setText("#fact-text", summary);

      const wikiButton = document.querySelector("#wiki-button");
      if (wikiButton) wikiButton.href = link;
    }

    saveCachedData({
      image: nasaData.url,
      title: nasaData.title,
      description: nasaData.explanation,
      summary,
      link,
    });
  } catch (error) {
    console.error(error);
  }
}
