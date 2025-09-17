import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/codespaces-react/", // Replace with your repository name
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
