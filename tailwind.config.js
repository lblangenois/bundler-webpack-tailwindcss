module.exports = {
	content: [
		"./**/*.html",
		"./**/*.twig",
		"./**/*.php",
		"./**/*.{js,ts,tsx,jsx}",
		"!node_modules/**",
	],
	theme: {
		screens: {
			xs: "480px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
	},
	corePlugins: {
		container: false,
	},
	plugins: [
		({ addComponents }) => {
			addComponents({
				".container": {
					width: "100%",
					maxWidth: "1200px",
					marginLeft: "auto",
					marginRight: "auto",
				},
			});
		},
	],
};
