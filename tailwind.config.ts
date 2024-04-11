import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--gradient-color-stops))',
      },
      lineHeight: {
        '20': '5rem',
      },
      maxWidth: {
        '9xl': '80rem',
      },
      gridTemplateColumns: {
        // Simple first column bigger, other same size smaller
        'first-big': '3fr repeat(3, minmax(0, 1fr))',
      },
      fontFamily: {
        montserrat: 'var(--font-montserrat)',
        unbounded: 'var(--font-unbounded)',
        syne: 'var(--font-syne)',
        dm_sans: 'var(--font-dm_sans)',
      },
      colors: {
        /* basic colors */
        white: '#FFFFFF',
        black: '#000000',
        transparent: 'transparent',
        /* purple */
        'purple-1': '#F7EFFB',
        'purple-2': '#D2C8EF',
        'purple-3': '#AB9DCF',
        'purple-4': '#CA8DE2',
        'purple-5': '#BB6BDA',
        'purple-6': '#B45CD6',
        'purple-7': '#AC4BD2',
        'purple-8': '#A43BCE',
        /* green */
        'green-1': '#ECFEF8',
        'green-2': '#D9FCF2',
        'green-3': '#A0F8DE',
        'green-4': '#79F6D0',
        'green-5': '#53F3C3',
        'green-6': '#2DF0B6',
        'green-7': '#65D47C',
        'green-8': '#2A9340',
        /* red  */
        'red-1': '#FFEBEC',
        'red-2': '#FFD6DA',
        'red-3': '#E6B3CA',
        'red-4': '#FF858F',
        'red-5': '#FF6370',
        'red-6': '#FF5C69',
        'red-7': '#FF4757',
        'red-8': '#FF3344',
        /* primary color  */
        'primary-1': '#EBF4FF',
        'primary-2': '#D6E9FF',
        'primary-3': '#8FBBF9',
        'primary-4': '#489DFE',
        'primary-5': '#0177FB',
        'primary-6': '#0169DF',
        'primary-7': '#015FCB',
        'primary-8': '#0156B7',
        /* pink color  */
        'pink-1': '#FFF6F0',
        'pink-2': '#FDDBC4',
        'pink-3': '#FAB4AD',
        'pink-4': '#FA857A',
        'pink-5': '#FF6F62',
        /* teal color  */
        'teal-1': '#C2F5E9',
        'teal-2': '#78FBE5',
        'teal-3': '#76EDDD',
        'teal-4': '#5FCEBA',
        'teal-5': '#36767E',
        /* yellow color */
        'yellow-1': '#FFF6EE',
        'yellow-2': '#FFE89F',
        'yellow-3': '#FFD28A',
        /* other lastic colors */
        'lastic-red': '#E6B3CA',
        'lastic-lavender': '#AB9DCF',
        'lastic-lastic': '#AB9DCF',
        'lastic-navy': '#AB9DCF',
        'lastic-yellow': '#F6C361',
        'lastic-lavender-light': '#D2C8EF',
        'lastic-plum': '#B5179E',
        'lastic-special-from': '#B5189F',
        'lastic-special-to': '#3C0080',
        'lastic-green': '#2A9340',
        'lastic-teal': '#37FCFB',
        'lastic-aqua': '#8AC7DB',
        'lastic-spectrum-from': '#FDDBC4',
        'lastic-spectrum-via': '#FF977F',
        'lastic-spectrum-to': '#FDDBC4',
        /* gray */
        'gray-1': '#F3F4F6',
        'gray-2': '#E8E8ED',
        'gray-3': '#DCDDE5',
        'gray-4': '#D0D1DC',
        'gray-5': '#C5C6D3',
        'gray-6': '#B9BACA',
        'gray-7': '#AEAFC2',
        'gray-8': '#A2A3B9',
        'gray-9': '#9698B0',
        'gray-10': '#8B8CA7',
        'gray-11': '#7F819F',
        'gray-12': '#737596',
        'gray-13': '#696B8C',
        'gray-14': '#606280',
        'gray-15': '#585974',
        'gray-16': '#4F5069',
        'gray-17': '#46475D',
        'gray-18': '#3B3C4E',
        'gray-19': '#353546',
        'gray-20': '#2C2D3A',
        'gray-21': '#23242F',
        'gray-22': '#1A1B23',
        'gray-23': '#121217',
        'gray-24': '#09090C',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
