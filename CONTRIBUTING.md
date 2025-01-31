# 🤝 Contributing to Mili Theme CLI

## Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/pasquinphilippe/mili-release.git
   cd mili-release
   ```

2. **Install**
   ```bash
   npm install
   ```

3. **Create Branch**
   ```bash
   git checkout -b feature/your-feature
   # or
   git checkout -b fix/your-fix
   ```

## 📝 Making Changes

### Commit Messages
```bash
# Features
feat(scope): Add new feature
# Example: feat(cli): Add store list command

# Bug Fixes
fix(scope): Fix issue
# Example: fix(sync): Correct workflow sync path

# Documentation
docs(scope): Update docs
# Example: docs(readme): Add usage examples
```

### Pull Requests
1. Update your branch with main
2. Push your changes
3. Create PR with clear title and description
4. Wait for review

## 🧪 Testing
```bash
# Run tests
npm test

# Test CLI locally
mkdir test-theme
cd test-theme
node ../bin/mili-release.js
```

## 📚 Documentation
- Update README.md if needed
- Add JSDoc comments for new functions
- Update CLI help messages

## ❓ Questions?
- Open an [issue](https://github.com/pasquinphilippe/mili-release/issues)
- Ask in PR comments
- Check [existing docs](https://github.com/pasquinphilippe/mili-release#-documentation)

## 📜 License
By contributing, you agree that your contributions will be licensed under the MIT License.
