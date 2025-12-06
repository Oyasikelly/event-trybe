# Contributing to EventTrybe

First off, thank you for considering contributing to EventTrybe! 🎉

It's people like you that make EventTrybe such a great tool for event management.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this code.

**Be respectful, be kind, be collaborative.**

## 🚀 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

**Use this template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
```

### Suggesting Features 💡

We love feature suggestions! Before creating a feature request:
- Check if it's already been suggested
- Make sure it aligns with the project's goals

**When suggesting a feature, include:**
- Clear use case
- Why this feature would be useful
- Possible implementation approach (optional)

### Code Contributions 💻

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Resend account (for email testing)

### Quick Start

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/event-trybe.git
   cd event-trybe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

For detailed setup instructions, see [SETUP.md](SETUP.md).

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors
- [ ] Tested locally

### PR Guidelines

1. **Keep PRs focused** - One feature/fix per PR
2. **Write clear descriptions** - Explain what and why
3. **Link related issues** - Use "Fixes #123" or "Closes #456"
4. **Update documentation** - If you change functionality
5. **Add screenshots** - For UI changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe your testing process

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested locally
```

## 💅 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Export types when reusable

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names (PascalCase)
- Extract reusable logic into custom hooks

### File Naming
- Components: `PascalCase.tsx` (e.g., `EventCard.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- API routes: `route.ts` (Next.js convention)

### Code Style
- Use Prettier for formatting (configured in project)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line

### Example
```typescript
// ✅ Good
interface EventCardProps {
  title: string
  date: Date
  onRegister: () => void
}

export function EventCard({ title, date, onRegister }: EventCardProps) {
  const formattedDate = format(date, 'PPP')
  
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{formattedDate}</p>
      <button onClick={onRegister}>Register</button>
    </div>
  )
}

// ❌ Bad
export function eventcard(props: any) {
  return <div>{props.title}</div>
}
```

## 📦 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(events): add event duplication feature

fix(check-in): resolve QR scanner camera permission issue

docs(readme): update installation instructions

refactor(auth): simplify login flow
```

## 🧪 Testing

### Manual Testing
Before submitting, test your changes:
1. Create test events
2. Register for events
3. Test check-in flow
4. Verify email notifications

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build Test
```bash
npm run build
```

## 📚 Additional Resources

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Project Structure](SETUP.md#project-structure) - Codebase organization
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [Prisma Docs](https://www.prisma.io/docs) - Database ORM

## 🎯 Areas We Need Help

Looking to contribute but not sure where to start? Here are areas we'd love help with:

- 📱 **Mobile responsiveness** improvements
- ♿ **Accessibility** enhancements
- 🧪 **Testing** - Unit and integration tests
- 📝 **Documentation** - Tutorials and guides
- 🌍 **Internationalization** - Multi-language support
- 🎨 **UI/UX** improvements

## ❓ Questions?

- 💬 [GitHub Discussions](https://github.com/Oyasikelly/event-trybe/discussions)
- 🐛 [Report Issues](https://github.com/Oyasikelly/event-trybe/issues)
- 📧 Email: support@eventtrybe.com

## 🙏 Thank You!

Your contributions make EventTrybe better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🎉**
