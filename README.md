# Mili Theme CLI

A CLI tool for setting up Shopify theme development with semantic versioning and automated deployments.

## Features

- 🚀 Quick theme setup with best practices
- 📦 Automated semantic versioning
- 🔄 GitHub Actions integration for CI/CD
- 🛡️ Branch protection and deployment safety checks
- 📝 Automated changelog generation
- 🔑 Secure secrets management
- 🎨 Standard Shopify theme structure

## Prerequisites

1. Install the Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Authenticate with Shopify:
   ```bash
   shopify auth login
   ```

3. Install Mili Theme CLI:
   ```bash
   npm install -g @milistack/theme-cli
   ```

## Getting Started

### Option 1: Start with an Existing Theme

1. Create your project directory:
   ```bash
   mkdir my-store-theme
   cd my-store-theme
   ```

2. Pull your existing theme:
   ```bash
   # List available themes
   shopify theme list

   # Pull the theme you want to work with (replace THEME_ID)
   shopify theme pull --theme THEME_ID
   ```

3. Initialize version control:
   ```bash
   mili-theme
   ```

4. Follow the prompts to set up:
   - Project name
   - Shopify store URL
   - Theme token
   - GitHub integration

### Option 2: Create a New Theme

1. Create your project directory:
   ```bash
   mkdir my-new-theme
   cd my-new-theme
   ```

2. Initialize the theme:
   ```bash
   mili-theme
   ```

3. Follow the prompts to set up:
   - Project name
   - Shopify store URL
   - Theme token
   - GitHub integration

### Option 3: Clone an Existing Theme Repository

1. Clone your theme repository:
   ```bash
   git clone https://github.com/your-username/your-theme.git
   cd your-theme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Shopify connection:
   ```bash
   shopify theme dev
   ```

## Development Commands

Common commands you'll use during development:

```bash
# Start development server
npm run dev

# Push changes to Shopify
npm run push

# Pull latest changes from Shopify
npm run pull

# Create a new release (automatic via CI/CD)
git push origin main
```

## What It Sets Up

The CLI will create a complete Shopify theme development environment:

### Directory Structure
```
my-theme/
├── assets/
├── config/
├── layout/
├── locales/
├── sections/
├── snippets/
└── templates/
```

### Configuration Files
- `package.json` with scripts and dependencies
- GitHub Actions workflow for CI/CD
- Semantic release configuration
- Commitlint for conventional commits
- Branch protection rules (if using GitHub)

### Development Workflow

1. Make changes to your theme files
2. Stage your changes:
   ```bash
   git add .
   ```

3. Commit using conventional commits:
   ```bash
   git commit -m "feat: add new product template"
   ```

   Commit types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Theme style changes
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance

4. Push your changes:
   ```bash
   git push
   ```

The GitHub Actions workflow will automatically:
- Run tests (if configured)
- Create a new release
- Generate a changelog
- Deploy to your Shopify store (if configured)

## Requirements

- Node.js >= 20
- Git
- GitHub account (optional, for CI/CD)
- Shopify CLI theme token

## Troubleshooting

### Common Issues

1. **GitHub Authentication**
   - Ensure you have the GitHub CLI installed
   - Run `gh auth login` if prompted

2. **Shopify CLI Token**
   - Generate a new token from your Shopify Partner dashboard
   - Ensure the token has the necessary permissions

3. **Branch Protection**
   - If you can't push to protected branches, create a pull request instead
   - Ensure your commits follow the conventional commit format

### Getting Help

If you encounter any issues:
1. Check the [GitHub Issues](https://github.com/pasquinphilippe/mili-release/issues)
2. Create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Error messages

## License

MIT
