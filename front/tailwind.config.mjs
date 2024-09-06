/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'selector',
    theme: {
        container: {
            padding: "2rem",
            center: true,
        },
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
}