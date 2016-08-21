var config = {
  context: __dirname + "/app",
  entry: "./Render.js",
	watch: true,
  output: {
    filename: "app-bundle.js",
    path: __dirname + "/dist",
	watch: true
  },

	module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /static/, /vendor/],
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        },
		watch: true
      }
    ],
  }
};
module.exports = config;
