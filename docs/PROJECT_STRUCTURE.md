# Project Structure Guide for @milistack/theme-cli

This document provides a detailed overview of the project's directory structure and file organization.

## 📁 Root Directory Structure

```
.
├── .github/            # GitHub specific files
│   └── workflows/      # GitHub Actions workflow definitions
├── .husky/            # Git hooks for commit validation
├── .shopify/          # Shopify CLI configuration
├── assets/            # Static assets for the CLI
├── bin/              # CLI entry points
├── config/           # Configuration files
├── locales/          # Internationalization files
├── package/          # Main package source code
├── sections/         # Theme section templates
├── snippets/         # Theme snippet templates
├── templates/        # Theme templates
└── test/            # Test files and fixtures
```

## 📂 Directory Details

### .github/
Contains GitHub-specific configuration:
```
.github/
├── workflows/
│   ├── release.yml    # Automated release workflow
│   └── test.yml       # CI test workflow
└── ISSUE_TEMPLATE/    # Issue templates
```

### .husky/
Git hooks configuration:
```
.husky/
├── commit-msg        # Commit message validation
└── pre-commit       # Pre-commit checks
```

### assets/
Static assets used by the CLI:
```
assets/
├── images/          # Image assets
└── templates/       # Template files
```

### bin/
CLI entry points:
```
bin/
├── mili-theme.js    # Main CLI entry point
└── mili-release.js  # Alternative entry point
```

### config/
Configuration files:
```
config/
├── default.json     # Default configuration
└── schema.json      # Configuration schema
```

### locales/
Internationalization files:
```
locales/
├── en.json         # English translations
└── fr.json         # French translations
```

### package/
Main package source code:
```
package/
├── lib/            # Core library files
│   ├── cli/        # CLI implementation
│   ├── config/     # Configuration management
│   ├── github/     # GitHub integration
│   ├── shopify/    # Shopify integration
│   └── utils/      # Utility functions
├── types/          # TypeScript type definitions
└── index.js        # Package entry point
```

### sections/
Theme section templates:
```
sections/
├── header/         # Header section templates
├── footer/         # Footer section templates
└── custom/         # Custom section templates
```

### snippets/
Theme snippet templates:
```
snippets/
├── product/        # Product-related snippets
├── cart/           # Cart-related snippets
└── utils/          # Utility snippets
```

### templates/
Theme templates:
```
templates/
├── theme/          # Main theme templates
├── pages/          # Page templates
└── sections/       # Section templates
```

### test/
Test files and fixtures:
```
test/
├── fixtures/       # Test fixtures
├── integration/    # Integration tests
└── unit/          # Unit tests
```

## 📄 Key Files

### Root Configuration Files
```
├── .releaserc.json           # Semantic release configuration
├── release.config.js         # Release workflow configuration
├── commitlint.config.js      # Commit message validation rules
├── package.json             # Package manifest
└── tsconfig.json           # TypeScript configuration
```

### Documentation Files
```
├── README.md               # Project overview
├── CHANGELOG.md           # Automated changelog
├── CONTRIBUTING.md        # Contribution guidelines
└── docs/                 # Additional documentation
    ├── CONFIGURATION.md   # Configuration guide
    └── PROJECT_STRUCTURE.md # This file
```

## 🔄 File Relationships

### Theme Generation Flow
```
CLI Entry (bin/)
  → Configuration (config/)
  → Template Selection (templates/)
  → Section Integration (sections/)
  → Snippet Inclusion (snippets/)
  → Asset Copying (assets/)
```

### Release Process Flow
```
Commit
  → Husky Hooks (.husky/)
  → GitHub Actions (.github/workflows/)
  → Semantic Release (release.config.js)
  → Changelog Update (CHANGELOG.md)
```

## 📦 Package Organization

### Core Modules
```
package/lib/
├── cli/          # CLI implementation
│   ├── commands/  # Command definitions
│   ├── prompts/   # Interactive prompts
│   └── actions/   # Command actions
├── config/       # Configuration management
│   ├── store/     # Configuration storage
│   └── validate/  # Configuration validation
└── integrations/ # External integrations
    ├── github/    # GitHub API integration
    └── shopify/   # Shopify API integration
```

### Utility Modules
```
package/lib/utils/
├── file/         # File operations
├── template/     # Template processing
├── validation/   # Input validation
└── logger/       # Logging utilities
```

## 🔍 Import/Export Structure

### Main Exports
```javascript
// package/index.js
export { CLI } from './lib/cli';
export { Config } from './lib/config';
export { GitHub } from './lib/github';
export { Shopify } from './lib/shopify';
```

### Type Definitions
```typescript
// package/types/index.d.ts
export interface CLIOptions {...}
export interface ThemeConfig {...}
export interface GitHubConfig {...}
export interface ShopifyConfig {...}
```

## 🔧 Build Output

### Production Build
```
dist/
├── cli/          # Compiled CLI code
├── lib/          # Compiled library code
└── types/        # Generated type definitions
```

### Development Build
```
build/
├── src/          # Transpiled source
└── test/         # Compiled tests
```
