module.exports = {
  root: true,

  extends: ['@react-native', 'prettier'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  // rules: {
  //   'prettier/prettier': [
  //     'error',
  //     {
  //       endOfLine: 'auto',
  //       singleQuote: true,
  //       printWidth: 80,
  //       tabWidth: 2,
  //       trailingComma: 'es5',
  //     },
  //   ],
  //   'react/react-in-jsx-scope': 'off',
  //   'react-native/no-inline-styles': 'off',
  // },
};
