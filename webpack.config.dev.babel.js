import merge from 'webpack-merge';
import base from './webpack.config.babel';
import path from 'path';
import webpack from 'webpack';

new webpack.DefinePlugin({
  SERVER: JSON.stringify('http://localhost:3000')
});

export default merge.smart(base, {
  mode: 'development',

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  output: {
    path: path.join(__dirname, 'dev')
  },
  devServer: {
    port: process.env.PORT || 3001,
    contentBase: path.join(__dirname, 'public'),
    contentBasePublicPath: '/public/',
    publicPath: '/public'
  }
}
)
