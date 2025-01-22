# Contributing to Mili Release

We love your input! We want to make contributing to Mili Release as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): Subject

[optional body]
[optional footer]
```

Types:
- `feat`: New feature (minor version)
- `fix`: Bug fix (patch version)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```bash
git commit -m "feat: Add new template generation feature"
git commit -m "fix: Correct path resolution in Windows"
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/mili-release.git
cd mili-release
```

2. Install dependencies:
```bash
npm install
```

3. Create a test theme:
```bash
mkdir test-theme
cd test-theme
node ../bin/mili-release.js
```

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
