#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function setupThemes(storeUrl, themeToken) {
  console.log(chalk.blue('\nSetting up Shopify themes...\n'));

  // Set environment variables for Shopify CLI
  process.env.SHOPIFY_CLI_THEME_TOKEN = themeToken;
  process.env.SHOPIFY_FLAG_STORE = storeUrl;

  try {
    // List existing themes
    const themesOutput = execSync('shopify theme list --json', { encoding: 'utf8' });
    const themes = JSON.parse(themesOutput);

    // Check for existing Production and Staging themes
    const productionTheme = themes.find(t => t.name.startsWith('[Production]'));
    const stagingTheme = themes.find(t => t.name.startsWith('[Staging]'));

    if (!productionTheme) {
      console.log(chalk.green('Creating Production theme...'));
      execSync('shopify theme push --unpublished --json -t "[Production] - ${storeUrl}"', { stdio: 'inherit' });
    }

    if (!stagingTheme) {
      console.log(chalk.green('Creating Staging theme...'));
      execSync('shopify theme push --unpublished --json -t "[Staging] - ${storeUrl}"', { stdio: 'inherit' });
    }
  } catch (error) {
    console.error(chalk.red('Error setting up themes:'), error.message);
    throw error;
  }
}

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

    // Initialize Git repository
    console.log(chalk.green('\nInitializing Git repository...\n'));

    try {
      if (!fs.existsSync('.git')) {
        execSync('git init', { stdio: 'inherit' });
        execSync('git checkout -b main', { stdio: 'inherit' });
      }
    } catch (error) {
      console.error(chalk.yellow('Warning: Git initialization failed. You may need to set up Git manually.'));
      console.error(error.message);
    }

    // Create package.json
    console.log(chalk.green('\nCreating package.json...\n'));

    const packageJson = {
      name: answers.projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '0.0.0-development',
      private: true,
      description: `Shopify theme for ${answers.projectName}`,
      scripts: {
        "theme:dev": `shopify theme dev --store=${answers.storeUrl}`,
        "theme:pull": `shopify theme pull --store=${answers.storeUrl}`,
        "theme:push:staging": `shopify theme push --store=${answers.storeUrl} -t "[Staging] - ${answers.storeUrl}"`,
        "theme:push:production": `shopify theme push --store=${answers.storeUrl} -t "[Production] - ${answers.storeUrl}"`,
        "test": "echo \"No tests configured\""
      },
      devDependencies: {
        '@commitlint/cli': '^18.4.0',
        '@commitlint/config-conventional': '^18.4.0',
        'husky': '^8.0.0'
      }
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Set up themes
    await setupThemes(answers.storeUrl, answers.themeToken);

    // Create GitHub Actions workflow
    console.log(chalk.green('\nSetting up GitHub Actions workflow...\n'));

    const workflowDir = '.github/workflows';
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }

    // Copy your existing workflow file
    fs.writeFileSync(
      path.join(workflowDir, 'theme-preview.yml'),
      fs.readFileSync(path.join(__dirname, '../templates/theme-preview.yml'), 'utf8')
    );

    // Initial commit
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "feat: Initial theme setup"', { stdio: 'inherit' });
    } catch (error) {
      console.error(chalk.yellow('\nWarning: Failed to create initial commit. You may need to commit manually.'));
      console.error(error.message);
    }

    console.log(chalk.green('\nSetup completed successfully! 🎉\n'));
    console.log(chalk.blue('Next steps:'));
    console.log('1. Create a new repository on GitHub');
    console.log('2. Push your code:', chalk.cyan('git remote add origin <repository-url> && git push -u origin main'));
    console.log('3. Create a new branch for your feature:', chalk.cyan('git checkout -b feat/your-feature-name'));
    console.log('4. Start development:', chalk.cyan('npm run theme:dev'));
    console.log('\nWhen ready to deploy:');
    console.log('1. Create a pull request to staging');
    console.log('2. Review the preview theme (automatically created)');
    console.log('3. Merge to staging to update the staging theme');
    console.log('4. Create a pull request from staging to main for production deployment');

  } catch (error) {
    console.error(chalk.red('\nError during setup:'), error);
    process.exit(1);
  }
}

main();
