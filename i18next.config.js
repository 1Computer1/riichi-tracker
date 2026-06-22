import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["en", "weeb", "ja", "it"],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json",
    transComponents: ["Trans", "Translation", "HTrans"],
    preservePatterns: [
      "common.yakuman.*",
      "yaku.*.$",
      "yaku.*.help",
      "yaku.other.*.$",
      "yaku.other.*.help",
    ],
  },
});
