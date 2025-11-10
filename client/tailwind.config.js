/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ibac: { primary: "#0F1A2A", accent: "#5B39F1" },
      },
    },
  },
  corePlugins: {
    preflight: true, // ✅ Ativado para resetar fonte e margens
  },
  plugins: [],
}
