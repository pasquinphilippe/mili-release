# Configuration Guide for @milistack/theme-cli

This guide covers all configuration options and settings available in the @milistack/theme-cli.

## 📝 Configuration Files

### .releaserc.json
Controls semantic release behavior:
```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}
```

### release.config.js
Configures release workflow:
```javascript
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git'
  ]
};
```

### commitlint.config.js
Defines commit message rules:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', 'sentence-case']
  }
};
```

## 🔐 Stored Configurations

Configurations are stored in:
```
~/.config/configstore/mili-theme-cli.json
```

### Structure:
```json
{
  "stores": {
    "store-name": {
      "url": "store.myshopify.com",
      "token": "shpat_xxxxx",
      "themeId": "123456789"
    }
  }
}
```

## 🛠️ CLI Options

### Global Options
| Option | Description | Default |
|--------|-------------|---------|
| `--use-stored` | Use stored configuration | - |
| `--list-stores` | List stored configurations | - |
| `--remove-store` | Remove stored configuration | - |
| `--version` | Show version number | - |
| `--help` | Show help | - |

### Theme Options
| Option | Description | Default |
|--------|-------------|---------|
| `--theme-name` | Set theme name | `{client}-theme` |
| `--store-url` | Set Shopify store URL | - |
| `--access-token` | Set theme access token | - |
| `--client-name` | Set client name | - |

## 🔄 GitHub Actions

### Workflow Configuration
Located in `.github/workflows/release.yml`:
```yaml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run semantic-release
```

## 🏗️ Project Structure

### Required Directories
```
theme/
├── assets/
├── config/
├── layout/
├── locales/
├── sections/
├── snippets/
└── templates/
```

## 🔑 Authentication

### Shopify Access Token
1. Go to Shopify Admin
2. Navigate to Apps > Manage private apps
3. Create new private app
4. Enable theme read/write access
5. Copy access token

### GitHub Token
1. Go to GitHub Settings
2. Navigate to Developer settings > Personal access tokens
3. Generate new token with:
   - `repo` access
   - `workflow` access

## 📦 Dependencies

Required in package.json:
```json
{
  "dependencies": {
    "@semantic-release/changelog": "^6.0.0",
    "@semantic-release/git": "^10.0.0",
    "semantic-release": "^19.0.0"
  }
}
```

## 🚀 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub access token | Yes |
| `NPM_TOKEN` | NPM publish token | Yes |
| `SHOPIFY_ACCESS_TOKEN` | Shopify API token | Yes |
| `SHOPIFY_STORE_URL` | Shopify store URL | Yes |

## 🔧 Advanced Configuration

### Custom Theme Templates
Place custom theme templates in:
```
templates/theme/
```

### Custom Section Templates
Place custom section templates in:
```
templates/sections/
```

### Custom Snippet Templates
Place custom snippet templates in:
```
templates/snippets/
```

## 🐛 Troubleshooting

### Common Issues

1. **Token Invalid**
   - Verify token permissions
   - Regenerate token
   - Check token expiration

2. **Theme Deploy Failed**
   - Check store URL
   - Verify theme access
   - Check file permissions

3. **Release Failed**
   - Verify commit message format
   - Check GitHub token
   - Review workflow logs
