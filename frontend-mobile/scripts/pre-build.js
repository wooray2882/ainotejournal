/**
 * Pre-build script
 * Runs automatically before every build to display project guidelines
 */

const { displayProjectRules } = require('./project-rules');

// Display project rules
displayProjectRules();

console.log('Starting build process...'); 