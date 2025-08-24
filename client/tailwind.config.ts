import type { Config } from "tailwindcss";

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "../shared/**/*.{ts,tsx}", "../server/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // Village-One custom colors
        space: "hsl(240, 15%, 4%)",
        void: "hsl(240, 14%, 10%)",
        "purple-deep": "hsl(260, 60%, 25%)",
        "neon-cyan": "hsl(180, 100%, 50%)",
        "electric-green": "hsl(120, 100%, 42%)",
        "holo-gold": "hsl(51, 100%, 50%)",
        "earth-green": "hsl(120, 61%, 34%)",
        "earth-brown": "hsl(25, 75%, 31%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        cyber: ["var(--font-cyber)"],
        organic: ["var(--font-organic)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-neon": {
          "0%, 100%": { 
            boxShadow: "0 0 5px hsl(180, 100%, 50%), 0 0 10px hsl(180, 100%, 50%), 0 0 15px hsl(180, 100%, 50%)" 
          },
          "50%": { 
            boxShadow: "0 0 2px hsl(180, 100%, 50%), 0 0 5px hsl(180, 100%, 50%), 0 0 8px hsl(180, 100%, 50%)" 
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { 
            textShadow: "0 0 10px hsl(180, 100%, 50%), 0 0 20px hsl(180, 100%, 50%), 0 0 30px hsl(180, 100%, 50%)" 
          },
          to: { 
            textShadow: "0 0 5px hsl(180, 100%, 50%), 0 0 10px hsl(180, 100%, 50%), 0 0 15px hsl(180, 100%, 50%)" 
          },
        },
        holographic: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neon": "pulse-neon 2s infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        holographic: "holographic 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
