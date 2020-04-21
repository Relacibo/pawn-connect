import merge from 'webpack-merge';
import base from './webpack.config.babel';
import path from 'path';

new webpack.DefinePlugin({
  SERVER: JSON.stringify('https://pawn-connect.org')
});

export default merge.smart(productionConfig, {
  mode: "production",
  output: {
    path: path.join(__dirname, 'public')
  }
});