const path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "canopy-charts",
      type: "umd",
    },
  },
  externals: {
    react: "react", // Case matters here
    "react-dom": "reactDOM", // Case matters here
  },
};
