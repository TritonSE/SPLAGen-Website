// eslint.config.js
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    ignores: [".next/","build/","dist/","out/","public/", "next.config.js", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json"  // Make sure this path is correct
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin
    },
    rules: {
      // Avoid bugs
      "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }],
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "array-callback-return": "error",
      eqeqeq: "error",
      "no-await-in-loop": "error",
      "no-constant-binary-expression": "error",
      "no-constructor-return": "error",
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",

      // Stylistic
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/no-use-before-define": "warn",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/prefer-regexp-exec": "warn",
      "object-shorthand": ["warn", "properties"],
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc" },
          groups: ["builtin", "external", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "always"
        }
      ],

      // Disabled because of too many false positives.
      "@typescript-eslint/no-unnecessary-condition": "off"
    }
  },
  prettier
];
