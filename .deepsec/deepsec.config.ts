import { defineConfig } from "deepsec/config";

export default defineConfig({
  projects: [
    { id: "astro-perso-website", root: ".." },
    // <deepsec:projects-insert-above>
  ],
});
