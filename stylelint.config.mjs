/** @type {import('stylelint').Config} */

const browsers = ["baseline widely available"]

const styleIntConfig = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-scss",
    "stylelint-config-tailwindcss"
  ],
  plugins: ["stylelint-no-unsupported-browser-features"],
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
    "plugin/no-unsupported-browser-features": [
      true,
      {
        browsers,
        severity: "warning",
      },
    ],
  },
};

export default styleIntConfig;
