module.exports = function (api) {
  api.cache(true); // https://babeljs.io/docs/en/config-files#apicache
  return {
    presets: [
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv',
      'module:@babel/preset-flow'
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json'
          ],
          alias: {}
        }
      ]
    ]
  };
};
