/** @type {import('prettier').Config} */
const config = {
    plugins: ["prettier-plugin-tailwindcss"],
    // tailwindcss
    tailwindAttributes: ["theme"],
    tailwindFunctions: ["twMerge", "createTheme"],
    tabWidth: 4,
};

export default config;
