# @milistack/theme-cli

A powerful CLI tool for automating Shopify theme development with semantic versioning, preview deployments, and GitHub integration.

## Features

- 🚀 Automated semantic versioning
- 🔄 Preview themes for pull requests
- 📦 GitHub Actions integration
- 🛠️ Modern development workflow
- 📝 Automated changelog generation
- 🔐 Secure theme deployment

## Installation

```bash
npm install -g @milistack/theme-cli
```

## Usage

### Initialize a New Theme Project

```bash
mili-theme
```

This will:
1. Set up your theme project structure
2. Configure GitHub workflows
3. Set up semantic versioning
4. Configure Shopify CLI integration

### Available Commands

```bash
# Show help
mili-theme --help

# Update workflows and configurations
mili-theme --sync

# Connect or reconnect to GitHub
mili-theme --connect-github

# List stored configurations
mili-theme --list-stores

# Use a stored configuration
mili-theme --use-stored

# Remove a stored configuration
mili-theme --remove-store <store-name>
```

## Local Development

Want to contribute? Here's how to set up the CLI for local development:

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Git

### Setup Local Development Environment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pasquinphilippe/mili-release.git
   cd mili-release/package
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Link Package Locally**
   ```bash
   # Create a global symlink
   npm run link

   # This will create a test directory and link the package
   # You can now use the CLI from your test directory
   ```

4. **Development Scripts**
   ```bash
   # Watch mode with auto-reload
   npm run dev

   # Test in a clean environment
   npm run dev:test

   # Remove local links
   npm run unlink
   ```

### Testing Your Changes

1. **Create a Test Project**
   ```bash
   mkdir ~/test-theme
   cd ~/test-theme
   npm link @milistack/theme-cli
   ```

2. **Run the CLI**
   ```bash
   mili-theme
   ```

3. **Test Specific Features**
   ```bash
   # Test workflow sync
   mili-theme --sync

   # Test GitHub integration
   mili-theme --connect-github
   ```

### Commit Guidelines

We use conventional commits to automate versioning. Your commit messages should follow this format:

```bash
# Features
feat: add new command for X

# Bug fixes
fix: resolve issue with Y

# Documentation
docs: update installation instructions

# Chores (no release)
chore: update dependencies
```

### Pull Request Process

1. Create a feature branch
   ```bash
   git checkout -b feat/your-feature
   # or
   git checkout -b fix/your-fix
   ```

2. Make your changes and commit using conventional commits

3. Push and create a PR against the staging branch
   ```bash
   git push origin feat/your-feature
   ```

4. Your PR will automatically:
   - Create a preview theme
   - Run tests
   - Validate commits

### Release Process

Releases are automated through GitHub Actions:

- Merges to `staging` create pre-releases
- Merges to `main` create production releases

The version number is automatically determined based on your commits.

## Troubleshooting

### Common Issues

1. **Node Version Errors**
   ```bash
   nvm use 20
   # or
   nvm install 20
   ```

2. **Permission Issues**
   ```bash
   # If you get EACCES errors
   sudo npm install -g @milistack/theme-cli
   ```

3. **Workflow Sync Issues**
   ```bash
   # Remove existing workflows and try again
   rm -rf .github/workflows
   mili-theme --sync
   ```

## License

MIT © [Milistack Group inc](https://github.com/pasquinphilippe/mili-release/blob/main/LICENSE)

## Support

Need help? [Open an issue](https://github.com/pasquinphilippe/mili-release/issues/new) or contact the maintainers.
