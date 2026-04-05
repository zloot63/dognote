# Contributing to DogNote 🐾

Thank you for your interest in contributing to **DogNote**! This document provides guidelines for
contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Commit Message Guidelines](#commit-message-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please:

1. Check if the issue already exists
2. Use the latest version to verify the bug
3. Collect sufficient information (steps to reproduce, expected vs actual behavior)

### Suggesting Features

Feature requests are welcome! Please provide:

- Clear use case description
- Expected behavior
- Possible implementation approach (if applicable)

### Code Contributions

Areas where contributions are especially welcome:

- Bug fixes
- Test coverage improvements
- Documentation updates
- UI/UX enhancements
- Performance optimizations

---

## Development Setup

### Prerequisites

- Node.js 18.17.0+ (recommended: 20.x LTS)
- npm 9.x+
- Git 2.30+

### Local Development

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/dognote.git
cd dognote

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Define interfaces for all props and return types
- Avoid `any` type

### React Components

```typescript
// Function component with explicit return type
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Styling (Tailwind CSS)

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing using the design system

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Target minimum 80% code coverage

```bash
npm run test        # Run unit tests
npm run test:coverage  # Check coverage
```

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `test`: Test additions or corrections
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(auth): add Google OAuth login
fix(dog-profile): resolve image upload error
docs(readme): update installation instructions
test(walk-tracker): add GPS accuracy tests
```

---

## Pull Request Process

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following coding standards

3. **Run checks locally**:

   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Commit** with conventional commit message

5. **Push** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** with:
   - Clear title and description
   - Link to related issue(s)
   - Screenshots (for UI changes)
   - Testing steps

7. **Code Review**: Address review comments promptly

8. **Merge**: Maintainers will merge after approval

---

## Issue Reporting

### Bug Report Template

```markdown
**Description:** Clear description of the bug

**Steps to Reproduce:**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:** What you expected to happen

**Actual Behavior:** What actually happened

**Environment:**

- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 20.10.0]
```

### Feature Request Template

```markdown
**Feature Description:** Clear description of the proposed feature

**Use Case:** Why is this feature needed?

**Proposed Solution:** How should this feature work?

**Alternatives:** Any alternative approaches considered
```

---

## Questions?

Feel free to:

- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

Thank you for contributing to DogNote! 🐕

---

**Last Updated:** 2025-04-05
