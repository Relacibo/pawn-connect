import path from 'path';

export default {
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx"]
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ],
  },
  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    alias: {
      "@modules": path.resolve(__dirname, 'src/modules'),
      "@root": path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "redux": "Redux",
    "peerjs": "peerjs"
  }
}
