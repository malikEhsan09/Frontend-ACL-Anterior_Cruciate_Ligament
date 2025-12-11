declare module "tailwindcss/lib/util/flattenColorPalette" {
  // Minimal type declaration to satisfy TypeScript; matches Tailwind's internal util
  const flattenColorPalette: (colors: Record<string, any>) => Record<string, any>;
  export default flattenColorPalette;
}

