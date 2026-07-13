/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-scss",
    "stylelint-config-tailwindcss"
  ],
  rules: {
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          /* Recommended to add the following rules to avoid false positives with Tailwind CSS
          "tailwind",
          "apply",
          "layer",
          "variants",
          "responsive",
          "screen",
           */
          "custom-variant",
          "theme",
        ],
      },
    ],
  },
};
