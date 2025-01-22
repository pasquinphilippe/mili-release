# ${clientName} Shopify Theme

## Overview
This is a custom Shopify theme for ${storeUrl}. The theme uses semantic versioning and automated deployments through GitHub Actions.

## 🏗 Theme Structure
```
├── assets/
│   └── Static assets like CSS, JS, images
├── config/
│   └── Theme settings and configuration
├── layout/
│   └── Theme layout templates
├── locales/
│   └── Translation files
├── sections/
│   └── Modular, reusable sections
├── snippets/
│   └── Reusable code snippets
└── templates/
    └── Page templates
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)
- GitHub account with repository access

### Installation
1. Clone the repository:
   ```bash
   git clone ${repoUrl}
   cd ${repoName}
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   SHOPIFY_FLAG_STORE=${storeUrl}
   SHOPIFY_CLI_THEME_TOKEN=your_theme_token
   ```

### Development Commands
- Pull theme from Shopify:
  ```bash
  npm run theme:pull
  ```
- Push changes to Shopify:
  ```bash
  npm run theme:push
  ```

## 🔄 Version Control & Deployment

### Branch Structure
- \`main\`: Production theme
- \`development\`: Main development branch
- Feature branches: \`feature/*\`
- Bug fixes: \`fix/*\`

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning:

- \`feat:\` New features
- \`fix:\` Bug fixes
- \`docs:\` Documentation changes
- \`style:\` Code style changes
- \`refactor:\` Code refactoring
- \`test:\` Adding/updating tests
- \`chore:\` Maintenance tasks

### Automated Deployments
1. Create a feature branch from \`development\`
2. Make your changes
3. Commit using conventional commit format
4. Push and create a PR to \`development\`
5. Once merged, changes will be automatically deployed to staging
6. Create a PR from \`development\` to \`main\` for production deployment

## 🔒 Security
- Never commit sensitive data
- Store API keys and tokens in GitHub Secrets
- Use environment variables for configuration

## 📝 License
Private and Confidential - ${clientName}
