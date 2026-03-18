module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "next/core-web-vitals",
  ],
  plugins: ["boundaries", "import"],
  ignorePatterns: [
    ".eslintrc.cjs",
    "convex/_generated",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
    "boundaries/ignore": [
      "**/*.md",
      "**/*.css",
      "**/*.json",
      "**/*.d.ts",
      "*.config.*",
      "node_modules/**",
      "public/**",
      "convex/_generated/**",
      "middleware.ts",
      "next-env.d.ts",
    ],
    "boundaries/elements": [
      { type: "shared-types", pattern: "shared/types/**" },
      { type: "shared-errors", pattern: "shared/errors/**" },
      { type: "shared", pattern: "shared/**" },
      { type: "features", pattern: "features/*/**", capture: ["feature"] },
      { type: "app", pattern: "app/**" },
      { type: "components", pattern: "components/**" },
      { type: "hooks", pattern: "hooks/**" },
      { type: "lib", pattern: "lib/**" },
      { type: "convex", pattern: "convex/**" },
      { type: "docs", pattern: "docs/**" },
    ],
  },
  rules: {
    // All of these overrides ease getting into
    // TypeScript, and can be removed for stricter
    // linting down the line.

    // Only warn on unused variables, and ignore variables starting with `_`
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],

    // Allow escaping the compiler
    "@typescript-eslint/ban-ts-comment": "error",

    // Disallow explicit `any`s
    "@typescript-eslint/no-explicit-any": "error",

    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",

    // Allow async functions without await
    // for consistency (esp. Convex `handler`s)
    "@typescript-eslint/require-await": "off",

    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: false }],
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: false },
    ],

    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "no-void": "error",
    "boundaries/no-unknown": "error",
    "boundaries/element-types": [
      "error",
      {
        default: "disallow",
        rules: [
          {
            from: ["app"],
            allow: [
              "app",
              "components",
              "shared",
              "shared-errors",
              "shared-types",
              "features",
              "hooks",
              "lib",
              "convex",
            ],
          },
          {
            from: ["components"],
            allow: [
              "components",
              "shared",
              "shared-errors",
              "shared-types",
              "hooks",
              "lib",
              "app",
              "convex",
            ],
          },
          {
            from: ["hooks"],
            allow: ["shared", "shared-errors", "shared-types", "lib"],
          },
          {
            from: ["features"],
            allow: [
              ["features", { feature: "${from.feature}" }],
              "shared",
              "shared-errors",
              "shared-types",
              "lib",
            ],
          },
          {
            from: ["shared"],
            allow: [
              "shared",
              "shared-errors",
              "shared-types",
              "features",
              "lib",
            ],
          },
          {
            from: ["shared-errors"],
            allow: ["shared", "shared-types", "components", "lib"],
          },
          {
            from: ["shared-types"],
            allow: ["shared-types", "convex"],
          },
          {
            from: ["convex"],
            allow: ["convex", "shared", "shared-types"],
          },
          {
            from: ["lib"],
            allow: ["lib", "shared-types", "shared"],
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["convex/**/*.ts", "convex/**/*.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
      },
    },
  ],
};
