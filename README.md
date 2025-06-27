# 🎯 LeadMagic MCP Server

<div align="center">

**🚀 Production-ready Model Context Protocol (MCP) server for LeadMagic's complete B2B data enrichment API suite**

[![npm version](https://img.shields.io/npm/v/leadmagic-mcp-server?style=for-the-badge&color=brightgreen)](https://badge.fury.io/js/leadmagic-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue?style=for-the-badge)](https://modelcontextprotocol.io)

[![GitHub Stars](https://img.shields.io/github/stars/LeadMagic/leadmagic-mcp?style=for-the-badge)](https://github.com/LeadMagic/leadmagic-mcp/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/LeadMagic/leadmagic-mcp?style=for-the-badge)](https://github.com/LeadMagic/leadmagic-mcp/issues)
[![GitHub Forks](https://img.shields.io/github/forks/LeadMagic/leadmagic-mcp?style=for-the-badge)](https://github.com/LeadMagic/leadmagic-mcp/network/members)
[![Last Commit](https://img.shields.io/github/last-commit/LeadMagic/leadmagic-mcp?style=for-the-badge)](https://github.com/LeadMagic/leadmagic-mcp/commits/main)

</div>

---

## 📖 Table of Contents

- [🚀 Super Easy Installation](#-super-easy-installation)
- [🛠️ Available Tools](#️-available-tools)
- [💡 Usage Examples](#-usage-examples)
- [🌐 Supported MCP Clients](#-supported-mcp-clients)
- [🔧 Development Setup](#-development-setup)
- [🏗️ Architecture](#️-architecture)
- [📊 API Reference](#-api-reference)
- [🔒 Security & Best Practices](#-security--best-practices)
- [🎯 Installation Matrix](#-installation-matrix)
- [🤝 Support & Resources](#-support--resources)
- [📄 License](#-license)
- [🙋‍♀️ Contributing](#️-contributing)
- [🔄 Updates & Changelog](#-updates--changelog)

---

> 🎯 **Access all 19 LeadMagic API endpoints through the Model Context Protocol for seamless integration with Claude, Cursor, Windsurf, Continue.dev, and other MCP-compatible AI tools.**

## 🚀 Super Easy Installation

### ⚡ Option 1: Interactive Installer (Recommended)

The easiest way to get started - works on **macOS**, **Windows**, and **Linux**:

```bash
# 🔥 Using npx (no installation required)
npx leadmagic-mcp-server install

# 📦 Or install globally first
npm install -g leadmagic-mcp-server
leadmagic-mcp-install
```

**✨ The installer will:**
- ✅ Help you get your LeadMagic API key
- ✅ Automatically configure your preferred AI tool
- ✅ Create all necessary config files
- ✅ Provide usage examples and documentation

### 📱 Option 2: Quick Manual Setup

For specific tools, use these one-liner configs:

#### 🤖 Claude Desktop
```bash
# 🍎 macOS/Linux
echo '{"mcpServers":{"leadmagic":{"command":"leadmagic-mcp-server","env":{"LEADMAGIC_API_KEY":"your-key-here"}}}}' > ~/.config/claude/claude_desktop_config.json

# 🪟 Windows
echo '{"mcpServers":{"leadmagic":{"command":"leadmagic-mcp-server","env":{"LEADMAGIC_API_KEY":"your-key-here"}}}}' > "%APPDATA%\Claude\claude_desktop_config.json"
```

#### 🎯 Cursor (Cline Extension)
Add to your Cursor `settings.json`:
```json
{
  "cline.mcpServers": {
    "leadmagic": {
      "command": "leadmagic-mcp-server",
      "env": {
        "LEADMAGIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

#### 🏄 Windsurf
Add to your Windsurf `settings.json`:
```json
{
  "mcpServers": {
    "leadmagic": {
      "command": "leadmagic-mcp-server",
      "env": {
        "LEADMAGIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

#### 🔄 Continue.dev
Add to your `~/.continue/config.json`:
```json
{
  "mcpServers": [{
    "name": "leadmagic",
    "command": "leadmagic-mcp-server",
    "env": {
      "LEADMAGIC_API_KEY": "your-key-here"
    }
  }]
}
```

#### 💻 VS Code (Cline/Continue Extensions)
Add to your VS Code `settings.json`:
```json
{
  "cline.mcpServers": {
    "leadmagic": {
      "command": "leadmagic-mcp-server",
      "env": {
        "LEADMAGIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

#### ⚡ Zed Editor
Add to your Zed `settings.json`:
```json
{
  "mcpServers": {
    "leadmagic": {
      "command": "leadmagic-mcp-server",
      "env": {
        "LEADMAGIC_API_KEY": "your-key-here"
      }
    }
  }
}
```

### 🔑 Get Your API Key

1. 🌐 Visit [LeadMagic Dashboard](https://app.leadmagic.io/dashboard/api-keys)
2. 📝 Sign up for free (if needed)
3. 🔐 Generate your API key
4. 🔄 Replace `your-key-here` in the configs above

### ⚡ npx Usage (Zero Installation)

You can use the server without installing:

```bash
# 🚀 Run directly with your API key
LEADMAGIC_API_KEY=your-key npx leadmagic-mcp-server

# 📋 Run the interactive installer
npx leadmagic-mcp-server install

# ❓ Check available commands
npx leadmagic-mcp-server --help
```

---

## 🛠️ Available Tools

### 📊 Core Operations (3 tools)
- 💳 `get_credits` - Check API credit balance
- ✅ `validate_email` - Validate email deliverability and get company info
- 📧 `find_email` - Find verified email addresses by name and company

### 🏢 Profile & Company Intelligence (5 tools)  
- 👤 `search_profile` - Get full LinkedIn profile details (300 req/min)
- 🏭 `search_company` - Search companies by domain, name, or profile URL
- 📱 `find_mobile` - Find mobile phone numbers from profiles/emails
- 🔗 `email_to_profile` - Find B2B profile URLs from work emails
- 💰 `get_company_funding` - Get funding, financials, and competitor data

### ✉️ Advanced Email Finding (2 tools)
- 📨 `find_personal_email` - Find personal emails from B2B profiles
- 🔄 `social_to_work_email` - Find work emails from social profiles

### 💼 Job & Employee Intelligence (5 tools)
- 🔍 `find_jobs` - Search job postings with advanced filters
- 👔 `find_role` - Find specific roles within companies
- 👥 `find_employees` - Find employees of specific companies  
- 🌍 `get_job_countries` - Get available job search countries
- 📋 `get_job_types` - Get available job types for filtering

### 📱 Advertisement Intelligence (4 tools)
- 🔍 `search_google_ads` - Search Google Ads by company
- 📘 `search_meta_ads` - Search Meta (Facebook/Instagram) Ads
- 📈 `search_b2b_ads` - Search B2B advertising campaigns
- 📄 `get_b2b_ad_details` - Get detailed B2B ad information

---

## 💡 Usage Examples

Once installed, you can use natural language commands in your AI tool:

### 📧 Email Operations
```
"Find the email for John Doe at Microsoft"
"Validate the email john@acme.com" 
"Find personal email for LinkedIn profile https://linkedin.com/in/johndoe"
```

### 🏢 Company Intelligence  
```
"Search for Tesla company information"
"Get funding information for Stripe"
"Find employees at OpenAI who work in engineering"
```

### 💼 Job & Recruitment
```
"Find software engineer jobs at tech companies"
"Search for product manager roles in San Francisco"
"Find mobile number for this LinkedIn profile"
```

### 📱 Competitive Analysis
```
"Search for Google Ads from competitor.com"
"Find Meta ads for company XYZ"
"Get B2B advertising campaigns for stripe.com"
```

---

## 🔧 Development Setup

### 📋 Prerequisites
- 📦 Node.js 18.0.0 or higher
- 🔑 LeadMagic API key from [leadmagic.io](https://leadmagic.io)

### 💻 Local Development

```bash
# 📥 Clone the repository
git clone https://github.com/LeadMagic/leadmagic-mcp.git
cd leadmagic-mcp

# 📦 Install dependencies
npm install

# 🔐 Create environment file
echo "LEADMAGIC_API_KEY=your-api-key-here" > .env

# 🚀 Start development server
npm run dev

# 🏗️ Build for production
npm run build

# ✅ Run validation
npm run validate
```

### 🔍 Testing with MCP Inspector

```bash
# 🚀 Start the MCP inspector
npm run inspector

# 🌐 Open the provided URL in your browser to test all tools
```

---

## 🌐 Supported MCP Clients

| Client | Installation | Status | Notes |
|--------|-------------|--------|-------|
| 🤖 **Claude Desktop** | Interactive installer or manual config | ✅ Fully Supported | Official Anthropic client |
| 🎯 **Cursor (Cline)** | Interactive installer or VS Code settings | ✅ Fully Supported | Requires Cline extension |
| 🏄 **Windsurf** | Interactive installer or manual config | ✅ Fully Supported | Codeium's AI IDE |
| 🔄 **Continue.dev** | Interactive installer or config file | ✅ Fully Supported | Open source coding assistant |
| 💻 **VS Code (Cline)** | VS Code settings.json | ✅ Fully Supported | Requires Cline extension |
| 💻 **VS Code (Continue)** | Continue extension config | ✅ Fully Supported | Requires Continue extension |
| ⚡ **Zed Editor** | Interactive installer or settings | ✅ Fully Supported | Modern code editor |
| 🤖 **Aider** | Command line with MCP support | ✅ Supported | AI pair programming |
| 🔗 **Any MCP Client** | Manual configuration | ✅ Supported | Standard MCP protocol |

---

## 🏗️ Architecture

### 🛠️ Technology Stack
- ⚡ **Runtime**: Node.js 18+
- 📘 **Language**: TypeScript with strict type checking
- 🔌 **MCP SDK**: @modelcontextprotocol/sdk v1.0.0+  
- 🌐 **HTTP Client**: Axios with comprehensive error handling
- ✅ **Validation**: Zod schemas for all API inputs/outputs
- 🔧 **Development**: ESLint, Prettier, Jest for testing

### 📁 Project Structure
```
├── src/
│   ├── index.ts        # 🚀 Main entry point and server startup
│   ├── server.ts       # 🔌 MCP server implementation with all 19 tools
│   ├── client.ts       # 🌐 LeadMagic API client wrapper  
│   └── types.ts        # 📝 TypeScript types and Zod schemas
├── install.js          # 🛠️ Interactive installer script
├── dist/               # 📦 Compiled JavaScript output
├── .env.example        # 🔐 Environment configuration example
└── README.md           # 📚 This file
```

---

## 📊 API Reference

### 🔤 Field Naming Convention
**All fields use snake_case** (matching LeadMagic API):
```json
{
  "first_name": "John",
  "company_name": "Acme Corp",
  "email_status": "valid"
}
```

### 🔐 Authentication
Include your API key in requests:
```bash
X-API-Key: your-leadmagic-api-key
```

### ⏱️ Rate Limits
- 👤 **Profile Search**: 300 requests/minute
- 📊 **Other endpoints**: Standard rate limits apply

### ❌ Error Handling
Consistent error format across all endpoints:
```json
{
  "error": "Bad Request", 
  "message": "API key is missing or invalid."
}
```

---

## 📈 Credit Consumption

| Endpoint | Credits | Notes |
|----------|---------|--------|
| 💳 `/credits` | 0 | Free to check |
| ✅ `/email-validate` | 0.05 | Very cost-effective |
| 📧 `/email-finder` | 1 | Standard rate |
| 📱 `/mobile-finder` | 5 | Only if found |
| 👤 `/profile-search` | 1 | Rate limited (300/min) |
| 🔗 `/b2b-profile` | 10 | Higher cost for reverse lookup |
| 💰 `/company-funding` | 4 | Premium intelligence |
| 💼 `/jobs-finder` | 1 per job | Based on results |
| 🔍 `/google/searchads` | 1 per ad | Based on ads found |
| 📊 All others | 1-2 | Standard rates |

---

## 🔒 Security & Best Practices

✅ **No API keys in code** - Always use environment variables  
✅ **Type-safe requests** - Full TypeScript coverage with Zod validation  
✅ **Error handling** - Comprehensive error catching and user-friendly messages  
✅ **Rate limiting** - Respects LeadMagic API rate limits  
✅ **Secure defaults** - Production-ready configuration out of the box  
✅ **Interactive installer** - No manual config file editing required

---

## 🎯 Installation Matrix

Choose your installation method based on your setup:

| Scenario | Command | Best For |
|----------|---------|----------|
| 🆕 **First time user** | `npx leadmagic-mcp-server install` | Easiest setup |
| 🤖 **Claude Desktop** | Interactive installer → Option 1 | Most popular |
| 🎯 **Cursor/VS Code** | Interactive installer → Option 2/5 | Developers |
| 🔄 **Multiple clients** | Interactive installer → Option 7 | Power users |
| ⚡ **Quick test** | `LEADMAGIC_API_KEY=key npx leadmagic-mcp-server` | Testing |
| 💻 **Local development** | Clone repo + `.env` file | Contributors |

---

## 🤝 Support & Resources

- 📚 **API Documentation**: [docs.leadmagic.io](https://docs.leadmagic.io)
- 🌐 **Official Website**: [leadmagic.io](https://leadmagic.io)  
- 📊 **Dashboard**: [app.leadmagic.io](https://app.leadmagic.io)
- 🆘 **Support**: support@leadmagic.io
- 🐛 **Issues**: [GitHub Issues](https://github.com/LeadMagic/leadmagic-mcp/issues)
- 💬 **Community**: [Join our Discord](https://discord.gg/leadmagic)
- 🐙 **Source Code**: [GitHub Repository](https://github.com/LeadMagic/leadmagic-mcp)

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♀️ Contributing

We welcome contributions! Here's how to get started:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/new-feature`
3. ✨ Make your changes and add tests
4. ✅ Run validation: `npm run validate`
5. 💾 Commit your changes: `git commit -am 'Add new feature'`
6. 📤 Push to the branch: `git push origin feature/new-feature`
7. 🔄 Submit a pull request

### 🐛 Bug Reports
Found a bug? Please [open an issue](https://github.com/LeadMagic/leadmagic-mcp/issues/new?assignees=&labels=bug&template=bug_report.md&title=) with:
- 📝 Clear description of the issue
- 🔄 Steps to reproduce
- 💻 Your environment details
- 📋 Expected vs actual behavior

### 💡 Feature Requests
Have an idea? [Request a feature](https://github.com/LeadMagic/leadmagic-mcp/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=) with:
- 📖 Clear description of the feature
- 🎯 Use case and benefits
- 💭 Any implementation ideas

---

## 🔄 Updates & Changelog

### v1.0.0 (Latest) - January 2025
- ✨ Interactive installer for all major AI tools
- ✅ Support for Claude Desktop, Cursor, Windsurf, Continue.dev, VS Code, Zed
- 🔧 All 19 LeadMagic API endpoints implemented
- 🎯 Zero-config npx usage
- 🔒 Enhanced security and error handling
- 📚 Comprehensive documentation

[View complete changelog](CHANGELOG.md)

---

<div align="center">

**🎉 Built with the [official LeadMagic OpenAPI specification](https://github.com/LeadMagic/leadmagic-openapi) for 100% API accuracy**

---

### 🌟 Star us on GitHub • 🐛 Report Issues • 💡 Request Features

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LeadMagic/leadmagic-mcp)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/leadmagic-mcp-server)
[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/leadmagic)

**Made with ❤️ by the LeadMagic team**

</div> 