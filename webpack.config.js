const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      chunk: 'app',
      title: 'Hot Module Replacement',
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
