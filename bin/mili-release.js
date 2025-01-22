#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log(chalk.blue('Welcome to Mili Release - Shopify Theme Automation'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your client/project name?',
      validate: input => input.length > 0 || 'Project name is required'
    },
    {
      type: 'input',
      name: 'shopifyStore',
      message: 'What is your Shopify store URL? (e.g. your-store.myshopify.com)',
      validate: input => /\.myshopify\.com$/.test(input) || 'Please enter a valid Shopify store URL'
    },
    {
      type: 'password',
      name: 'themeToken',
      message: 'Enter your Shopify CLI theme token:',
      validate: input => input.length > 0 || 'Theme token is required'
    }
  ]);

  try {
    // Create directory structure
    console.log(chalk.yellow('\nCreating theme directory structure...'));
    const directories = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Initialize Git repository
    console.log(chalk.yellow('\nInitializing Git repository...'));
    execSync('git init');

    // Create package.json if it doesn't exist
    if (!fs.existsSync('package.json')) {
      console.log(chalk.yellow('\nCreating package.json...'));
      const packageJson = {
        name: answers.projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '0.0.0-development',
        private: true,
        description: `Shopify theme for ${answers.projectName}`,
        scripts: {
          'theme:push': 'shopify theme push',
          'theme:pull': 'shopify theme pull',
          'release': 'semantic-release'
        },
        devDependencies: {
          '@shopify/cli': '^3.0.0',
          '@shopify/theme': '^3.0.0',
          '@commitlint/cli': '^18.4.0',
          '@commitlint/config-conventional': '^18.4.0',
          '@semantic-release/changelog': '^6.0.0',
          '@semantic-release/git': '^10.0.0',
          'semantic-release': '^23.0.0',
          'husky': '^8.0.0'
        }
      };
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    }

    // Install dependencies
    console.log(chalk.yellow('\nInstalling dependencies...'));
    execSync('npm install', { stdio: 'inherit' });

    // Set up semantic-release configuration
    console.log(chalk.yellow('\nSetting up semantic-release...'));
    const releaseConfig = {
      branches: ['main'],
      plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/git'
      ]
    };
    fs.writeFileSync('.releaserc.json', JSON.stringify(releaseConfig, null, 2));

    // Set up commitlint configuration
    const commitlintConfig = {
      extends: ['@commitlint/config-conventional']
    };
    fs.writeFileSync('commitlint.config.js', `module.exports = ${JSON.stringify(commitlintConfig, null, 2)};`);

    // Create initial commit
    console.log(chalk.yellow('\nCreating initial commit...'));
    execSync('git add .');
    execSync('git commit -m "feat: Initial theme setup"');

    console.log(chalk.green('\nTheme setup completed successfully! 🎉'));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Run ' + chalk.cyan('npm run theme:push') + ' to push your theme to Shopify');
    console.log('2. Create feature branches for your changes');
    console.log('3. Make commits following conventional commit format');
    console.log('4. Create pull requests to merge your changes');
    console.log('5. Releases will be automatically created when merging to main');

  } catch (error) {
    console.error(chalk.red('\nError during setup:'), error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red('\nUnexpected error:'), error);
  process.exit(1);
});
