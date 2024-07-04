/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#6A6CF6',
        'bg-color':'#F1F0FF',
        'codeSnippetColor' : '#011627'
      },
      fontSize: {
        'own': '13.5px', // Add a custom text size
      },
      boxShadow:{
        'custom-black': ' 0px 0px 25px 1px rgba(156,156,156,0.15)', // Customize shadow
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      translate:{
        custom: '275px'
      }
    },
  },
  plugins: [],
}