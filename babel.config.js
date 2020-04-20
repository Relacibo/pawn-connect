module.exports = api => {
  // See docs about api at https://babeljs.io/docs/en/config-files#apicache
  api.cache(true);

  return {
    presets: [
      // @babel/preset-env will automatically target our browserslist targets
      require('@babel/preset-env'),
      require('@babel/preset-typescript'),
      [require('@babel/preset-react')]
    ],
    plugins: [
      // Stage 0

      // Stage 1
      require('@babel/plugin-proposal-export-default-from'),

      // Stage 2

      // Stage 3
      require('@babel/plugin-proposal-json-strings'),
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      require('@babel/plugin-transform-react-constant-elements'),
      require('@babel/plugin-transform-react-inline-elements'),
      require('@babel/plugin-transform-runtime')
    ]
  };
};
