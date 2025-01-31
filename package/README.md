# Mili Release

A CLI tool for setting up Shopify theme development with semantic versioning and automated deployments.

## Features

- 🚀 Quick theme setup with best practices
- 🔄 Automated semantic versioning
- 📦 GitHub Actions integration
- 🔒 Secure secrets management
- 📝 Comprehensive documentation generation
- 🔄 Workflow synchronization system

## Installation

### Organization Members

Since this is a private package, you'll need to:

1. Create a GitHub Personal Access Token (PAT):
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens
   - Generate a new token with `read:packages` scope
   - Copy your token

2. Configure npm to use GitHub Packages:
   ```bash
   # Create or edit ~/.npmrc
   echo "@mili-release:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_PAT_TOKEN" >> ~/.npmrc
   ```

3. Install the package:
   ```bash
   # Install globally
   npm install -g @mili-release/cli

   # Or use with npx
   npx @mili-release/cli
   ```

## Usage

### Initial Setup

1. Create a new theme directory:
```bash
mkdir my-theme
cd my-theme
```

2. Run the CLI:
```bash
mili-theme
```

3. Follow the prompts to:
   - Enter client/project name
   - Configure Shopify store URL
   - Set up theme token
   - Choose GitHub repository options

### Keeping Workflows Updated

After updating the package, you can sync your workflows and configurations without redoing the entire setup:

```bash
# Using npm script
npm run sync-workflows

# Or using CLI directly
mili-theme --sync
```

This will:
- Update GitHub Actions workflows
- Sync release configurations
- Backup existing files (.backup extension)
- Maintain your custom configurations

#### Files that get synced:
- `.github/workflows/theme-preview.yml`
- `.github/workflows/release.yml`
- `release.config.js`
- `commitlint.config.js`

## What It Sets Up

- Complete Shopify theme structure
- Semantic versioning configuration
- GitHub Actions workflows:
  - Theme preview on PRs
  - Automated releases
  - Production deployments
- Comprehensive documentation
- Git hooks for commit message validation
- Environment configuration

## Maintenance

### Workflow Updates
When new versions of the package are released with workflow improvements:
1. Update the package: `npm update @mili-release/cli`
2. Sync workflows: `npm run sync-workflows`
3. Review changes in the updated files
4. Check backup files for any custom configurations to preserve
5. Commit the changes

## Requirements

- Node.js >= 16
- Git
- GitHub CLI (optional, will be installed if needed)

## License

MIT
