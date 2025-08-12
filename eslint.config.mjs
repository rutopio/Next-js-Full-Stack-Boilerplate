import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:tailwindcss/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "prettier"
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: await import("eslint-plugin-prettier"),
      tailwindcss: await import("eslint-plugin-tailwindcss"),
      import: await import("eslint-plugin-import"),
      "@typescript-eslint": await import("@typescript-eslint/eslint-plugin"),
    },
    languageOptions: {
      parser: await import("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "."],
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
    rules: {
      "prettier/prettier": "warn",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-shorthand": "off",
      "react-hooks/exhaustive-deps": "off",
      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "@next/next/no-img-element": "off",
    },
    ignores: ["**/components/ui/**"],
  },
];

export default eslintConfig;
