#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function setupThemes(storeUrl, themeToken, clientName) {
  console.log(chalk.blue('\nSetting up Shopify themes...\n'));

  // Set environment variables for Shopify CLI
  process.env.SHOPIFY_CLI_THEME_TOKEN = themeToken;
  process.env.SHOPIFY_FLAG_STORE = storeUrl;

  // Helper function to create theme name
  function createThemeName(type, name) {
    const fullName = `[${type}] - ${name}`;
    return fullName.length > 50 ? fullName.substring(0, 47) + '...' : fullName;
  }

  try {
    // List existing themes
    const themesOutput = execSync('shopify theme list --json', { encoding: 'utf8' });
    const themes = JSON.parse(themesOutput);

    if (themes.length === 0) {
      console.log(chalk.yellow('No existing themes found. Creating new themes from scratch.'));
    } else {
      // Format themes for selection
      const themeChoices = themes.map(theme => ({
        name: `${theme.name}${theme.role === 'live' ? ' (live)' : ''}`,
        value: theme.id
      }));

      // Add option to start from scratch
      themeChoices.push({
        name: 'Start from scratch (empty theme)',
        value: null
      });

      // Prompt for theme selection
      const { baseTheme } = await inquirer.prompt([
        {
          type: 'list',
          name: 'baseTheme',
          message: 'Select a theme to use as base:',
          choices: themeChoices
        }
      ]);

      if (baseTheme) {
        console.log(chalk.blue('\nPulling selected theme as base...'));
        execSync(`shopify theme pull -t ${baseTheme}`, { stdio: 'inherit' });
      }
    }

    // Check for existing Production and Staging themes
    const productionTheme = themes.find(t => t.name.startsWith('[Production]'));
    const stagingTheme = themes.find(t => t.name.startsWith('[Staging]'));

    if (!productionTheme) {
      const prodThemeName = createThemeName('Production', clientName);
      console.log(chalk.green(`\nCreating Production theme: ${prodThemeName}...`));
      execSync(`shopify theme push --unpublished --json -t "${prodThemeName}"`, { stdio: 'inherit' });
    }

    if (!stagingTheme) {
      const stagingThemeName = createThemeName('Staging', clientName);
      console.log(chalk.green(`\nCreating Staging theme: ${stagingThemeName}...`));
      execSync(`shopify theme push --unpublished --json -t "${stagingThemeName}"`, { stdio: 'inherit' });
    }
  } catch (error) {
    console.error(chalk.red('Error setting up themes:'), error.message);
    throw error;
  }
}

async function main() {
  console.log(chalk.blue('Welcome to Mili Release - Shopify Theme Automation\n'));

  // Check if templates directory exists
  const templatesDir = path.join(__dirname, '../templates');
  if (!fs.existsSync(templatesDir)) {
    console.error(chalk.red('Error: Templates directory not found. Please ensure the package is installed correctly.'));
    process.exit(1);
  }

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
        name: 'storeName',
        message: 'What is your Shopify store name? (e.g. your-store)',
        validate: input => /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(input) || 'Please enter a valid store name'
      },
      {
        type: 'password',
        name: 'themeToken',
        message: 'Enter your Shopify CLI theme token:',
        validate: input => input.length > 0 || 'Theme token is required'
      }
    ]);

    // Construct the full store URL
    const storeUrl = `${answers.storeName}.myshopify.com`;

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
        "theme:dev": `shopify theme dev --store=${storeUrl}`,
        "theme:pull": `shopify theme pull --store=${storeUrl}`,
        "theme:push:staging": `shopify theme push --store=${storeUrl} -t "[Staging] - ${answers.projectName}"`,
        "theme:push:production": `shopify theme push --store=${storeUrl} -t "[Production] - ${answers.projectName}"`,
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
    await setupThemes(storeUrl, answers.themeToken, answers.projectName);

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
