# Contributing to Our Shopify Theme

👋 First off, thanks for taking the time to contribute!

## 🎯 Quick Links

- 🐛 [Report a bug](../../issues/new?assignees=&labels=bug&template=bug_report.md&title=bug%3A+)
- 💡 [Request a feature](../../issues/new?assignees=&labels=enhancement&template=feature_request.md&title=feat%3A+)
- 🔄 [Submit changes](../../pulls)
- 📘 [Code of Conduct](CODE_OF_CONDUCT.md)

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the [existing issues](../../issues) as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**🎯 Use our bug report template which asks for:**
- A clear and descriptive title
- Exact steps to reproduce the problem
- Expected behavior vs actual behavior
- Screenshots or GIFs if applicable
- Your environment details (OS, browser, etc.)
- Any additional context

### 💡 Suggesting Enhancements

We love new ideas! Before creating enhancement suggestions, please check the [existing issues](../../issues) as you might find that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible:

**🎯 Use our feature request template which asks for:**
- A clear and descriptive title
- Detailed description of the proposed feature
- Examples of how the feature would work
- Why this feature would be useful
- Possible alternatives you've considered

### 🔄 Pull Requests

Here's how to submit changes:

1. Fork the repo and create your branch from \`staging\`:
   \`\`\`bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   \`\`\`

2. Make your changes following our coding conventions

3. Test your changes thoroughly

4. Commit your changes using conventional commits:
   \`\`\`bash
   git commit -m "feat: Add new feature"
   # or
   git commit -m "fix: Resolve issue with X"
   \`\`\`

5. Push to your fork and submit a pull request to the \`staging\` branch

## 📝 Style Guides

### 💬 Git Commit Messages

- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:
\`\`\`bash
feat: Add new product card component
fix: Resolve shopping cart calculation issue
docs: Update installation instructions
style: Format code according to style guide
refactor: Restructure product filtering logic
test: Add unit tests for checkout process
chore: Update dependencies
\`\`\`

### 🎨 Liquid Style Guide

- Use soft tabs (2 spaces)
- Put one space after the opening tag and before the closing tag
- Break long lines after 80 characters
- Use meaningful variable names
- Comment complex logic

Example:
\`\`\`liquid
{% # Good %}
{% assign product_price = product.price | money %}
{% if product_price > 100 %}
  <span class="product-price product-price--large">
    {{ product_price }}
  </span>
{% endif %}

{% # Bad %}
{% assign p = product.price | money %}
{% if p > 100 %}
<span class="price large">{{p}}</span>
{% endif %}
\`\`\`

### 🎨 SCSS Style Guide

- Use soft tabs (2 spaces)
- Put spaces after : in property declarations
- Put spaces before { in rule declarations
- Use hex color codes #000 unless using rgba()
- Use // for comment blocks

Example:
\`\`\`scss
// Good
.product-card {
  position: relative;
  margin: 0 auto;
  background-color: #ffffff;

  &__title {
    font-size: rem(16px);
    color: rgba(0, 0, 0, 0.87);
  }
}

// Bad
.product-card{
  position:relative;
  margin:0 auto;
  background-color: white;

  &__title{
    font-size: 16px;
    color: #000;
  }
}
\`\`\`

### 🎨 JavaScript Style Guide

- Use soft tabs (2 spaces)
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use const for all of your references; avoid using var
- Use template literals instead of string concatenation

Example:
\`\`\`javascript
// Good
const calculateTotal = (items) => {
  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return `Total: ${total}`;
};

// Bad
var calculateTotal = function(items) {
  var total = 0;
  for(var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return "Total: " + total;
};
\`\`\`

## 🏷️ Issue and Pull Request Labels

We use labels to help us track and manage issues and pull requests. Here's what we use:

### Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation changes |
| `help-wanted` | Extra attention needed |
| `question` | Further information needed |
| `security` | Security-related issues |
| `performance` | Performance-related issues |
| `refactor` | Code refactoring |
| `testing` | Testing-related issues |
| `ui/ux` | User interface/experience |

### Pull Request Labels

| Label | Description |
|-------|-------------|
| `work-in-progress` | Pull request is still being worked on |
| `needs-review` | Ready for code review |
| `needs-testing` | Needs testing before merge |
| `ready-to-merge` | Approved and ready to merge |
| `do-not-merge` | Should not be merged yet |

## 🎉 Recognition

We believe in recognizing our contributors! Here's how we do it:

- All contributors are listed in our README.md
- Significant contributions are highlighted in release notes
- Active contributors may be invited to join the core team
- We regularly shout out contributors on our social media

## ❓ Questions?

Don't hesitate to reach out if you have questions. You can:

- 💬 Open a [discussion](../../discussions)
- 📧 Email us at [support@milistack.com](mailto:support@milistack.com)
- 💭 Join our [Discord community](https://discord.gg/milistack)

---

Thank you for contributing to make our Shopify theme better! 🙏
