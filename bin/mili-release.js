#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';
import { argv } from 'yargs';

// ES Module equivalents for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the templates directory path
const getTemplatesDir = () => path.join(dirname(fileURLToPath(import.meta.url)), '../templates');

// Helper function to get config directory path
function getConfigPath() {
  const configDir = path.join(os.homedir(), '.mili-theme');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  return path.join(configDir, 'config.json');
}

// Helper function to load stored configurations
function loadConfig() {
  const configPath = getConfigPath();
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (error) {
    console.error(chalk.yellow('Warning: Could not load stored configuration'));
  }
  return { stores: {} };
}

// Helper function to save configurations
function saveConfig(config) {
  const configPath = getConfigPath();
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(chalk.yellow('Warning: Could not save configuration'));
  }
}

// Helper function to get stored theme token
async function getThemeToken(storeName, autoUseStored = false) {
  const config = loadConfig();
  const storeConfig = config.stores?.[storeName];

  console.log(chalk.blue('\nChecking for stored theme token...'));

  // Add more detailed logging for debugging
  console.log(chalk.dim('Debug - Store config:', JSON.stringify(storeConfig, null, 2)));

  // Improved validation
  const hasValidToken = storeConfig?.themeToken &&
                       typeof storeConfig.themeToken === 'string' &&
                       storeConfig.themeToken.trim().length > 0;

  if (hasValidToken) {
    console.log(chalk.green(`Found stored token for ${storeName}`));

    if (autoUseStored) {
      console.log(chalk.green(`Using stored configuration for ${storeName}`));
      return storeConfig.themeToken;
    }

    const { useStored } = await inquirer.prompt([{
      type: 'confirm',
      name: 'useStored',
      message: `Use stored theme token for ${storeName}?`,
      default: true
    }]);

    if (useStored) {
      return storeConfig.themeToken;
    }
  } else {
    console.log(chalk.yellow('No valid stored token found'));
  }

  const { themeToken } = await inquirer.prompt([{
    type: 'password',
    name: 'themeToken',
    message: 'Enter your Shopify CLI theme token:',
    validate: input => input.length > 0 || 'Theme token is required'
  }]);

  const { saveToken } = await inquirer.prompt([{
    type: 'confirm',
    name: 'saveToken',
    message: 'Would you like to save this token for future use?',
    default: true
  }]);

  if (saveToken) {
    config.stores[storeName] = {
      ...config.stores[storeName],
      themeToken
    };
    saveConfig(config);
    console.log(chalk.green('Token saved successfully'));
  }

  return themeToken;
}

// Helper function to get stored store configuration
async function getStoredStoreConfig() {
  const config = loadConfig();
  const stores = Object.keys(config.stores);

  if (stores.length === 0) {
    return null;
  }

  if (stores.length === 1) {
    const storeName = stores[0];
    return {
      storeName,
      themeToken: config.stores[storeName].themeToken
    };
  }

  const { selectedStore } = await inquirer.prompt([{
    type: 'list',
    name: 'selectedStore',
    message: 'Select a stored configuration:',
    choices: [
      ...stores.map(store => ({
        name: store,
        value: store
      })),
      { name: 'Create new configuration', value: null }
    ]
  }]);

  if (!selectedStore) {
    return null;
  }

  return {
    storeName: selectedStore,
    themeToken: config.stores[selectedStore].themeToken
  };
}

// Helper function to list stored configurations
async function listStoredConfigs() {
  const config = loadConfig();
  const stores = Object.keys(config.stores);

  if (stores.length === 0) {
    console.log(chalk.yellow('No stored configurations found.'));
    return;
  }

  console.log(chalk.blue('\nStored configurations:'));
  stores.forEach(store => {
    console.log(chalk.green(`- ${store}`));
  });
}

// Helper function to remove stored configuration
async function removeStoredConfig(storeName) {
  const config = loadConfig();
  if (config.stores[storeName]) {
    delete config.stores[storeName];
    saveConfig(config);
    console.log(chalk.green(`\nRemoved configuration for ${storeName}`));
  }
}

async function setupThemes(storeUrl, themeToken, clientName) {
  console.log(chalk.blue('\nSetting up Shopify themes...\n'));

  // Log masked token for debugging
  const maskedToken = themeToken ? `${themeToken.substring(0, 4)}...${themeToken.substring(themeToken.length - 4)}` : 'undefined';
  console.log(chalk.blue('Debug - Theme token:'), chalk.dim(maskedToken));
  console.log(chalk.blue('Debug - Store URL:'), chalk.dim(storeUrl));

  // Set environment variables for Shopify CLI
  process.env.SHOPIFY_CLI_THEME_TOKEN = themeToken;
  process.env.SHOPIFY_FLAG_STORE = storeUrl;

  // Log environment variables for debugging
  console.log(chalk.blue('Debug - Environment variables set:'));
  console.log(chalk.dim('SHOPIFY_CLI_THEME_TOKEN:', process.env.SHOPIFY_CLI_THEME_TOKEN ? 'Set' : 'Not set'));
  console.log(chalk.dim('SHOPIFY_FLAG_STORE:', process.env.SHOPIFY_FLAG_STORE));

  // Helper function to create theme name
  function createThemeName(type, name) {
    const fullName = `[${type}] - ${name}`;
    return fullName.length > 50 ? fullName.substring(0, 47) + '...' : fullName;
  }

  try {
    // Verify store access and authentication using theme list instead of store info
    console.log(chalk.blue('Verifying store access...'));
    try {
      // Check if we can access the store by listing themes
      execSync('shopify theme list --json', { encoding: 'utf8' });
    } catch (error) {
      if (error.message.includes('401')) {
        console.error(chalk.red('\nAuthentication Error: Unable to access the store.'));
        console.log(chalk.yellow('\nPlease ensure:'));
        console.log('1. You have logged in to the store directly at least once');
        console.log(`2. Visit https://${storeUrl}/admin first`);
        console.log('3. You have the correct permissions (store owner or staff account)');
        console.log('4. Your theme token is correct');
        throw new Error('Store authentication failed');
      }
      throw error;
    }

    // Verify theme permissions
    console.log(chalk.blue('Verifying theme permissions...'));
    try {
      // Try to list themes to verify permissions
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
          try {
            execSync(`shopify theme pull -t ${baseTheme}`, { stdio: 'inherit' });
          } catch (error) {
            if (error.message.includes('401') || error.message.includes('403')) {
              console.error(chalk.red('\nPermission Error: Unable to pull theme.'));
              console.log(chalk.yellow('\nPlease ensure:'));
              console.log('1. You have a staff account or are the store owner');
              console.log('2. Your account has theme management permissions');
              throw new Error('Theme pull permission denied');
            }
            throw error;
          }
        }
      }

      // Check for existing Production and Staging themes
      const productionTheme = themes.find(t => t.name.startsWith('[Production]'));
      const stagingTheme = themes.find(t => t.name.startsWith('[Staging]'));

      if (!productionTheme) {
        const prodThemeName = createThemeName('Production', clientName);
        console.log(chalk.green(`\nCreating Production theme: ${prodThemeName}...`));
        try {
          execSync(`shopify theme push --unpublished --json -t "${prodThemeName}"`, { stdio: 'inherit' });
        } catch (error) {
          if (error.message.includes('401') || error.message.includes('403')) {
            console.error(chalk.red('\nPermission Error: Unable to create production theme.'));
            console.log(chalk.yellow('\nPlease ensure:'));
            console.log('1. You have a staff account or are the store owner');
            console.log('2. Your account has theme management permissions');
            throw new Error('Theme creation permission denied');
          }
          throw error;
        }
      }

      if (!stagingTheme) {
        const stagingThemeName = createThemeName('Staging', clientName);
        console.log(chalk.green(`\nCreating Staging theme: ${stagingThemeName}...`));
        try {
          execSync(`shopify theme push --unpublished --json -t "${stagingThemeName}"`, { stdio: 'inherit' });
        } catch (error) {
          if (error.message.includes('401') || error.message.includes('403')) {
            console.error(chalk.red('\nPermission Error: Unable to create staging theme.'));
            console.log(chalk.yellow('\nPlease ensure:'));
            console.log('1. You have a staff account or are the store owner');
            console.log('2. Your account has theme management permissions');
            throw new Error('Theme creation permission denied');
          }
          throw error;
        }
      }
    } catch (error) {
      if (!error.message.includes('permission denied')) {
        console.error(chalk.red('\nError verifying theme permissions:'), error.message);
        console.log(chalk.yellow('\nPlease ensure:'));
        console.log('1. The Shopify CLI is installed and up to date');
        console.log('2. You have logged in to the store directly at least once');
        console.log('3. Your theme token is correct');
        console.log('4. You have the necessary permissions');
      }
      throw error;
    }

    console.log(chalk.green('\n✓ Store access and permissions verified successfully'));
  } catch (error) {
    console.error(chalk.red('\nError setting up themes:'), error.message);
    throw error;
  }
}

// Helper function to check if we're in a Git repository
function isGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to check if we're in the root of a Git repository
function isGitRoot() {
  try {
    const gitDir = execSync('git rev-parse --git-dir', { encoding: 'utf8' }).trim();
    return gitDir === '.git';
  } catch (error) {
    return false;
  }
}

// Helper function to get the current Git branch
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

async function setupGitHub(projectName, shopifyToken, storeUrl) {
  console.log('\nSetting up GitHub integration...\n');

  const { githubSetup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'githubSetup',
      message: 'How would you like to set up GitHub?',
      choices: [
        { name: 'Create a new repository', value: 'create' },
        { name: 'Connect to an existing repository', value: 'connect' },
        { name: 'Skip GitHub setup', value: 'skip' }
      ]
    }
  ]);

  if (githubSetup === 'skip') {
    console.log('Skipping GitHub setup...');
    return;
  }

  // Check if GitHub CLI is installed and authenticated
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch (error) {
    console.log('\n⚠️  GitHub CLI not installed or not authenticated');
    console.log('Please install the GitHub CLI and run gh auth login');
    return;
  }

  let username;
  try {
    // Get GitHub username using gh CLI
    username = execSync('gh api user -q .login', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(chalk.red('Error getting GitHub username. Please ensure you are logged in with gh cli.'));
    return;
  }

  async function setupGitHubSecrets(repoFullName, repoUrl) {
    console.log('\nSetting up GitHub secrets...');
    try {
      await setGitHubSecrets(repoFullName, {
        SHOPIFY_CLI_THEME_TOKEN: shopifyToken,
        SHOPIFY_STORE_URL: storeUrl
      });
      console.log(chalk.green('✓ GitHub secrets configured successfully'));
      return true;
    } catch (error) {
      console.error(chalk.yellow('\nWarning: Could not set GitHub secrets automatically.'));
      console.log(chalk.cyan('\nPlease set these secrets manually in your repository settings:'));
      console.log(chalk.cyan(`${repoUrl}/settings/secrets/actions\n`));
      console.log(chalk.cyan('Required secrets:'));
      console.log(chalk.cyan('- SHOPIFY_CLI_THEME_TOKEN'));
      console.log(chalk.cyan('- SHOPIFY_STORE_URL'));
      return false;
    }
  }

  if (githubSetup === 'create') {
    // Create new repository with project name
    const repoName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Ask for confirmation of repository name
    const { confirmRepoName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'confirmRepoName',
        message: `Repository will be created as "${repoName}". Press Enter to confirm or type a different name:`,
        default: repoName
      }
    ]);

    console.log(`\nCreating repository ${confirmRepoName}...`);

    try {
      // First create the repository on GitHub without pushing
      execSync(`gh repo create "${confirmRepoName}" --private`, { stdio: 'inherit' });
      console.log(chalk.green('✓ Repository created successfully'));

      // Initialize git if needed
      if (!isGitRepository()) {
        execSync('git init', { stdio: 'inherit' });
      }

      // Create main branch if it doesn't exist
      try {
        execSync('git rev-parse --verify main', { stdio: 'ignore' });
      } catch (error) {
        execSync('git checkout -b main', { stdio: 'inherit' });
      }

      // Stage all files
      execSync('git add .', { stdio: 'inherit' });

      // Create initial commit
      try {
        execSync('git commit -m "feat: Initial theme setup"', { stdio: 'inherit' });
      } catch (error) {
        if (!error.message.includes('nothing to commit')) {
          throw error;
        }
      }

      // Set up remote
      try {
        execSync('git remote remove origin', { stdio: 'pipe' });
      } catch (error) {
        // Ignore error if remote doesn't exist
      }

      const repoUrl = `https://github.com/${username}/${confirmRepoName}`;
      execSync(`git remote add origin ${repoUrl}.git`, { stdio: 'inherit' });
      console.log(chalk.green('✓ Remote added successfully'));

      // Push to remote
      execSync('git push -u origin main --force', { stdio: 'inherit' });
      console.log(chalk.green('✓ Initial code pushed successfully'));

      // Set up secrets
      await setupGitHubSecrets(`${username}/${confirmRepoName}`, repoUrl);

    } catch (error) {
      if (error.message.includes('already exists')) {
        console.error(chalk.red('Repository already exists. Please choose a different name.'));
        return;
      }

      // Fallback to manual repository setup
      console.log(chalk.yellow('\nAutomatic repository creation failed. Let\'s set it up manually.'));

      const { manualSetup } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'manualSetup',
          message: 'Would you like to connect to a manually created repository?',
          default: true
        }
      ]);

      if (manualSetup) {
        const { repoUrl } = await inquirer.prompt([
          {
            type: 'input',
            name: 'repoUrl',
            message: 'Please enter your GitHub repository URL:',
            validate: input => {
              const isValid = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(?:\.git)?$/.test(input);
              return isValid || 'Please enter a valid GitHub repository URL (https://github.com/owner/repo)';
            }
          }
        ]);

        // Clean up the URL
        const cleanRepoUrl = repoUrl.replace(/\.git$/, '');
        const repoFullName = cleanRepoUrl.replace('https://github.com/', '');

        try {
          // Set up remote
          try {
            execSync('git remote remove origin', { stdio: 'pipe' });
          } catch (error) {
            // Ignore error if remote doesn't exist
          }

          execSync(`git remote add origin ${cleanRepoUrl}.git`, { stdio: 'inherit' });
          console.log(chalk.green('✓ Remote added successfully'));

          // Set up secrets
          await setupGitHubSecrets(repoFullName, cleanRepoUrl);

          console.log(chalk.green('\nRepository connected successfully! 🎉'));
          console.log(chalk.blue('\nNext steps:'));
          console.log('1. Stage your changes:', chalk.cyan('git add .'));
          console.log('2. Create initial commit:', chalk.cyan('git commit -m "feat: Initial theme setup"'));
          console.log('3. Push to GitHub:', chalk.cyan('git push -u origin main'));
        } catch (error) {
          console.error(chalk.red('\nError connecting to repository:'), error.message);
        }
      }
    }
  } else if (githubSetup === 'connect') {
    // Handle connecting to existing repository
    const { repoUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'repoUrl',
        message: 'Please enter your GitHub repository URL:',
        validate: input => {
          const isValid = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(?:\.git)?$/.test(input);
          return isValid || 'Please enter a valid GitHub repository URL (https://github.com/owner/repo)';
        }
      }
    ]);

    // Clean up the URL
    const cleanRepoUrl = repoUrl.replace(/\.git$/, '');
    const repoFullName = cleanRepoUrl.replace('https://github.com/', '');

    try {
      // Set up remote
      try {
        execSync('git remote remove origin', { stdio: 'pipe' });
      } catch (error) {
        // Ignore error if remote doesn't exist
      }

      execSync(`git remote add origin ${cleanRepoUrl}.git`, { stdio: 'inherit' });
      console.log(chalk.green('✓ Remote added successfully'));

      // Set up secrets
      await setupGitHubSecrets(repoFullName, cleanRepoUrl);

    } catch (error) {
      console.error(chalk.red('\nError connecting to repository:'), error.message);
    }
  }
}

// Helper function to set GitHub secrets
async function setGitHubSecrets(repoPath, secrets) {
  try {
    console.log(chalk.yellow('\nSetting up GitHub secrets...'));

    for (const [key, value] of Object.entries(secrets)) {
      // Use gh secret set command with proper flags
      execSync(`gh secret set ${key} --body "${value}" --repo ${repoPath}`, { stdio: 'inherit' });
      console.log(chalk.green(`✓ Set ${key}`));
    }

    return true;
  } catch (error) {
    console.error(chalk.red('Failed to set GitHub secrets:'), error.message);
    return false;
  }
}

// Helper function to create or update .gitignore
function ensureGitignore() {
  const gitignoreContent = [
    'node_modules/',
    '.DS_Store',
    'config.yml',
    '.env',
    '.env.*',
    '*.log',
    '.shopifyignore',
    '.vscode/',
    '.idea/',
    'dist/',
    'build/',
    'coverage/',
    '.husky/_/',
    '.npmrc'
  ].join('\n');

  const gitignorePath = '.gitignore';

  try {
    if (fs.existsSync(gitignorePath)) {
      // Read existing .gitignore
      const existingContent = fs.readFileSync(gitignorePath, 'utf8');
      const existingLines = new Set(existingContent.split('\n').map(line => line.trim()));

      // Add new lines that don't exist
      const newLines = gitignoreContent.split('\n')
        .filter(line => !existingLines.has(line.trim()));

      if (newLines.length > 0) {
        // Append new lines to existing .gitignore
        fs.appendFileSync(gitignorePath, '\n' + newLines.join('\n'));
        console.log(chalk.green('Updated .gitignore with new entries'));
      }
    } else {
      // Create new .gitignore
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log(chalk.green('Created new .gitignore file'));
    }
  } catch (error) {
    console.error(chalk.yellow('Warning: Could not update .gitignore file'));
    console.error(error.message);
  }
}

// Helper function to create GitHub workflow files
function setupGitHubWorkflows() {
  const workflowDir = '.github/workflows';
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }

  const templatesDir = getTemplatesDir();
  const workflowTemplatesDir = path.join(templatesDir, 'workflows');

  // Copy each workflow file from templates
  const workflowFiles = ['release.yml', 'preview.yml', 'sync.yml'];

  for (const filename of workflowFiles) {
    try {
      const sourcePath = path.join(workflowTemplatesDir, filename);
      const targetPath = path.join(workflowDir, filename);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(chalk.green(`Created ${filename}`));
      } else {
        console.error(chalk.yellow(`Warning: Template file ${filename} not found in package templates`));
      }
    } catch (error) {
      console.error(chalk.yellow(`Warning: Could not create ${filename}`));
      console.error(error.message);
    }
  }
}

async function syncWorkflowsAndConfig(projectPath = process.cwd()) {
  console.log(chalk.blue('\nSyncing workflows and configurations...\n'));

  try {
    // Define source and target paths
    const packagePath = path.join(__dirname, '..', 'package');

    // Files to sync
    const filesToSync = [
      {
        source: '.github/workflows/theme-preview.yml',
        target: '.github/workflows/theme-preview.yml',
        type: 'workflow'
      },
      {
        source: '.github/workflows/release.yml',
        target: '.github/workflows/release.yml',
        type: 'workflow'
      },
      {
        source: 'release.config.js',
        target: 'release.config.js',
        type: 'config'
      },
      {
        source: 'commitlint.config.js',
        target: 'commitlint.config.js',
        type: 'config'
      }
    ];

    // Ensure .github/workflows directory exists
    const workflowsDir = path.join(projectPath, '.github', 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }

    // Sync each file
    for (const file of filesToSync) {
      const sourcePath = path.join(packagePath, file.source);
      const targetPath = path.join(projectPath, file.target);

      if (!fs.existsSync(sourcePath)) {
        console.log(chalk.yellow(`⚠️  Source file not found: ${file.source}`));
        continue;
      }

      // Backup existing file if it exists
      if (fs.existsSync(targetPath)) {
        const backupPath = `${targetPath}.backup`;
        fs.copyFileSync(targetPath, backupPath);
        console.log(chalk.gray(`📦 Backed up existing ${file.type}: ${file.target} → ${path.basename(backupPath)}`));
      }

      // Copy new file
      fs.copyFileSync(sourcePath, targetPath);
      console.log(chalk.green(`✓ Updated ${file.type}: ${file.target}`));
    }

    console.log(chalk.green('\n✨ Successfully synced workflows and configurations!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Review the updated files');
    console.log('2. Check for any custom configurations in the backup files');
    console.log('3. Commit the changes if everything looks good');
    console.log('\nBackup files are created with .backup extension');

  } catch (error) {
    console.error(chalk.red('\nError syncing workflows and configurations:'), error.message);
    console.log(chalk.yellow('\nTry running the command with sudo if it\'s a permissions issue.'));
  }
}

async function main() {
  console.log(chalk.blue('Welcome to Mili Release - Shopify Theme Automation\n'));

  // Add command line arguments handling
  const args = process.argv.slice(2);
  const useStored = args.includes('--use-stored');

  if (args.includes('--list-stores')) {
    await listStoredConfigs();
    return;
  }
  if (args.includes('--remove-store')) {
    const storeName = args[args.indexOf('--remove-store') + 1];
    if (!storeName) {
      console.error(chalk.red('Please provide a store name to remove'));
      return;
    }
    await removeStoredConfig(storeName);
    return;
  }

  if (argv.sync) {
    await syncWorkflowsAndConfig();
    return;
  }

  // Check if we're in an existing Shopify theme directory
  const isExistingTheme = fs.existsSync('config') && fs.existsSync('layout') && fs.existsSync('templates');
  const templatesDir = getTemplatesDir();
  const hasTemplates = fs.existsSync(templatesDir);

  // Only require templates directory if we're not in an existing theme directory
  if (!isExistingTheme && !hasTemplates) {
    console.error(chalk.red('Error: Not in a Shopify theme directory and no templates found. Please run this command in a Shopify theme directory or ensure the package is installed correctly.'));
    process.exit(1);
  }

  // Ensure .gitignore is set up properly
  ensureGitignore();

  // Set up GitHub workflow files
  setupGitHubWorkflows();

  try {
    let answers;

    // Try to use stored configuration if --use-stored flag is present
    if (useStored) {
      const storedConfig = await getStoredStoreConfig();
      if (storedConfig) {
        answers = {
          projectName: storedConfig.storeName,
          storeName: storedConfig.storeName,
          themeToken: storedConfig.themeToken
        };
        console.log(chalk.green(`Using stored configuration for ${storedConfig.storeName}`));
      } else {
        console.log(chalk.yellow('No stored configurations found. Proceeding with setup questions.'));
      }
    }

    // If no stored config or --use-stored not present, ask questions
    if (!answers) {
      answers = await inquirer.prompt([
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
        }
      ]);

      // Get theme token (either stored or new)
      answers.themeToken = await getThemeToken(answers.storeName, useStored);
    }

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
        "test": "echo \"No tests configured\"",
        "prepare": "husky install",
        "semantic-release": "semantic-release"
      },
      devDependencies: {
        '@commitlint/cli': '^18.4.0',
        '@commitlint/config-conventional': '^18.4.0',
        'husky': '^8.0.0',
        '@semantic-release/changelog': '^6.0.3',
        '@semantic-release/commit-analyzer': '^11.1.0',
        '@semantic-release/git': '^10.0.1',
        '@semantic-release/github': '^9.2.5',
        '@semantic-release/release-notes-generator': '^12.1.0',
        'semantic-release': '^23.0.0'
      }
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Create release.config.js
    console.log(chalk.green('\nCreating release.config.js...\n'));

    const releaseConfig = `module.exports = {
  branches: [
    'main',
    {name: 'staging', prerelease: true}
  ],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        {type: 'feat', release: 'minor'},
        {type: 'fix', release: 'patch'},
        {type: 'chore', release: 'patch'},
        {type: 'docs', release: 'patch'},
        {type: 'style', release: 'patch'},
        {type: 'refactor', release: 'patch'},
        {type: 'perf', release: 'patch'},
        {type: 'test', release: 'patch'}
      ]
    }],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): \${nextRelease.version} [skip ci]\\n\\n\${nextRelease.notes}'
    }],
    ['@semantic-release/exec', {
      prepareCmd: 'echo \${nextRelease.version} > version.txt',
      publishCmd: 'shopify theme push -t \${nextRelease.version}'
    }],
    ['@semantic-release/github', {
      assets: [
        {path: 'version.txt', label: 'Theme Version'},
        {path: 'CHANGELOG.md', label: 'Changelog'}
      ]
    }]
  ]
};`;

    fs.writeFileSync('release.config.js', releaseConfig);

    // Create commitlint.config.js
    console.log(chalk.green('\nCreating commitlint.config.js...\n'));

    const commitlintConfig = `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'chore',
      'revert'
    ]],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', 'sentence-case'],
    'body-max-line-length': [2, 'always', 100]
  }
};`;

    fs.writeFileSync('commitlint.config.js', commitlintConfig);

    // Create README.md
    console.log(chalk.green('\nCreating README.md...\n'));

    const readmeContent = `<p align="center">
  <img src="https://storage.googleapis.com/msgsndr/13wKtghjM0UiJUVzcCwH/media/678ec74139a4c6edc3269a76.png" alt="${answers.projectName} Logo" width="200"/>
</p>

<h1 align="center">${answers.projectName} Shopify Theme</h1>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-prerequisites">Prerequisites</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-development">Development</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-workflow">Workflow</a> •
  <a href="#-commands">Commands</a>
</p>

## 📋 Overview

This Shopify theme project is set up using \`@milistack/theme-cli\`, a powerful tool that automates theme development and deployment workflows. It includes semantic versioning, automated GitHub Actions, and streamlined theme management.

## ✨ Features

### 🚀 Development Features
- Automated theme setup and configuration
- Local development server with hot reloading
- Structured theme organization
- Git-based version control
- Automated semantic versioning

### 🔄 CI/CD Features
- GitHub Actions workflows for:
  - Theme preview on pull requests
  - Automated staging deployments
  - Production releases
  - Synchronization between environments
- Semantic release automation
- Automated changelog generation

### 🛡️ Security Features
- Secure theme deployment
- Environment-based configuration
- Protected production environment
- Secure secret management

### 🎨 Theme Management
- Multiple environment support (Development, Staging, Production)
- Automated theme creation and management
- Theme preview generation for pull requests
- Theme synchronization between environments

## 🔧 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 16.x | JavaScript runtime |
| npm | >= 8.x | Package management |
| Shopify CLI | >= 3.x | Theme development |
| GitHub CLI | Latest | Repository management |

## 📦 Installation

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment**
   - Shopify CLI authentication
   - GitHub repository setup
   - Environment secrets configuration

3. **Initialize Development**
   \`\`\`bash
   npm run theme:dev
   \`\`\`

## 💻 Development

### Directory Structure
\`\`\`
📁 Theme Root
├── 📁 assets/           # Theme assets (CSS, JS, images)
├── 📁 config/          # Theme settings and schema
├── 📁 layout/          # Theme layout templates
├── 📁 locales/         # Translation files
├── 📁 sections/        # Theme sections
├── 📁 snippets/        # Reusable template snippets
├── 📁 templates/       # Page templates
└── 📁 .github/         # GitHub Actions workflows
\`\`\`

### Available Commands

| Command | Description |
|---------|-------------|
| \`npm run theme:dev\` | Start development server |
| \`npm run theme:pull\` | Pull theme from Shopify |
| \`npm run theme:push:staging\` | Push to staging theme |
| \`npm run theme:push:production\` | Push to production theme |
| \`npm run semantic-release\` | Run semantic release |

## 🚀 Deployment

### Environments

| Environment | Purpose | Theme Name | Access |
|-------------|---------|------------|---------|
| Development | Local development | PR-based | Developers |
| Staging | Pre-production testing | [Staging] | Team review |
| Production | Live store | [Production] | Protected |

### Deployment Process

1. **Feature Development**
   - Create feature branch
   - Develop and test locally
   - Create pull request

2. **Preview & Review**
   - Automated preview theme creation
   - Team review process
   - Automated checks

3. **Staging Deployment**
   - Merge to staging branch
   - Automated staging deployment
   - QA testing

4. **Production Release**
   - Create PR to main
   - Final review
   - Automated semantic release
   - Production deployment

## 📝 Commit Convention

| Type | Description | Version Impact |
|------|-------------|----------------|
| \`feat\` | New feature | Minor version bump |
| \`fix\` | Bug fix | Patch version bump |
| \`docs\` | Documentation | No version bump |
| \`style\` | Code style | No version bump |
| \`refactor\` | Code refactoring | Patch version bump |
| \`perf\` | Performance improvement | Patch version bump |
| \`test\` | Testing | No version bump |
| \`chore\` | Maintenance | Patch version bump |

## 🌳 Git Workflow

### Branch Strategy

| Branch | Purpose | Protection | Deployment |
|--------|---------|------------|------------|
| \`main\` | Production code | 🔒 Protected | Production theme |
| \`staging\` | Pre-production | 🔒 Protected | Staging theme |
| \`feat/*\` | Feature development | 🔓 Open | Preview theme |
| \`fix/*\` | Bug fixes | 🔓 Open | Preview theme |

### Pull Request Process

1. **Create Pull Request**
   - Descriptive title
   - Detailed description
   - Link related issues

2. **Automated Checks**
   - Commit message validation
   - Theme preview creation
   - Automated tests

3. **Review Process**
   - Code review
   - Theme preview review
   - QA testing

4. **Merge Requirements**
   - Approved reviews
   - Passing checks
   - Up-to-date branch

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

1. **Theme Preview (\`preview.yml\`)**
   - Triggers: Pull requests
   - Creates preview theme
   - Posts preview URL
   - Cleanup on PR close

2. **Theme Release (\`release.yml\`)**
   - Triggers: Push to main
   - Runs semantic release
   - Updates changelog
   - Deploys to production

3. **Theme Sync (\`sync.yml\`)**
   - Triggers: Manual
   - Syncs between themes
   - Maintains environment parity

## ⚙️ Configuration

### Theme Settings
- Store URL: \`${storeUrl}\`
- Development theme: PR-based
- Staging theme: [Staging] - ${answers.projectName}
- Production theme: [Production] - ${answers.projectName}

### Environment Variables
- \`SHOPIFY_CLI_THEME_TOKEN\`: Theme access token
- \`SHOPIFY_STORE_URL\`: Shopify store URL
- \`GITHUB_TOKEN\`: GitHub authentication

## 📚 Resources

- [Shopify Theme Development](https://shopify.dev/themes)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes (following commit convention)
4. Create pull request
5. Address review feedback
6. Get approval and merge

## 📄 License

This project is private and confidential.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/pasquinphilippe">milistack shopify agency</a>
</p>`;

    fs.writeFileSync('README.md', readmeContent);

    // Set up themes
    await setupThemes(storeUrl, answers.themeToken, answers.projectName);

    // Set up GitHub with store URL
    await setupGitHub(answers.projectName, answers.themeToken, storeUrl);

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
