# 🚀 @milistack/theme-cli

<div align="center">
  <img src="https://storage.googleapis.com/msgsndr/13wKtghjM0UiJUVzcCwH/media/678ec74139a4c6edc3269a76.png" width="200" />
  <p><strong>A powerful CLI tool for setting up Shopify themes with semantic release automation</strong></p>
</div>

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Workflow](#-workflow)
- [Commands](#-commands)
- [Contributing](#-contributing)

## ✨ Features
- 🎯 One-command theme setup with best practices
- 🔄 Automated semantic versioning
- 🚀 GitHub Actions integration
- 🛡️ Branch protection and workflow automation
- 💾 Local configuration storage
- 🏪 Multiple store support

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
```bash
# Create a new theme project
mili-theme

# Or use the alternative command
mili-release
```

## ⚙️ Configuration
The CLI will guide you through setting up:
- 📝 Project/Client name
- 🏪 Shopify store URL
- 🔑 Theme access token
- 📊 GitHub repository settings

### 🔐 Stored Configurations
```bash
# List stored configurations
mili-theme --list-stores

# Remove stored configuration
mili-theme --remove-store <store-name>

# Use stored configuration
mili-theme --use-stored
```

## 🔄 Workflow
1. **Initial Setup**
   ```bash
   mili-theme
   ```
   - Creates theme structure
   - Sets up GitHub repository
   - Configures GitHub Actions
   - Initializes semantic release

2. **Development**
   ```bash
   npm run theme:dev    # Start development server
   npm run theme:pull   # Pull theme changes
   ```

3. **Deployment**
   - Commits trigger automatic:
     - Version bumping
     - Changelog generation
     - GitHub release creation
     - Theme deployment

## 💻 Commands
| Command | Description |
|---------|-------------|
| `mili-theme` | Initialize new theme project |
| `--use-stored` | Use stored configuration |
| `--list-stores` | List stored configurations |
| `--remove-store` | Remove stored configuration |

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. Push and create a Pull Request

## 📝 Commit Types
| Type | Description | Example | Version Impact |
|------|-------------|---------|----------------|
| `feat` | New features | `feat: add new configuration option` | Minor bump |
| `fix` | Bug fixes | `fix: resolve token validation issue` | Patch bump |
| `docs` | Documentation | `docs: update installation guide` | No bump |
| `chore` | Maintenance | `chore: update dependencies` | Patch bump |
| `refactor` | Code refactoring | `refactor: improve error handling` | Patch bump |
| `test` | Testing | `test: add unit tests for config` | No bump |

> **Note**: Commit messages must use sentence-case (first letter of subject capitalized) to pass validation.

## 📄 License
MIT © [Milistack](https://github.com/milistack)

---
<div align="center">
  <sub>Built with ❤️ by the Milistack team</sub>
</div>
