#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to read template files
function readTemplateFile(filename) {
  const templatePath = path.join(__dirname, '..', 'templates', filename);
  return fs.readFileSync(templatePath, 'utf8');
}

// Helper function to create gitignore content
function createGitignoreContent() {
  return `# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Environment files
.env
.env.*

# Node modules and logs
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Editor directories and files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Theme specific
config/settings_data.json
config.yml

# Build output
dist/
build/
*.zip

# Temporary files
*.log
*.tmp
.cache/
`;
}

// Helper function to install GitHub CLI based on OS
async function installGitHubCLI() {
  const platform = os.platform();

  try {
    console.log(chalk.yellow('\nInstalling GitHub CLI...'));

    switch (platform) {
      case 'darwin': // macOS
        try {
          execSync('brew --version', { stdio: 'ignore' });
        } catch {
          console.log(chalk.yellow('Installing Homebrew first...'));
          execSync('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', { stdio: 'inherit' });
        }
        execSync('brew install gh', { stdio: 'inherit' });
        break;

      case 'linux':
        // Check for different package managers
        if (fs.existsSync('/etc/debian_version')) {
          execSync('curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg', { stdio: 'inherit' });
          execSync('echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null', { stdio: 'inherit' });
          execSync('sudo apt update && sudo apt install gh -y', { stdio: 'inherit' });
        } else if (fs.existsSync('/etc/fedora-release')) {
          execSync('sudo dnf install gh -y', { stdio: 'inherit' });
        }
        break;

      case 'win32':
        execSync('winget install --id GitHub.cli', { stdio: 'inherit' });
        break;

      default:
        throw new Error('Unsupported operating system');
    }

    console.log(chalk.green('✓ GitHub CLI installed successfully'));
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to install GitHub CLI:'), error.message);
    return false;
  }
}

// Helper function to check if gh CLI is installed
function isGHCliInstalled() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to check if user is authenticated with gh CLI
function isGHCliAuthenticated() {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to authenticate with GitHub CLI
async function authenticateGitHubCLI() {
  try {
    console.log(chalk.yellow('\nAuthenticating with GitHub...'));
    console.log(chalk.blue('A browser window will open to complete authentication.'));

    execSync('gh auth login -w -p https -s admin:repo', { stdio: 'inherit' });

    console.log(chalk.green('✓ Successfully authenticated with GitHub'));
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to authenticate with GitHub:'), error.message);
    return false;
  }
}

// Helper function to create GitHub repository
async function createGitHubRepo(repoName) {
  try {
    console.log(chalk.yellow('\nCreating GitHub repository...'));
    execSync(`gh repo create ${repoName} --private --confirm`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to create repository:'), error.message);
    return false;
  }
}

// Helper function to set GitHub secrets
async function setGitHubSecrets(repoName, secrets) {
  try {
    console.log(chalk.yellow('\nSetting up GitHub secrets...'));

    // Get the username from GitHub CLI
    const username = execSync('gh api user -q .login', { encoding: 'utf8' }).trim();
    const repoPath = `${username}/${repoName}`;

    for (const [key, value] of Object.entries(secrets)) {
      execSync(`gh secret set ${key} -b"${value}" --repo ${repoPath}`, { stdio: 'inherit' });
      console.log(chalk.green(`✓ Set ${key}`));
    }

    return true;
  } catch (error) {
    console.error(chalk.red('Failed to set GitHub secrets:'), error.message);
    return false;
  }
}

// Helper function to check if repository exists
async function checkRepoExists(repoName) {
  try {
    execSync(`gh repo view ${repoName}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to check if branch exists
function branchExists(branchName) {
  try {
    execSync(`git show-ref --verify --quiet refs/heads/${branchName}`);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to check if branch is protected
async function isProtectedBranch(repoPath, branchName) {
  try {
    const result = execSync(`gh api repos/${repoPath}/branches/${branchName}/protection`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get remote branch information
async function getRemoteBranchInfo(repoPath, branchName) {
  try {
    const result = execSync(`gh api repos/${repoPath}/branches/${branchName}`, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    return null;
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
  const workflowFiles = ['release.yml', 'preview.yml'];

  for (const filename of workflowFiles) {
    try {
      const sourcePath = path.join(workflowTemplatesDir, filename);
      const targetPath = path.join(workflowDir, filename);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(chalk.green(`Created ${filename}`));
      } else {
        console.error(chalk.yellow(`Warning: Template file ${filename} not found in package templates/workflows`));
      }
    } catch (error) {
      console.error(chalk.yellow(`Warning: Could not create ${filename}`));
      console.error(error.message);
    }
  }
}

async function init() {
  console.log(chalk.blue('🚀 Welcome to Mili Release - Shopify Theme Automation'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientName',
      message: 'What is your client/project name?',
      validate: input => input.length > 0
    },
    {
      type: 'input',
      name: 'storeUrl',
      message: 'What is your Shopify store URL? (e.g., my-store.myshopify.com)',
      validate: input => input.includes('.myshopify.com')
    },
    {
      type: 'password',
      name: 'themeToken',
      message: 'Enter your Shopify CLI theme token:',
      validate: input => input.length > 0
    },
    {
      type: 'confirm',
      name: 'setupGithub',
      message: 'Would you like to set up GitHub integration?',
      default: true
    }
  ]);

  // Create necessary directories
  const dirs = ['.github/workflows', '.husky'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Read and process template files
  const packageJson = JSON.parse(readTemplateFile('package.json'));
  packageJson.name = answers.clientName.toLowerCase().replace(/\s+/g, '-');

  // Write files
  const files = {
    'package.json': JSON.stringify(packageJson, null, 2),
    'release.config.js': readTemplateFile('release.config.js'),
    'commitlint.config.js': readTemplateFile('commitlint.config.js'),
    '.gitignore': createGitignoreContent()
  };

  // Ensure .github/workflows directory exists
  const workflowsDir = '.github/workflows';
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }

  // Copy GitHub Actions workflows
  setupGitHubWorkflows();

  // Generate README with client details
  const readmeContent = readTemplateFile('README.md')
    .replace(/\${clientName}/g, answers.clientName)
    .replace(/\${storeUrl}/g, answers.storeUrl)
    .replace(/\${repoName}/g, packageJson.name)
    .replace(/\${repoUrl}/g, 'https://github.com/USERNAME/REPO.git'); // Will be updated after repo creation

  files['README.md'] = readmeContent;

  // Create theme directory structure
  const themeDirs = [
    'assets',
    'config',
    'layout',
    'locales',
    'sections',
    'snippets',
    'templates'
  ];

  themeDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      // Create a .gitkeep file to ensure empty directories are tracked
      fs.writeFileSync(path.join(dir, '.gitkeep'), '');
    }
  });

  Object.entries(files).forEach(([file, content]) => {
    fs.writeFileSync(file, content);
  });

  // Create .env file for local development
  const envContent = `SHOPIFY_FLAG_STORE=${answers.storeUrl}
SHOPIFY_CLI_THEME_TOKEN=${answers.themeToken}`;
  fs.writeFileSync('.env', envContent);

  // Initialize git and install dependencies
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('npm install', { stdio: 'inherit' });
    execSync('npx husky install', { stdio: 'inherit' });
    execSync('npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"', { stdio: 'inherit' });

    if (answers.setupGithub) {
      let hasGH = isGHCliInstalled();
      if (!hasGH) {
        const shouldInstall = await inquirer.prompt([{
          type: 'confirm',
          name: 'install',
          message: 'GitHub CLI is not installed. Would you like to install it?',
          default: true
        }]);

        if (shouldInstall.install) {
          hasGH = await installGitHubCLI();
        }
      }

      let isAuthenticated = hasGH && isGHCliAuthenticated();
      if (hasGH && !isAuthenticated) {
        const shouldAuth = await inquirer.prompt([{
          type: 'confirm',
          name: 'auth',
          message: 'Would you like to authenticate with GitHub now?',
          default: true
        }]);

        if (shouldAuth.auth) {
          isAuthenticated = await authenticateGitHubCLI();
        }
      }

      if (hasGH && isAuthenticated) {
        // Get GitHub username
        const username = execSync('gh api user -q .login', { encoding: 'utf8' }).trim();

        // Ask about repository setup
        const repoSetup = await inquirer.prompt([
          {
            type: 'list',
            name: 'repoAction',
            message: 'How would you like to set up the GitHub repository?',
            choices: [
              { name: 'Create a new repository', value: 'create' },
              { name: 'Connect to an existing repository', value: 'connect' }
            ]
          },
          {
            type: 'input',
            name: 'existingRepo',
            message: 'Enter the existing repository name (e.g., username/repo):',
            when: (answers) => answers.repoAction === 'connect',
            validate: async (input) => {
              if (!input.includes('/')) {
                return 'Please enter the repository name in the format username/repo';
              }
              const exists = await checkRepoExists(input);
              return exists ? true : 'Repository not found. Please check the name and try again.';
            }
          }
        ]);

        let repoName = '';
        let repoPath = '';

        if (repoSetup.repoAction === 'create') {
          repoName = packageJson.name;
          repoPath = `${username}/${repoName}`;
          const repoCreated = await createGitHubRepo(repoName);
          if (!repoCreated) {
            throw new Error('Failed to create repository');
          }
        } else {
          repoPath = repoSetup.existingRepo;
          repoName = repoPath.split('/')[1];
        }

        // Add remote origin
        const repoUrl = `https://github.com/${repoPath}.git`;
        execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });

        // Update README with correct repository URL
        const readmeContent = fs.readFileSync('README.md', 'utf8')
          .replace('https://github.com/USERNAME/REPO.git', repoUrl);
        fs.writeFileSync('README.md', readmeContent);

        // Make initial commit and push
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "feat: Initial theme setup"', { stdio: 'inherit' });

        if (repoSetup.repoAction === 'connect') {
          // For existing repos, ask which branch to use
          const branchSetup = await inquirer.prompt([
            {
              type: 'list',
              name: 'branchAction',
              message: 'How would you like to handle the branch setup?',
              choices: [
                { name: 'Create and push to a new branch', value: 'new' },
                { name: 'Push to an existing branch (Warning: Use with caution)', value: 'existing' }
              ]
            },
            {
              type: 'input',
              name: 'branchName',
              message: 'Enter the branch name:',
              when: (answers) => answers.branchAction === 'new',
              default: 'development'
            },
            {
              type: 'input',
              name: 'existingBranch',
              message: 'Enter the existing branch name:',
              when: (answers) => answers.branchAction === 'existing',
              default: 'development'
            }
          ]);

          if (branchSetup.branchAction === 'new') {
            const branchName = branchSetup.branchName;
            if (branchExists(branchName)) {
              console.log(chalk.yellow(`\nBranch '${branchName}' already exists locally. Using existing branch.`));
              execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
            } else {
              execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
            }
            execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
          } else {
            const branchName = branchSetup.existingBranch;
            const isProtected = await isProtectedBranch(repoPath, branchName);
            const branchInfo = await getRemoteBranchInfo(repoPath, branchName);

            if (isProtected) {
              console.log(chalk.red(`\n⚠️  WARNING: Branch '${branchName}' is protected!`));
              console.log(chalk.red('This branch may be connected to your production theme.'));
            }

            if (branchInfo) {
              console.log(chalk.yellow(`\n⚠️  Branch '${branchName}' already contains:`));
              console.log(chalk.yellow(`- Last commit: ${branchInfo.commit.commit.message}`));
              console.log(chalk.yellow(`- Author: ${branchInfo.commit.commit.author.name}`));
              console.log(chalk.yellow(`- Date: ${branchInfo.commit.commit.author.date}`));
            }

            const confirmPush = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'proceed',
                message: chalk.red(`Are you absolutely sure you want to push to '${branchName}'? This action cannot be undone and may affect production!`),
                default: false
              }
            ]);

            if (!confirmPush.proceed) {
              console.log(chalk.blue('\nOperation cancelled. Consider creating a new branch instead.'));
              const createNewBranch = await inquirer.prompt([
                {
                  type: 'confirm',
                  name: 'create',
                  message: 'Would you like to create a new branch instead?',
                  default: true
                },
                {
                  type: 'input',
                  name: 'newBranchName',
                  message: 'Enter the new branch name:',
                  when: (answers) => answers.create,
                  default: 'development'
                }
              ]);

              if (createNewBranch.create) {
                const newBranchName = createNewBranch.newBranchName;
                execSync(`git checkout -b ${newBranchName}`, { stdio: 'inherit' });
                execSync(`git push -u origin ${newBranchName}`, { stdio: 'inherit' });
              } else {
                throw new Error('Setup cancelled by user');
              }
            } else {
              console.log(chalk.yellow('\n⚠️  Proceeding with push to existing branch...'));
              // First checkout the branch locally
              try {
                execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
              } catch (error) {
                // If branch already exists locally, just switch to it
                execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
              }

              // Then try to push, if it fails due to diverged histories, suggest pulling first
              try {
                execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
              } catch (error) {
                console.log(chalk.yellow('\nRemote branch has different history. Attempting to sync...'));
                try {
                  // Fetch the remote branch first
                  execSync(`git fetch origin ${branchName}`, { stdio: 'inherit' });

                  // Try to rebase on top of remote changes
                  try {
                    execSync(`git rebase origin/${branchName}`, { stdio: 'inherit' });
                  } catch (rebaseError) {
                    // If rebase fails, abort it and try merge instead
                    execSync('git rebase --abort', { stdio: 'inherit' });
                    console.log(chalk.yellow('\nRebase failed, trying merge instead...'));
                    execSync(`git merge origin/${branchName}`, { stdio: 'inherit' });
                  }

                  // Push the changes
                  execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
                } catch (syncError) {
                  console.error(chalk.red('\nFailed to sync with remote branch.'));
                  console.error(chalk.yellow('\nTo resolve this manually:'));
                  console.error(chalk.yellow(`1. Run: git fetch origin ${branchName}`));
                  console.error(chalk.yellow(`2. Run: git checkout ${branchName}`));
                  console.error(chalk.yellow(`3. Run: git merge origin/${branchName}`));
                  console.error(chalk.yellow('4. Resolve any conflicts'));
                  console.error(chalk.yellow('5. Run: git push origin ${branchName}'));
                  throw new Error('Failed to sync with remote branch');
                }
              }
            }
          }
        } else {
          // For new repositories, default to development branch
          execSync('git checkout -b development', { stdio: 'inherit' });
          execSync('git push -u origin development', { stdio: 'inherit' });
        }

        // Set up secrets
        const secrets = {
          'SHOPIFY_STORE_URL': answers.storeUrl,
          'SHOPIFY_CLI_THEME_TOKEN': answers.themeToken
        };

        const secretsSet = await setGitHubSecrets(repoName, secrets);
        if (secretsSet) {
          console.log(chalk.green('\n✨ GitHub repository and secrets set up successfully!'));
        }
      } else {
        console.log(chalk.yellow('\nPlease manually add these secrets to your GitHub repository:'));
        console.log(chalk.yellow(`- SHOPIFY_FLAG_STORE: ${answers.storeUrl}`));
        console.log(chalk.yellow('- SHOPIFY_CLI_THEME_TOKEN: [your-theme-token]'));
      }
    }

    console.log(chalk.green('\n✨ Setup completed successfully!'));
    if (!answers.setupGithub) {
      console.log(chalk.blue(`
Next steps:
1. Create a new GitHub repository
2. Push your code:
   git remote add origin https://github.com/USERNAME/REPO.git
   git add .
   git commit -m "feat: Initial theme setup"
   git push -u origin main
3. Make your first changes using conventional commits
      `));
    }
  } catch (error) {
    console.error(chalk.red('Error during setup:', error));
  }
}

async function syncWorkflowsAndConfig(projectPath = process.cwd()) {
  console.log(chalk.blue('\nSyncing workflows and configurations...\n'));

  try {
    const githubDir = path.join(projectPath, '.github');

    if (fs.existsSync(githubDir)) {
      const { shouldDelete } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldDelete',
          message: 'Existing .github directory found. Would you like to delete it before syncing? (Recommended to avoid duplicates)',
          default: true
        }
      ]);

      if (shouldDelete) {
        console.log(chalk.yellow('\nDeleting existing .github directory...'));
        fs.rmSync(githubDir, { recursive: true, force: true });
        console.log(chalk.green('✓ Deleted existing .github directory'));
      } else {
        console.log(chalk.yellow('\nKeeping existing .github directory. Note: This might result in duplicate or conflicting workflows.'));
      }
    }

    // Define source and target paths
    const templatesDir = getTemplatesDir();
    const workflowTemplatesDir = path.join(templatesDir, 'workflows');

    // Files to sync
    const filesToSync = [
      {
        source: path.join(workflowTemplatesDir, 'preview.yml'),
        target: '.github/workflows/theme-preview.yml',
        type: 'workflow'
      },
      {
        source: path.join(workflowTemplatesDir, 'release.yml'),
        target: '.github/workflows/release.yml',
        type: 'workflow'
      },
      {
        source: path.join(templatesDir, 'release.config.js'),
        target: 'release.config.js',
        type: 'config'
      },
      {
        source: path.join(templatesDir, 'commitlint.config.js'),
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
      if (!fs.existsSync(file.source)) {
        console.log(chalk.yellow(`⚠️  Source file not found: ${file.source}`));
        continue;
      }

      const targetDir = path.dirname(file.target);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Backup existing file if it exists
      if (fs.existsSync(file.target)) {
        const backupPath = `${file.target}.backup`;
        fs.copyFileSync(file.target, backupPath);
        console.log(chalk.gray(`📦 Backed up existing ${file.type}: ${file.target} → ${path.basename(backupPath)}`));
      }

      // Copy new file
      fs.copyFileSync(file.source, file.target);
      console.log(chalk.green(`✓ Updated ${file.type}: ${file.target}`));
    }

    console.log(chalk.green('\n✓ Successfully synced workflows and configurations!\n'));

    // Provide git instructions if changes were made
    console.log(chalk.blue('To apply these changes:'));
    console.log(chalk.yellow('1. Review the changes:'));
    console.log('   git status');
    console.log(chalk.yellow('2. Add and commit the changes:'));
    console.log('   git add .github/ release.config.js commitlint.config.js');
    console.log('   git commit -m "chore: Update workflows and configurations"');
    console.log(chalk.yellow('3. Push to your repository:'));
    console.log('   git push\n');
  } catch (error) {
    console.error(chalk.red('\n❌ Error syncing workflows and configurations:'));
    console.error(error.message);
    process.exit(1);
  }
}

init().catch(console.error);
