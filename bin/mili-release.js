#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

  if (githubSetup === 'create') {
    try {
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
        execSync(`gh repo create "${confirmRepoName}" --private --source=. --remote=origin --push`, { stdio: 'inherit' });
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.error(chalk.red('Repository already exists. Please choose a different name.'));
          return;
        }
        throw error;
      }

      // Get GitHub username using gh CLI
      const username = execSync('gh api user -q .login', { encoding: 'utf8' }).trim();

      // Set up secrets
      console.log('\nSetting up GitHub secrets...');
      await setGitHubSecrets(`${username}/${confirmRepoName}`, {
        SHOPIFY_CLI_THEME_TOKEN: shopifyToken,
        SHOPIFY_STORE_URL: storeUrl
      });

    } catch (error) {
      console.error(chalk.yellow('\nWarning: Error creating GitHub repository. You may need to create it manually.'));
      console.error(chalk.red(error.message));
      return;
    }
  }

  // Push initial commit
  try {
    execSync('git push -u origin main', { stdio: 'inherit' });
  } catch (error) {
    console.error(chalk.yellow('\nWarning: Error pushing to GitHub. You may need to push manually.'));
    console.error(chalk.red(error.message));
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

  // Check if templates directory exists
  const templatesDir = path.join(__dirname, '../templates');
  if (!fs.existsSync(templatesDir)) {
    console.error(chalk.red('Error: Templates directory not found. Please ensure the package is installed correctly.'));
    process.exit(1);
  }

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
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-development">Development</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

## ✨ Features

- 🚀 Automated semantic versioning
- 🔄 CI/CD with GitHub Actions
- 📦 Shopify theme development tools
- 🛠️ Modern development workflow
- 📝 Automated changelog generation
- 🔐 Secure theme deployment

## 🎯 Theme Structure

\`\`\`
📁 Theme Root
├── 📁 assets/           # Theme assets (CSS, JS, images)
├── 📁 config/          # Theme settings and schema
├── 📁 layout/          # Theme layout templates
├── 📁 locales/         # Translation files
├── 📁 sections/        # Theme sections
├── 📁 snippets/        # Reusable template snippets
└── 📁 templates/       # Page templates
\`\`\`

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Description |
|------|---------|-------------|
| Node.js | >= 16 | JavaScript runtime |
| Shopify CLI | Latest | Shopify development tools |
| GitHub CLI | Latest | GitHub integration |

### Quick Start 🏃‍♂️

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start Development**
   \`\`\`bash
   npm run theme:dev
   \`\`\`

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| \`npm run theme:dev\` | Start development server |
| \`npm run theme:pull\` | Pull theme from Shopify |
| \`npm run theme:push:staging\` | Push to staging theme |
| \`npm run theme:push:production\` | Push to production theme |
| \`npm run semantic-release\` | Run semantic release |

## 📦 Semantic Release

This project uses semantic-release to automate version management. Version numbers follow [Semantic Versioning](https://semver.org/).

### 📝 Commit Message Format

| Type | Description | Version Impact |
|------|-------------|----------------|
| \`feat\` | New feature | Minor bump |
| \`fix\` | Bug fix | Patch bump |
| \`docs\` | Documentation | No bump |
| \`style\` | Code style | No bump |
| \`refactor\` | Code refactoring | Patch bump |
| \`perf\` | Performance | Patch bump |
| \`test\` | Testing | No bump |
| \`chore\` | Maintenance | Patch bump |
| \`revert\` | Revert changes | Patch bump |

### 🌳 Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|------------|
| \`main\` | Production | 🔒 Protected |
| \`staging\` | Pre-production | 🔒 Protected |
| \`feat/*\` | Feature development | 🔓 Open |
| \`fix/*\` | Bug fixes | 🔓 Open |

## 🚀 Deployment Workflow

1. 🔨 Create feature branch
   \`\`\`bash
   git checkout -b feat/your-feature-name
   \`\`\`

2. 💾 Commit changes using conventional commits
   \`\`\`bash
   git commit -m "feat: Add new feature"
   \`\`\`

3. 🔄 Create PR to \`staging\`
4. 👀 Review preview theme
5. 🎯 Merge to \`staging\`
6. 🚀 Create PR from \`staging\` to \`main\`

## 🔄 CI/CD Pipeline

| Stage | Trigger | Actions |
|-------|---------|---------|
| Validate | PR, Push | 🔍 Lint commits<br>✅ Run tests |
| Preview | PR | 🎨 Create preview theme |
| Release | Merge to main | 📦 Create release<br>📝 Generate changelog<br>🚀 Deploy theme |

## ⚙️ Theme Configuration

- 🏪 Store URL: \`${storeUrl}\`
- 🔐 Environment: Production & Staging
- 🌐 Theme Access: Staff accounts

## 📚 Resources

- [Shopify Theme Development](https://shopify.dev/themes)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/actions)

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Create pull request
4. Get review & approval
5. Merge & deploy

## 📄 License

This project is private and confidential.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/pasquinphilippe">Philippe Pasquin</a>
</p>`;

    fs.writeFileSync('README.md', readmeContent);

    // Set up themes
    await setupThemes(storeUrl, answers.themeToken, answers.projectName);

    // Create GitHub Actions workflow
    console.log(chalk.green('\nSetting up GitHub Actions workflow...\n'));

    const workflowDir = '.github/workflows';
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }

    const workflowPath = path.join(workflowDir, 'theme-release.yml');
    const workflowContent = [
      'name: Theme Release',
      '',
      'on:',
      '  push:',
      '    branches: [main, staging]',
      '  pull_request:',
      '    branches: [main, staging]',
      '',
      'jobs:',
      '  validate:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '        with:',
      '          fetch-depth: 0',
      '      - uses: actions/setup-node@v4',
      '        with:',
      '          node-version: 20',
      '      - run: npm ci',
      '      - name: Validate Commits',
      '        run: npx commitlint --from ${{ github.event.pull_request.base.sha || github.event.before }} --to ${{ github.event.pull_request.head.sha || github.sha }} --verbose',
      '',
      '  release:',
      '    needs: validate',
      '    if: github.event_name == \'push\' && (github.ref == \'refs/heads/main\' || github.ref == \'refs/heads/staging\')',
      '    runs-on: ubuntu-latest',
      '    permissions:',
      '      contents: write',
      '      issues: write',
      '      pull-requests: write',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '        with:',
      '          fetch-depth: 0',
      '      - uses: actions/setup-node@v4',
      '        with:',
      '          node-version: 20',
      '      - name: Install dependencies',
      '        run: npm ci',
      '      - name: Setup Shopify CLI',
      '        run: npm install -g @shopify/cli @shopify/theme',
      '      - name: Authenticate Shopify CLI',
      '        run: echo "${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}" | shopify theme access login --password',
      '      - name: Release',
      '        env:',
      '          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}',
      '          SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}',
      '          SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}',
      '        run: npx semantic-release'
    ].join('\n');

    fs.writeFileSync(workflowPath, workflowContent);

    // Create initial commit
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "feat: Initial theme setup"', { stdio: 'inherit' });
    } catch (error) {
      console.error(chalk.yellow('\nWarning: Failed to create initial commit. You may need to commit manually.'));
      console.error(error.message);
    }

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
