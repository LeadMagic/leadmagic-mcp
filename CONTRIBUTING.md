# 🤝 Contributing to LeadMagic MCP Server

Thank you for your interest in contributing to LeadMagic MCP Server! This guide will help you get started with contributing to our project.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Contributing Process](#-contributing-process)
- [Code Standards](#-code-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Documentation](#-documentation)
- [Issue Guidelines](#-issue-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Release Process](#-release-process)
- [Community](#-community)

## 🚀 Getting Started

### 🔍 Ways to Contribute

- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new features and improvements
- 📝 **Documentation**: Improve our docs, examples, and guides
- 🧪 **Testing**: Help test new features and bug fixes
- 💻 **Code**: Implement new features or fix bugs
- 🎨 **Design**: Improve UX/UI of our tools and documentation
- 🌐 **Translation**: Help translate documentation
- 💬 **Community**: Help others in discussions and issues

### 🎯 Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - We need community help
- `documentation` - Documentation improvements
- `bug` - Bug fixes

## 💻 Development Setup

### 📋 Prerequisites

- 📦 **Node.js**: 18.0.0 or higher
- 🔑 **LeadMagic API Key**: Get one from [leadmagic.io](https://app.leadmagic.io)
- 🐙 **Git**: For version control
- 📝 **Code Editor**: VS Code, Cursor, or your preferred editor

### 🛠️ Local Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/leadmagic-mcp.git
cd leadmagic-mcp

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and add your LEADMAGIC_API_KEY

# 4. Build the project
npm run build

# 5. Run validation
npm run validate

# 6. Test the server
npm run dev
```

### 🔧 Development Commands

```bash
# 🏗️ Build project
npm run build

# 🔍 Type checking
npm run type-check

# 🎨 Linting
npm run lint
npm run lint:fix

# 🎨 Code formatting
npm run format
npm run format:check

# 🧪 Testing
npm test
npm run test:watch
npm run test:coverage

# ✅ Full validation
npm run validate

# 🔍 MCP Inspector (for testing)
npm run inspector
```

## 🔄 Contributing Process

### 1. 🍴 Fork the Repository

Click the "Fork" button on GitHub and clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/leadmagic-mcp.git
cd leadmagic-mcp
git remote add upstream https://github.com/LeadMagic/leadmagic-mcp.git
```

### 2. 🌿 Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 3. 💻 Make Changes

- Write clear, focused commits
- Follow our code standards
- Add/update tests as needed
- Update documentation

### 4. ✅ Test Your Changes

```bash
# Run full validation
npm run validate

# Test manually with MCP inspector
npm run inspector

# Test with real MCP clients (Claude, Cursor, etc.)
```

### 5. 📤 Submit Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
```

## 📏 Code Standards

### 🎨 TypeScript Style

```typescript
// ✅ Good
interface EmailRequest {
  email: string;
  validate_syntax?: boolean;
}

// ❌ Avoid
interface emailrequest {
  email: any;
  validateSyntax: boolean;
}
```

### 📁 File Organization

```
src/
├── types.ts          # Type definitions and Zod schemas
├── client.ts         # API client implementation
├── server.ts         # MCP server with tools
└── index.ts          # Entry point
```

### 🔧 Code Guidelines

- **📝 Use TypeScript**: All code must be typed
- **✅ Validate inputs**: Use Zod schemas for validation
- **🛡️ Handle errors**: Comprehensive error handling
- **📖 Document code**: Clear comments for complex logic
- **🧪 Write tests**: Cover new functionality
- **🎨 Follow conventions**: Use existing patterns

### 🚫 Code Style Rules

- ✅ Use `snake_case` for API field names (LeadMagic convention)
- ✅ Use `camelCase` for TypeScript variables/functions
- ✅ Use `const` over `let` where possible
- ✅ Prefer explicit types over `any`
- ✅ Use meaningful variable names
- ❌ No console.log in production code
- ❌ No unused variables or imports

## 🧪 Testing Guidelines

### 🎯 Test Coverage

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API client with LeadMagic
- **MCP Tests**: Test MCP server functionality
- **Manual Tests**: Test with real MCP clients

### 📝 Writing Tests

```typescript
// Example test structure
describe('EmailValidator', () => {
  it('should validate correct email format', async () => {
    const result = await client.validateEmail({
      email: 'test@example.com'
    });
    
    expect(result.email_status).toBe('valid');
  });
});
```

### 🔧 Test Commands

```bash
# Run tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Test specific file
npm test -- email.test.ts
```

## 📚 Documentation

### 📝 Documentation Standards

- **Clear and concise**: Easy to understand
- **Examples included**: Show real usage
- **Up to date**: Keep in sync with code changes
- **Comprehensive**: Cover all features

### 📖 Documentation Types

- **README.md**: Main documentation
- **CHANGELOG.md**: Version history
- **Code comments**: Inline documentation
- **Issue templates**: Contribution guides
- **Examples**: Usage demonstrations

### ✅ Documentation Checklist

- [ ] Updated README for new features
- [ ] Added code comments for complex logic
- [ ] Updated CHANGELOG for significant changes
- [ ] Included usage examples
- [ ] Checked for typos and grammar

## 🐛 Issue Guidelines

### 📝 Creating Issues

Before creating an issue:
1. 🔍 Search existing issues
2. 📚 Check documentation
3. 🧪 Test with latest version

### 🐛 Bug Reports

Include:
- **📋 Environment details** (OS, Node.js, MCP client)
- **🔄 Steps to reproduce**
- **📱 Expected vs actual behavior**
- **📋 Error messages/logs**
- **🔧 Configuration details** (remove API keys!)

### 💡 Feature Requests

Include:
- **🎯 Use case and benefits**
- **📝 Detailed description**
- **🔧 Implementation ideas** (optional)
- **📊 Priority and timeline**

## 🔄 Pull Request Process

### ✅ PR Checklist

Before submitting:
- [ ] 🧪 All tests pass
- [ ] 📚 Documentation updated
- [ ] 🎨 Code follows style guidelines
- [ ] ✅ No linting errors
- [ ] 🔧 Builds successfully
- [ ] 🧹 No debugging code left

### 📝 PR Description

Include:
- **📋 Clear description** of changes
- **🔗 Related issue numbers**
- **🧪 Testing details**
- **💥 Breaking changes** (if any)
- **📸 Screenshots** (if applicable)

### 🔍 Review Process

1. **🤖 Automated checks** must pass
2. **👥 Code review** by maintainers
3. **✅ Approval** required before merge
4. **🔄 Squash and merge** preferred

## 🚀 Release Process

### 📊 Version Numbers

We follow [Semantic Versioning](https://semver.org/):
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features (backward compatible)
- **Patch** (1.0.1): Bug fixes

### 🏷️ Creating Releases

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions will handle the rest

## 👥 Community

### 💬 Communication Channels

- **🐙 GitHub Issues**: Bug reports, feature requests
- **💬 Discord**: Community chat and support
- **📧 Email**: support@leadmagic.io
- **🐦 Twitter**: @LeadMagic (updates and announcements)

### 🤝 Code of Conduct

We follow a **positive and inclusive** approach:
- ✅ Be respectful and constructive
- ✅ Welcome newcomers and questions
- ✅ Focus on technical merit
- ❌ No harassment or discrimination
- ❌ No spam or off-topic content

### 🎉 Recognition

Contributors are recognized through:
- **📝 CHANGELOG mentions**
- **🏆 GitHub contributors list**
- **💬 Community shoutouts**
- **🎁 LeadMagic swag** (for significant contributions)

## ❓ Questions?

**Need help getting started?**
- 📚 Read our [documentation](https://github.com/LeadMagic/leadmagic-mcp/blob/main/README.md)
- 💬 Join our [Discord community](https://discord.gg/leadmagic)
- 📧 Email us: support@leadmagic.io
- 🐙 Open a [GitHub discussion](https://github.com/LeadMagic/leadmagic-mcp/discussions)

---

**🎉 Thank you for contributing to LeadMagic MCP Server!**

Your contributions help make B2B data enrichment more accessible to developers and AI tools worldwide. 🚀 