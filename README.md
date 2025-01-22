# Mili Release CLI

A CLI tool for setting up Shopify theme development with semantic versioning and automated deployments.

## Installation

Since this is a private GitHub Package, you'll need to configure npm to use GitHub Packages registry for the `@mili-release` scope.

### For Organization Members

1. Create a GitHub Personal Access Token (PAT):
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate a new token with `read:packages` scope
   - Copy the token

2. Configure npm to use GitHub Packages:
   ```bash
   # Create or edit ~/.npmrc
   echo "@mili-release:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_PAT_HERE" >> ~/.npmrc
   ```

3. Install the package globally:
   ```bash
   npm install -g @mili-release/cli
   ```

### Usage

1. Create a new theme directory:
   ```bash
   mkdir my-theme
   cd my-theme
   ```

2. Run the CLI:
   ```bash
   mili-release
   ```

3. Follow the prompts to:
   - Enter your project name
   - Provide your Shopify store URL
   - Enter your Shopify CLI theme token
   - Choose whether to set up GitHub integration

### Features

- Automated theme setup with best practices
- Semantic versioning for releases
- GitHub Actions integration for CI/CD
- Branch protection and deployment safety checks
- Automated changelog generation

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/pasquinphilippe/mili-release.git
   cd mili-release
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link for local development:
   ```bash
   npm link
   ```

### Contributing

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes and commit using conventional commits:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation changes
   - style: Code style changes
   - refactor: Code refactoring
   - test: Adding tests
   - chore: Maintenance

3. Push and create a pull request

### Requirements

- Node.js >= 20
- Git
- GitHub CLI (optional, will be installed if needed)

### License

MIT
