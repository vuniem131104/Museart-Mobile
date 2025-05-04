/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter-Regular', 'sans-serif'],
                interBold: ['Inter-Bold', 'sans-serif'],
                interMedium: ['Inter-Medium', 'sans-serif'],
                interRegular: ['Inter-Regular', 'sans-serif'],
                interSemibold: ['Inter-SemiBold', 'sans-serif'],
                interLight: ['Inter-Light', 'sans-serif'],
            },
            fontSize: {
                base: '1rem',
                sm: '0.875rem',
                lg: '1.125rem',
            },
            colors: {
                primary: {
                    DEFAULT: '#A00000',
                    light: '#BE0303',
                    dark: '#D00000',
                },
                secondary: {
                    DEFAULT: '#4B4B4B',
                    light: '#626262',
                    dark: '#333333',
                },
                background: {
                    DEFAULT: '#A00000',
                    light: '#BE0303',
                    dark: '#800000',
                },
                input: {
                    DEFAULT: '#4B4B4B',
                    light: '#626262',
                    dark: '#333333',
                },
                text: {
                    DEFAULT: '#FFFFFF',
                    dark: '#F5F2EC',
                },
                surfaceContainer: {
                    DEFAULT: '#4B4B4B',
                    light: '#626262',
                    dark: '#333333',
                },
                onSurface: {
                    DEFAULT: '#FFFFFF',
                    light: '#F5F2EC',
                    dark: '#FFFFFF',
                },
                surface: {
                    DEFAULT: '#A00000',
                    light: '#BE0303',
                    dark: '#800000',
                },
            }
        },
    },
    plugins: [],
}
