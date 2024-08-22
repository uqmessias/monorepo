const globals = require("globals");
const eslintJs = require("@eslint/js");

module.exports = [
  eslintJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    ignores: ["node_modules"],
  },
];
