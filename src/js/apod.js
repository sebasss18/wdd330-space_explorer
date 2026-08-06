const NASA_KEY = import.meta.env.VITE_NASA_KEY;

const topics = [
  "Black hole",
  "Supernova",
  "Nebula",
  "Galaxy",
  "Milky Way",
  "Andromeda Galaxy",
  "Neutron star",
  "White dwarf",
  "Red giant",
  "Planet",
  "Exoplanet",
  "Mars",
  "Jupiter",
  "Saturn",
  "Europa (moon)",
  "Titan (moon)",
  "Moon",
  "Sun",
  "Solar System",
  "Comet",
  "Asteroid",
  "Meteor",
  "Meteorite",
  "Aurora",
  "Pulsar",
  "Quasar",
  "Dark matter",
  "Dark energy",
  "Big Bang",
  "Universe",
  "Cosmic microwave background",
  "Orion Nebula",
  "Crab Nebula",
  "Eagle Nebula",
  "Horsehead Nebula",
  "Betelgeuse",
  "Sirius",
  "Polaris",
  "Alpha Centauri",
  "Cassiopeia (constellation)",
];

export async function loadSpaceFact() {
  await Promise.all([loadApod(), loadWikipediaFact()]);
}

async function loadApod() {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`,
    );

    const data = await response.json();

    if (data.media_type !== "image") return;

    document.querySelector("#fact-image").src = data.url;
    document.querySelector("#fact-image").alt = data.title;
    document.querySelector("#fact-title").textContent = data.title;
    document.querySelector("#fact-description").textContent = data.explanation;
  } catch (error) {
    console.error("NASA API:", error);
  }
}

async function loadWikipediaFact() {
  try {
    // Cambia automáticamente cada día
    const today = new Date();
    const day = Math.floor(today.getTime() / 86400000);

    const topic = topics[day % topics.length];

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
    );

    const data = await response.json();

    document.querySelector("#fact-text").textContent = data.extract;

    document.querySelector("#wiki-button").href =
      data.content_urls.desktop.page;
  } catch (error) {
    console.error("Wikipedia API:", error);
  }
}
