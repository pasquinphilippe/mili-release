# @milistack/theme-cli

A powerful CLI tool for automating Shopify theme development with semantic versioning, preview deployments, and GitHub integration.

## Features

- 🚀 Automated semantic versioning with semantic-release
- 🔄 Preview themes for pull requests
- 📦 GitHub Actions integration
- 🛠️ Modern development workflow with Husky hooks
- 📝 Automated changelog generation
- 🔐 Secure theme deployment
- ✨ Conventional commit enforcement
- 🧪 Pre-commit test automation

## Installation

```bash
npm install -g @milistack/theme-cli
```

## Usage

### Initialize a New Theme Project

You can use any of these commands to start:
```bash
mili-theme
# or
mili-release
# or
mili
```

This will:
1. Set up your theme project structure
2. Configure GitHub workflows
3. Set up semantic versioning
4. Configure Shopify CLI integration
5. Set up Git hooks with Husky
6. Configure conventional commits

### Command Aliases

The CLI can be invoked using any of these commands:
```bash
mili-theme   # Primary command
mili-release # Alternative command
mili         # Short command
```

### Interactive Setup

The CLI will guide you through:
1. Project/client name setup
2. Shopify store configuration
3. GitHub repository setup
4. Theme token configuration
5. Workflow configuration

The setup process will:
- Create necessary project directories
- Set up GitHub Actions workflows
- Configure semantic-release
- Set up commit message validation
- Install and configure Husky hooks
- Create theme structure
- Set up environment variables

### Available Commands

The CLI provides several commands for managing your theme project:

```bash
# Initialize a new theme project (interactive)
mili-theme

# Show help and available commands
mili-theme help
# or
mili-theme -h

# Show version
mili-theme -v

# Sync workflows and configurations
mili-theme sync

# GitHub Integration
mili-theme connect-github  # Connect or reconnect to GitHub

# Store Configuration Management
mili-theme list-stores    # List all stored configurations
mili-theme use-stored     # Use a stored configuration
mili-theme remove-store <store-name>  # Remove a stored configuration
```

Each command will guide you through the necessary steps with interactive prompts where needed.

### Development Commands

When working on the CLI itself:

```bash
# Watch mode with auto-reload
npm run dev

# Run tests
npm test

# Create a release
CI=true GITHUB_TOKEN=your-token npm run semantic-release
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
   cd mili-release
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Git Hooks**
   The project uses Husky for Git hooks:
   - Pre-commit hook runs tests automatically
   - Commit-msg hook ensures conventional commit format

   Hooks are installed automatically during `npm install` via the prepare script.

4. **Development Scripts**
   ```bash
   # Watch mode with auto-reload
   npm run dev

   # Run tests
   npm test

   # Create a release (CI environment)
   npm run semantic-release
   ```

### Commit Convention

We use conventional commits with specific rules:

```bash
# Features (triggers minor version bump)
feat: add new command for X

# Bug fixes (triggers patch version bump)
fix: resolve issue with Y

# Breaking changes (triggers major version bump)
feat!: redesign CLI interface
fix!: drop support for Node 16

# Documentation (no version bump)
docs: update installation instructions

# Chores (no version bump)
chore: update dependencies

# Other types
test: add unit tests
refactor: improve code structure
style: format code
perf: improve performance
```

Commit messages are automatically validated with the following rules:
- Type must be one of the above
- Subject line must be in lowercase
- Body lines must not exceed 200 characters
- Breaking changes must be noted with `!` or `BREAKING CHANGE:`

### Release Process

Releases are fully automated using semantic-release:

1. **Staging Releases**
   - Merges to `staging` create pre-releases
   - Version is determined by commit messages
   - Preview themes are created automatically

2. **Production Releases**
   - Merges to `main` trigger production releases
   - Changelog is generated automatically
   - GitHub release is created
   - npm package is published
   - Version is bumped according to semantic versioning

To create a release locally (for testing):
```bash
# Ensure you're on main branch
git checkout main

# Run semantic-release
CI=true GITHUB_TOKEN=your-token npm run semantic-release
```

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

4. **Commit Validation Errors**
   ```bash
   # If your commit message is rejected
   git commit --no-verify -m "your message"  # Bypass hooks (not recommended)
   # or
   HUSKY=0 git commit -m "your message"     # Bypass Husky
   ```

5. **Release Process Issues**
   ```bash
   # If semantic-release fails
   HUSKY=0 CI=true GITHUB_TOKEN=your-token npm run semantic-release
   ```

## License

MIT © [Milistack Group inc](https://github.com/pasquinphilippe/mili-release/blob/main/LICENSE)

## Support

Need help? [Open an issue](https://github.com/pasquinphilippe/mili-release/issues/new) or contact the maintainers.
