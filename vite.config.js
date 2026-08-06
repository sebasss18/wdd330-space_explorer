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
        main: "src/index.html",
        planets: "src/planets/index.html",
        favorites: "src/favorites/index.html",
        apod: "src/apod/index.html",
      },
    },
  },
});
