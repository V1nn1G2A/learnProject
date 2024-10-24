module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  semi: true,

  sort: {
    order: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'other-libraries',
      '@api',
      '@hooks',
      '@models',
      '@components',
      '@ui-components',
      '@assets',
      '@pages',
      '@store',
    ],
    'ignore-case': true,
  },
};
