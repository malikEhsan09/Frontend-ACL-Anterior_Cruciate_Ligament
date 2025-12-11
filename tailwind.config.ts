import type { Config } from "tailwindcss";


import svgToDataUri from "mini-svg-data-uri";
 
import colors from "tailwindcss/colors";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		 scrollbar: ['rounded'],
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			lightBlue: '#547ea8',
  			sidebar: '#151F38',
  			onHover: '#1F3F72',
  			darkBlue: '#28375B',
  			buttonColor: '#1F3F72',
  			boldTextColor: '#121212',
  			semiTextColor: '#676F87',
  			toggleBackground: '#12182A'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		screens: {
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px'
  		},
  		keyframes: {
			 scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			 scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors, function ({ addUtilities }: { addUtilities: (utilities: Record<string, any>, variants?: string[]) => void }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px', // Adjust as needed
          },
          '&::-webkit-scrollbar-track': {
            'background-color': '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#888',
            'border-radius': '10px',
            'border': '2px solid #f1f1f1',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background-color': '#555',
          },
        },
      });
    }, function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default config;
