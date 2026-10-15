import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// UI standards guardrails (docs/ui-standards.md). Errors on purpose: any hit is drift from the
// design system. Keep these when copying the template into a project.
const restrictedSyntax = [
  {
    selector: "CallExpression[callee.type='Identifier'][callee.name='confirm']",
    message: "Use `await confirmDialog({...})` from components/ui/ConfirmDialog.",
  },
  {
    selector: "CallExpression[callee.type='Identifier'][callee.name='alert']",
    message: "Use `notify.error/success/info(...)` from components/ui/Notifier.",
  },
  {
    selector: "NewExpression[callee.object.name='Intl'][callee.property.name='NumberFormat']",
    message: "Use getNumberFormatter/formatNumber from lib/utils/number-format (single app locale).",
  },
  {
    selector: "CallExpression[callee.property.name='toLocaleDateString'][arguments.length=0]",
    message: "Use formatDate from lib/utils/date-format (a bare toLocaleDateString follows each browser's language).",
  },
  {
    selector: "Literal[value=/\\btext-\\[\\d+(\\.\\d+)?px\\]/], TemplateElement[value.raw=/\\btext-\\[\\d+(\\.\\d+)?px\\]/]",
    message: "Use the type scale (text-2xs/3xs/4xs/5xs, text-xs, text-sm…) instead of arbitrary pixel font sizes.",
  },
];

// The brand is one swappable palette: components say brand-*, never a named hue.
const namedHue = {
  selector:
    "Literal[value=/\\b(?:bg|text|border|ring|from|to|via|fill|stroke|shadow|outline|accent|divide|decoration)-(?:emerald|green|teal|indigo|violet|purple|sky|cyan)-\\d/], TemplateElement[value.raw=/\\b(?:bg|text|border|ring|from|to|via|fill|stroke|shadow|outline|accent|divide|decoration)-(?:emerald|green|teal|indigo|violet|purple|sky|cyan)-\\d/]",
  message:
    "Use the brand palette (bg-brand-500, text-brand-600…) or a semantic token (bg-primary) instead of a named hue, so the project can be rebranded from globals.css. Categorical data colors go in components/ui/groupTones.ts.",
};

/** Files allowed to name hues: categorical (data) color palettes. */
const HUE_PALETTES = ["app/components/ui/groupTones.ts"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**"]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    ignores: [
      "app/lib/utils/number-format.ts",
      "app/lib/utils/date-format.ts",
      "app/components/ui/ConfirmDialog.tsx",
      "app/components/ui/Notifier.tsx",
      "**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-properties": [
        "error",
        { object: "window", property: "confirm", message: "Use `await confirmDialog({...})` from components/ui/ConfirmDialog." },
        { object: "window", property: "alert", message: "Use `notify.error/success/info(...)` from components/ui/Notifier." },
        { property: "toLocaleString", message: "Use formatNumber/formatMoney (lib/utils/number-format) or formatDateTime (lib/utils/date-format)." },
        { property: "toLocaleTimeString", message: "Use formatTime from lib/utils/date-format." },
      ],
      "no-restricted-syntax": ["error", ...restrictedSyntax, namedHue],
    },
  },
  {
    files: HUE_PALETTES,
    rules: {
      "no-restricted-syntax": ["error", ...restrictedSyntax],
    },
  },
]);

export default eslintConfig;
