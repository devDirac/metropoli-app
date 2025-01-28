module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],

    },
  },
  plugins: [
    'react-native-reanimated/plugin',
    ['module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
        root: ['./src'],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@views': './src/views',
          '@theme': './src/theme',
          '@config': './src/config',
          '@navigation': './src/navigation',

        },
      },
    ],
  ],

};
