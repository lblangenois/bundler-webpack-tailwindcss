const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const globImporter = require("node-sass-glob-importer");

require("dotenv").config();

module.exports = (env, options) => {
	webpackRules = {
		entry: { main: "./src/scripts/main.ts" },
		mode: process.env.mode || "development",
		devtool: process.env.mode === "production" ? false : "eval",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "scripts/[name].min.js",
		},
		module: {
			rules: [
				{
					test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[hash].[ext]",
								outputPath: "fonts/",
								esModule: false,
							},
						},
					],
				},
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: /node_modules/,
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								importLoaders: 1,
								esModule: false,
							},
						},
						"postcss-loader",
						{
							loader: "sass-loader",
							options: {
								sassOptions: {
									importer: globImporter(),
								},
							},
						},
					],
				},
				{
					test: /\.(jpg|png|svg|gif)$/,
					loader: "url-loader",
					options: {
						limit: 100000,
					},
				},
				{
					test: /\.jsx?$/,
					exclude: "/node_modules/",
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: [
							"@babel/plugin-transform-modules-commonjs",
							"add-module-exports",
						],
					},
				},
			],
		},
		optimization: {
			minimize: true,
			minimizer: [
				new CssMinimizerPlugin(),
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: false,
						},
					},
					extractComments: false,
					minify: (file, sourceMap) => {
						const uglifyJsOptions = {};

						if (sourceMap) {
							uglifyJsOptions.sourceMap = {
								content: sourceMap,
							};
						}

						return require("uglify-js").minify(file, uglifyJsOptions);
					},
				}),
			],
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
		},
		plugins: [
			new MiniCssExtractPlugin({ filename: "styles/[name].min.css" }),
		],
	};

	return webpackRules;
};
