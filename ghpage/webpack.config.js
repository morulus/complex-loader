const path = require(`path`);
const { ContextReplacementPlugin } = require(`webpack`);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require(`webpack-bundle-analyzer`).BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const markdownRule = require(`./config/markdown.rule.js`);
const EXPORT_DEFAULT_OPEN_CHUNK = `module.exports = {`;

module.exports = {
  entry: path.resolve(__dirname, `./src/index.js`),
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `bundle.js`
  },
  resolve: {
    alias: {
      vue: `vue/dist/vue.js`
    }
  },
  module: {
    rules: [
      markdownRule,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        oneOf: [
          {
            test: /\.rule\.js$/,
            loader: [
              `raw-loader`,
              {
                loader: `skeleton-loader`,
                options: {
                  procedure: (content) => {
                    const exportPos = content.indexOf(EXPORT_DEFAULT_OPEN_CHUNK);
                    return content
                          .substring(exportPos + EXPORT_DEFAULT_OPEN_CHUNK.length - 1)
                          .replace(/LOCAL_COMPLEX_LOADER/g, `\`complex-loader\``);
                  }
                }
              }
            ]
          },
          {
            loader: `babel-loader`
          }
        ]
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        use: `file-loader`
      },
      {
        test: /\.css$/,
        use: [
          `style-loader`,
          `css-loader`
        ]
      }
    ]
  },
  plugins: [
    // Reduce bundle size
    new ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        /javascript\.js|json\.js|bash\.js/
    ),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(
        __dirname,
        `./public/index.html`
      )
    }),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    })
  ],
  mode: `development`
};
