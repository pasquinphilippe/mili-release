<p align="center">
  <img src="https://storage.googleapis.com/msgsndr/13wKtghjM0UiJUVzcCwH/media/678ec74139a4c6edc3269a76.png" alt="douda Logo" width="200"/>
</p>

<h1 align="center">douda Shopify Theme</h1>

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

```
📁 Theme Root
├── 📁 assets/           # Theme assets (CSS, JS, images)
├── 📁 config/          # Theme settings and schema
├── 📁 layout/          # Theme layout templates
├── 📁 locales/         # Translation files
├── 📁 sections/        # Theme sections
├── 📁 snippets/        # Reusable template snippets
└── 📁 templates/       # Page templates
```

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Description |
|------|---------|-------------|
| Node.js | >= 16 | JavaScript runtime |
| Shopify CLI | Latest | Shopify development tools |
| GitHub CLI | Latest | GitHub integration |

### Quick Start 🏃‍♂️

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development**
   ```bash
   npm run theme:dev
   ```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run theme:dev` | Start development server |
| `npm run theme:pull` | Pull theme from Shopify |
| `npm run theme:push:staging` | Push to staging theme |
| `npm run theme:push:production` | Push to production theme |
| `npm run semantic-release` | Run semantic release |

## 📦 Semantic Release

This project uses semantic-release to automate version management. Version numbers follow [Semantic Versioning](https://semver.org/).

### 📝 Commit Message Format

| Type | Description | Version Impact |
|------|-------------|----------------|
| `feat` | New feature | Minor bump |
| `fix` | Bug fix | Patch bump |
| `docs` | Documentation | No bump |
| `style` | Code style | No bump |
| `refactor` | Code refactoring | Patch bump |
| `perf` | Performance | Patch bump |
| `test` | Testing | No bump |
| `chore` | Maintenance | Patch bump |
| `revert` | Revert changes | Patch bump |

### 🌳 Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production | 🔒 Protected |
| `staging` | Pre-production | 🔒 Protected |
| `feat/*` | Feature development | 🔓 Open |
| `fix/*` | Bug fixes | 🔓 Open |

## 🚀 Deployment Workflow

1. 🔨 Create feature branch
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. 💾 Commit changes using conventional commits
   ```bash
   git commit -m "feat: Add new feature"
   ```

3. 🔄 Create PR to `staging`
4. 👀 Review preview theme
5. 🎯 Merge to `staging`
6. 🚀 Create PR from `staging` to `main`

## 🔄 CI/CD Pipeline

| Stage | Trigger | Actions |
|-------|---------|---------|
| Validate | PR, Push | 🔍 Lint commits<br>✅ Run tests |
| Preview | PR | 🎨 Create preview theme |
| Release | Merge to main | 📦 Create release<br>📝 Generate changelog<br>🚀 Deploy theme |

## ⚙️ Theme Configuration

- 🏪 Store URL: `sandbox-semantic-release.myshopify.com`
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
</p>