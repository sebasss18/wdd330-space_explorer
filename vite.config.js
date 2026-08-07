import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  envDir: "..",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
        planets: "planets/index.html",
        favorites: "favorites/index.html",
        apod: "apod/index.html",
      },
    },
  },
});
