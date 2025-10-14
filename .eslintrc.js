// https://docs.expo.dev/guides/using-eslint/
// This configuration reuses .prettierignore to avoid duplication

const fs = require('fs');
const path = require('path');

/**
 * Load patterns from .prettierignore and convert them for ESLint usage
 * This ensures both tools use the same ignore patterns
 */
function loadPrettierIgnorePatterns() {
  const prettierIgnorePath = path.resolve(process.cwd(), '.prettierignore');

  if (!fs.existsSync(prettierIgnorePath)) {
    console.warn('⚠️  .prettierignore not found, using minimal ESLint patterns');
    return ['/dist/*', 'node_modules/'];
  }

  try {
    const content = fs.readFileSync(prettierIgnorePath, 'utf8');
    const patterns = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
      .map(pattern => {
        // ESLint ignorePatterns work slightly differently than .prettierignore
        // Convert directory patterns to work with ESLint
        if (pattern.endsWith('/')) {
          return pattern + '**/*'; // Ensure ESLint ignores directory contents
        }
        return pattern;
      });

    console.log(`✅ Loaded ${patterns.length} ignore patterns from .prettierignore`);
    return patterns;
  } catch (error) {
    console.error('❌ Error reading .prettierignore:', error.message);
    return ['/dist/*', 'node_modules/'];
  }
}

module.exports = {
  extends: 'expo',
  ignorePatterns: loadPrettierIgnorePatterns(),
};
