module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "import/prefer-default-export": 0,
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        singleQuote: true,
        jsxSingleQuote: true
      },
    ],
    "import/no-extraneous-dependencies": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "react/button-has-type": 0
  },
};
