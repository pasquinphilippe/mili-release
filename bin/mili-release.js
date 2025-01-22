#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log(chalk.blue('Welcome to Mili Release - Shopify Theme Automation\n'));

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your client/project name?',
        validate: input => input.length > 0 || 'Project name is required'
      },
      {
        type: 'input',
        name: 'storeUrl',
        message: 'What is your Shopify store URL? (e.g. your-store.myshopify.com)',
        validate: input => /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(input) || 'Please enter a valid Shopify store URL'
      },
      {
        type: 'password',
        name: 'themeToken',
        message: 'Enter your Shopify CLI theme token:',
        validate: input => input.length > 0 || 'Theme token is required'
      },
      {
        type: 'list',
        name: 'repoSetup',
        message: 'How would you like to set up version control?',
        choices: [
          { name: 'Create new repository', value: 'create' },
          { name: 'Connect to existing repository', value: 'connect' },
          { name: 'Skip Git setup', value: 'skip' }
        ]
      }
    ]);

    console.log(chalk.green('\nCreating theme directory structure...\n'));

    // Create directory structure
    const directories = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    if (answers.repoSetup !== 'skip') {
      console.log(chalk.green('\nInitializing Git repository...\n'));

      try {
        if (!fs.existsSync('.git')) {
          execSync('git init', { stdio: 'inherit' });
        }

        if (answers.repoSetup === 'connect') {
          const repoAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'repoUrl',
              message: 'Enter the existing repository URL:',
              validate: input => input.length > 0 || 'Repository URL is required'
            },
            {
              type: 'input',
              name: 'branch',
              message: 'Which branch would you like to use?',
              default: 'main'
            }
          ]);

          execSync(`git remote add origin ${repoAnswers.repoUrl}`, { stdio: 'inherit' });
          console.log(chalk.green(`\nConnected to repository: ${repoAnswers.repoUrl}\n`));
        }
      } catch (error) {
        console.error(chalk.yellow('Warning: Git initialization failed. You may need to set up Git manually.'));
        console.error(error.message);
      }
    }

    console.log(chalk.green('\nCreating package.json...\n'));

    const packageJson = {
      name: answers.projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '0.0.0-development',
      private: true,
      description: `Shopify theme for ${answers.projectName}`,
      scripts: {
        dev: `shopify theme dev --store=${answers.storeUrl}`,
        push: `shopify theme push --store=${answers.storeUrl}`,
        pull: `shopify theme pull --store=${answers.storeUrl}`,
        test: 'echo "No tests configured"'
      },
      dependencies: {
        '@shopify/cli': '^3.0.0',
        '@shopify/theme': '^3.0.0'
      },
      devDependencies: {
        '@commitlint/cli': '^18.4.0',
        '@commitlint/config-conventional': '^18.4.0',
        'husky': '^8.0.0',
        '@semantic-release/changelog': '^6.0.0',
        '@semantic-release/git': '^10.0.0',
        'semantic-release': '^23.0.0'
      }
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    console.log(chalk.green('\nInstalling dependencies...\n'));

    try {
      execSync('npm install', { stdio: 'inherit', maxBuffer: 1024 * 1024 * 10 }); // Increased buffer size
    } catch (error) {
      console.error(chalk.yellow('\nWarning: Some dependencies failed to install. You may need to run npm install manually.'));
      console.error(error.message);
    }

    console.log(chalk.green('\nSetting up semantic-release...\n'));

    const releaseConfig = {
      branches: ['main'],
      plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        ['@semantic-release/git', {
          assets: ['package.json', 'CHANGELOG.md'],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }]
      ]
    };

    fs.writeFileSync('.releaserc.json', JSON.stringify(releaseConfig, null, 2));

    if (answers.repoSetup !== 'skip') {
      console.log(chalk.green('\nCreating initial commit...\n'));

      try {
        execSync('git add .', { stdio: 'inherit', maxBuffer: 1024 * 1024 * 10 });
        execSync('git commit -m "feat: Initial theme setup"', { stdio: 'inherit', maxBuffer: 1024 * 1024 * 10 });
      } catch (error) {
        console.error(chalk.yellow('\nWarning: Failed to create initial commit. You may need to commit manually.'));
        console.error(error.message);
      }
    }

    console.log(chalk.green('\nSetup completed successfully! 🎉\n'));
    console.log(chalk.blue('Next steps:'));
    console.log('1. Start development server:', chalk.cyan('npm run dev'));
    console.log('2. Push changes to Shopify:', chalk.cyan('npm run push'));
    console.log('3. Pull latest changes:', chalk.cyan('npm run pull'));

    if (answers.repoSetup === 'create') {
      console.log('4. Create a repository on GitHub and push your code:');
      console.log(chalk.cyan('   git remote add origin <repository-url>'));
      console.log(chalk.cyan('   git push -u origin main'));
    }

  } catch (error) {
    console.error(chalk.red('\nError during setup:'), error);
    process.exit(1);
  }
}

main();
