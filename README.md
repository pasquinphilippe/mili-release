# 🚀 @milistack/theme-cli

<div align="center">
  <img src="https://storage.googleapis.com/msgsndr/13wKtghjM0UiJUVzcCwH/media/678ec74139a4c6edc3269a76.png" width="200" />
  <p><strong>A powerful CLI tool for setting up Shopify themes with semantic release automation</strong></p>
</div>

## 🎯 Quick Start

```bash
# Install globally
npm install -g @milistack/theme-cli

# Create a new theme
mkdir my-theme && cd my-theme
mili-theme
```

## 📋 What's Included

### 1. CLI Tool (`/bin`)
- One-command theme setup
- GitHub repository automation
- Branch protection setup
- Multiple store support
- Workflow synchronization

### 2. Theme Package (`/package`)
- Modern Shopify theme structure
- GitHub Actions workflows
- Semantic versioning
- Testing framework
- Responsive design system

## 🏗 Project Structure

```
.
├── bin/                    # CLI implementation
│   └── mili-release.js     # Main CLI entry point
├── package/                # Theme package
│   ├── templates/          # Project templates
│   ├── workflows/          # GitHub Actions
│   └── config/            # Default configs
├── docs/                  # Documentation
└── tests/                # Test suites
```

## 🔄 Development Conventions

### Branch Strategy
```
main (production)
  └── staging (development)
       ├── feature/xyz
       ├── fix/xyz
       └── docs/xyz
```

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature (minor)
- `fix`: Bug fix (patch)
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code changes
- `test`: Testing
- `chore`: Maintenance

**Examples:**
```bash
feat(cli): Add new store management command
fix(workflows): Correct staging deployment path
docs(readme): Update installation instructions
```

## 🛠️ Requirements

| Tool | Version | Purpose |
|------|---------|----------|
| Node.js | ≥ 16.x | Runtime |
| npm/yarn | Latest | Package manager |
| GitHub CLI | Latest | Repository setup |
| Shopify CLI | Latest | Theme development |

## 📦 Available Commands

```bash
# Show help
mili-theme --help

# Sync workflows
mili-theme --sync

# Connect GitHub
mili-theme --connect-github

# Manage stores
mili-theme --list-stores     # List stores
mili-theme --use-stored      # Use stored config
mili-theme --remove-store    # Remove store
```

## 🔄 Workflow Management

### Sync Latest Updates
```bash
npm run sync-workflows
# or
mili-theme --sync
```

This updates:
- GitHub Actions workflows
- Release configurations
- Commit validation
- (Creates backups automatically)

### GitHub Setup
```bash
mili-theme --connect-github
```

Sets up:
- Repository creation/connection
- Branch protection (main/staging)
- GitHub secrets
- Remote configuration

## 🔒 Best Practices

### Security
- Store sensitive data in GitHub Secrets
- Use environment variables for configuration
- Never commit API keys or tokens
- Use `.gitignore` for sensitive files

### Code Quality
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Document public APIs

### Workflow
- Create feature branches from `staging`
- Keep PRs focused and small
- Update documentation with changes
- Add labels to PRs and issues

## 📚 Documentation

- [CLI Guide](https://github.com/pasquinphilippe/mili-release/blob/main/docs/CLI_COMMANDS.md)
- [Theme Structure](https://github.com/pasquinphilippe/mili-release/blob/main/docs/THEME_STRUCTURE.md)
- [Contributing](https://github.com/pasquinphilippe/mili-release/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/pasquinphilippe/mili-release/blob/main/CHANGELOG.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

See [Contributing Guide](https://github.com/pasquinphilippe/mili-release/blob/main/CONTRIBUTING.md) for details.

## 📝 License
MIT © [Milistack](https://github.com/pasquinphilippe/mili-release)

---
<div align="center">
  <sub>Built with ❤️ by the Milistack team</sub>
</div>
