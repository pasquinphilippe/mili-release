# 🚀 @milistack/theme-cli

<div align="center">
  <img src="https://storage.googleapis.com/msgsndr/13wKtghjM0UiJUVzcCwH/media/678ec74139a4c6edc3269a76.png" width="200" />
  <p><strong>A powerful CLI tool for setting up Shopify themes with semantic release automation</strong></p>
</div>

## 📋 Table of Contents
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [License](#-license)

## 🏗️ Project Structure

This repository contains two main components:

### 1. CLI Tool (`/bin`)
- Main command-line interface for theme setup
- Handles GitHub repository creation and configuration
- Sets up automated workflows and development environment
- **Contribute here for**:
  - Improving setup process
  - Adding new CLI commands
  - Enhancing GitHub integration
  - Fixing CLI-related bugs

### 2. Theme Package (`/package`)
- NPM package containing the base theme template
- Located in `/package` directory
- Published to NPM as `@milistack/theme-cli`
- **Contribute here for**:
  - Theme structure improvements
  - Adding new theme features
  - Updating theme components
  - Modifying theme workflows

## ✨ Features

### CLI Features (`/bin`)
- 🎯 One-command theme setup
- 🔄 GitHub repository automation
- 🛡️ Branch protection setup
- 💾 Local configuration management
- 🏪 Multiple store support
- 🔄 Workflow synchronization system

### Theme Features (`/package`)
- 📦 Modular theme structure
- 🚀 GitHub Actions workflows
- 🔄 Semantic versioning
- 🧪 Testing framework
- 📱 Responsive design system

### Theme Features (`/package`)
- 📦 Modular theme structure
- 🚀 GitHub Actions workflows
- 🔄 Semantic versioning
- 🧪 Testing framework
- 📱 Responsive design system

## 🛠️ Prerequisites
| Requirement | Version | Description |
|------------|---------|-------------|
| Node.js | ≥ 16.x | JavaScript runtime |
| npm/yarn | Latest | Package manager |
| GitHub CLI | Latest | GitHub integration |
| Shopify CLI | Latest | Theme development |

## 📦 Installation
```bash
# Using npm
npm install -g @milistack/theme-cli

# Using yarn
yarn global add @milistack/theme-cli
```

## 🚀 Usage

### Initial Setup
```bash
# Create a new theme project
mili-theme

# Or use the alternative command
mili-release
```

### Workflow Management

#### Sync Latest Workflows
After updating the package, you can sync your workflows and configurations:
```bash
# Using npm script
npm run sync-workflows

# Or using CLI directly
mili-release --sync
```

This will:
- Update GitHub Actions workflows
- Sync release configurations
- Create backups of existing files
- Preserve your custom configurations

#### Files Synced:
- `.github/workflows/theme-preview.yml`
- `.github/workflows/release.yml`
- `release.config.js`
- `commitlint.config.js`

### Store Management
```bash
# List stored configurations
mili-release --list-stores

# Use stored configuration
mili-release --use-stored

# Remove stored configuration
mili-release --remove-store <store-name>
```

## 📚 Documentation

### CLI Documentation
- [CLI Configuration](docs/CLI_CONFIGURATION.md)
- [CLI Commands](docs/CLI_COMMANDS.md)
- [CLI Development](docs/CLI_DEVELOPMENT.md)

### Theme Documentation
- [Theme Structure](docs/THEME_STRUCTURE.md)
- [Theme Components](docs/THEME_COMPONENTS.md)
- [Theme Development](docs/THEME_DEVELOPMENT.md)

### General Documentation
- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## 🤝 Contributing

We welcome contributions to both components of the project! Here's how to get started:

### Contributing to CLI (`/bin`)
1. Fork the repository
2. Create your feature branch from `main`
3. Make changes to files in `/bin`
4. Test CLI functionality
5. Submit PR with CLI improvements

=======
## 🤝 Contributing

We welcome contributions to both components of the project! Here's how to get started:

### Contributing to CLI (`/bin`)
1. Fork the repository
2. Create your feature branch from `main`
3. Make changes to files in `/bin`
4. Test CLI functionality
5. Submit PR with CLI improvements


### Contributing to Theme (`/package`)
1. Fork the repository
2. Create your feature branch from `main`
3. Make changes to files in `/package`
4. Test theme functionality
5. Submit PR with theme improvements

See our detailed [Contributing Guide](CONTRIBUTING.md) for:
- Development workflow
- Commit guidelines
- Testing requirements
- Code style


## 📄 License
MIT © [Milistack](https://github.com/milistack)

---
<div align="center">
  <sub>Built with ❤️ by the Milistack team</sub>
</div>
