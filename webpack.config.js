module.exports = {
  entry: ['./src/client/index.js'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  output: {
    path: `${__dirname}/src/dist/public/js`,
    publicPath: `${__dirname}/src/dist/public`,
    filename: 'bundle.js',
  },
};
