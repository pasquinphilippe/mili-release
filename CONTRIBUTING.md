# 🤝 Contributing to Theme Package

## Quick Start

1. **Setup**
   ```bash
   git clone https://github.com/pasquinphilippe/mili-release.git
   cd mili-release/package
   npm install
   ```

2. **Development**
   ```bash
   # Create test theme
   mkdir ../test-theme
   cd ../test-theme
   node ../bin/mili-release.js
   ```

## 📝 Making Changes

### Theme Structure
```
package/
├── templates/     # Theme templates
├── workflows/     # GitHub Actions
└── config/       # Default configs
```

### Workflow
1. Create feature branch
2. Make changes
3. Test in test theme
4. Create pull request

### Commit Style
```bash
# Adding features
feat(theme): Add new section template
feat(workflow): Add deployment step

# Fixing issues
fix(template): Correct liquid syntax
fix(config): Update default settings

# Documentation
docs(readme): Update theme structure
```

## 🧪 Testing
- Test all changes in a test theme
- Verify with Theme Check
- Test in both development and production

## 📚 Documentation
- Update relevant README sections
- Document new features
- Add inline comments

## ❓ Need Help?
- Check [documentation](https://github.com/pasquinphilippe/mili-release#-documentation)
- Open an [issue](https://github.com/pasquinphilippe/mili-release/issues)
- Ask in [discussions](https://github.com/pasquinphilippe/mili-release/discussions)

## 📜 License
MIT License - See [LICENSE](https://github.com/pasquinphilippe/mili-release/blob/main/LICENSE)
