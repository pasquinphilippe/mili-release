# ${clientName} Shopify Theme

<div align="center">
  <strong>Custom Shopify theme for ${storeUrl}</strong>
</div>

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone ${repoUrl}
   cd ${repoName}
   npm install
   ```

2. **Set Up Environment**
   ```bash
   # Create .env file
   echo "SHOPIFY_FLAG_STORE=${storeUrl}" >> .env
   echo "SHOPIFY_CLI_THEME_TOKEN=your_theme_token" >> .env
   ```

3. **Start Development**
   ```bash
   npm run theme:dev
   ```

## 📁 Theme Structure

```
theme/
├── assets/           # Static assets
│   ├── css/         # Stylesheets
│   ├── js/          # JavaScript files
│   └── images/      # Theme images
├── config/          # Theme settings
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/          # Layout templates
│   ├── theme.liquid
│   └── password.liquid
├── locales/         # Translations
│   └── en.default.json
├── sections/        # Theme sections
│   ├── header.liquid
│   └── footer.liquid
├── snippets/        # Reusable code
│   └── product-card.liquid
└── templates/       # Page templates
    ├── index.liquid
    ├── product.liquid
    └── collection.liquid
```

## 🛠️ Development

### Common Commands
```bash
# Start development server
npm run theme:dev

# Pull theme from Shopify
npm run theme:pull

# Push to staging
npm run theme:push:staging

# Push to production
npm run theme:push:production
```

### Development Flow

1. **Local Development**
   ```bash
   npm run theme:dev
   ```
   - Live preview at `https://${storeUrl}?preview_theme_id=xxx`
   - Auto-reloads on changes
   - Shows build errors

2. **Staging Deployment**
   ```bash
   npm run theme:push:staging
   ```
   - Creates/updates "[Staging]" theme
   - For testing before production

3. **Production Deployment**
   ```bash
   npm run theme:push:production
   ```
   - Deploys to production theme
   - Only from `main` branch

### Git Workflow

1. **Branch Structure**
   ```
   main (production)
   └── staging (development)
        ├── feature/xyz
        ├── fix/xyz
        └── docs/xyz
   ```

2. **Development Process**
   - Create branch from `staging`
   - Develop and test locally
   - Push to staging theme
   - Create PR to `staging`
   - After review, merge to `main`

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: New features (minor)
- `fix`: Bug fixes (patch)
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code changes
- `test`: Testing
- `chore`: Maintenance

**Examples:**
```bash
feat(header): Add new navigation menu
fix(cart): Resolve checkout button issue
style(product): Update card layout
```

## 🔒 Security Best Practices

### Environment Variables
- Store in `.env` file (gitignored)
- Never commit sensitive data
- Use GitHub Secrets for CI/CD

### Access Control
- Protect `main` branch
- Require PR reviews
- Use environment-specific tokens

## 📚 Resources

### Documentation
- [Shopify Theme Docs](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Theme Kit](https://shopify.github.io/themekit)

### Development Tools
- [Theme Check](https://github.com/shopify/theme-check)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

### Best Practices
- [Shopify Theme Best Practices](https://shopify.dev/themes/best-practices)
- [Liquid Code Style](https://shopify.dev/api/liquid/basics)
- [Performance Guidelines](https://shopify.dev/themes/best-practices/performance)

## 📝 License
Private and Confidential - ${clientName}
