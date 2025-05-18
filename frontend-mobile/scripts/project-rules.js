/**
 * Project Rules Reminder System
 * This file contains project guidelines that are automatically displayed during build
 */

const chalk = require('chalk');

const PROJECT_RULES = {
  architecture: [
    'Use React Native with Expo 53 for iOS development',
    'Implement AWS Amplify for backend services',
    'Utilize GraphQL with AppSync for data operations',
    'Leverage AWS Bedrock for AI capabilities'
  ],
  directoryStructure: [
    'Keep components in /src/components',
    'Place screens in /src/screens',
    'Store API services in /src/services',
    'Define types in /src/types',
    'Create reusable hooks in /src/hooks',
    'Place utilities in /src/utils'
  ],
  codingStandards: [
    'Write clean, modular components',
    'Use functional components with hooks',
    'Implement proper TypeScript typing',
    'Follow consistent naming conventions',
    'Document complex logic'
  ],
  performance: [
    'Implement React.memo for expensive components',
    'Use useCallback for functions passed to children',
    'Employ useMemo for expensive calculations',
    'Optimize image assets',
    'Implement proper list rendering with FlatList'
  ],
  security: [
    'Never store sensitive data in client-side storage',
    'Use proper authentication with AWS Cognito',
    'Implement proper input validation',
    'Follow AWS security best practices',
    'Use environment variables for sensitive configuration'
  ]
};

// Get a random section to display
const getRandomSection = () => {
  const sections = Object.keys(PROJECT_RULES);
  const randomSection = sections[Math.floor(Math.random() * sections.length)];
  return {
    title: randomSection,
    rules: PROJECT_RULES[randomSection]
  };
};

// Display project rules
const displayProjectRules = () => {
  const section = getRandomSection();
  
  console.log('\n');
  console.log(chalk.cyan.bold('📝 PROJECT GUIDELINES REMINDER 📝'));
  console.log(chalk.yellow.bold(`\n${section.title.toUpperCase()} GUIDELINES:`));
  
  section.rules.forEach(rule => {
    console.log(chalk.green(`• ${rule}`));
  });
  
  console.log('\n');
};

module.exports = {
  displayProjectRules
}; 