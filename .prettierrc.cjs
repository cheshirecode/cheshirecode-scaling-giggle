module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  trailingComma: 'all',
  printWidth: 100,
  endOfLine: 'lf',
  bracketSpacing: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      options: {
        parser: 'babel',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
    {
      files: ['*.json', '*.jsonc', '.*rc'],
      options: { parser: 'json' },
    },
    {
      files: ['*.css', '*.scss', '.*less'],
      options: { parser: 'css' },
    },
  ],
};
