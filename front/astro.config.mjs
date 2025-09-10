import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://menou.fr",
  integrations: [icon({ iconDir: "src/assets/icons" })],
  markdown: {
      shikiConfig: {
          theme: "dracula",
      },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
