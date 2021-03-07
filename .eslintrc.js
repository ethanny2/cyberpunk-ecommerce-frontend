module.exports = {
  plugins: ["prettier"],
  env: {
    es6: true,
    browser: true,
    node: true,
    jquery: true
  },
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaVersion: 2017
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": 1,
    "eslint linebreak-style": [0, "error", "windows"],
    "no-debugger": 0
  }
};
