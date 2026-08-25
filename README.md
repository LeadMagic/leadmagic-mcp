[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/leadmagic-leadmagic-mcp-badge.png)](https://mseep.ai/app/leadmagic-leadmagic-mcp)

# 🚀 LeadMagic MCP Server

> [!IMPORTANT]
> **This local MCP server is deprecated.** LeadMagic now ships a **hosted MCP server** with OAuth sign-in (no API keys in your client) and the full current tool surface — people/company/jobs search, enrichment, ads research, and bulk:
>
> **`https://mcp.leadmagic.io/mcp`**
>
> - Setup for every client (Claude, Claude Code, ChatGPT, Codex, Cursor, and more): [leadmagic.io/docs/mcp/setup](https://leadmagic.io/docs/mcp/setup)
> - Agent skills: [`npx skills add LeadMagic/leadmagic-skills`](https://github.com/LeadMagic/leadmagic-skills)
> - Claude Code plugin: [LeadMagic/leadmagic-claude-plugin](https://github.com/LeadMagic/leadmagic-claude-plugin) · Cursor plugin: [LeadMagic/leadmagic-cursor-plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin)
>
> The npm package below still works against the REST API with an `X-API-Key`, but it is no longer maintained and misses newer tools. Please migrate to the hosted server.

<div align="center">

![LeadMagic MCP Server](https://img.shields.io/badge/🎯-LeadMagic%20MCP%20Server-blue?style=for-the-badge&labelColor=000000)

**⚡ The Ultimate Model Context Protocol Server for B2B Data Enrichment**

*Seamlessly integrate LeadMagic's complete API suite with Claude, Cursor, Windsurf, and all MCP-compatible AI tools*

[![npm version](https://img.shields.io/npm/v/leadmagic-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/leadmagic-mcp-server)
[![Downloads](https://img.shields.io/npm/dm/leadmagic-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=brightgreen)](https://www.npmjs.com/package/leadmagic-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensource&logoColor=white)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue?style=for-the-badge&logo=protocol&logoColor=white)](https://modelcontextprotocol.io)
[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/LeadMagic/leadmagic-mcp)
[![Security](https://img.shields.io/badge/Security-Verified-green?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/LeadMagic/leadmagic-mcp/security)

[![GitHub Stars](https://img.shields.io/github/stars/LeadMagic/leadmagic-mcp?style=for-the-badge&logo=github&logoColor=white&color=yellow)](https://github.com/LeadMagic/leadmagic-mcp/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/LeadMagic/leadmagic-mcp?style=for-the-badge&logo=github&logoColor=white&color=red)](https://github.com/LeadMagic/leadmagic-mcp/issues)
[![GitHub Forks](https://img.shields.io/github/forks/LeadMagic/leadmagic-mcp?style=for-the-badge&logo=github&logoColor=white&color=blue)](https://github.com/LeadMagic/leadmagic-mcp/network/members)
[![Last Commit](https://img.shields.io/github/last-commit/LeadMagic/leadmagic-mcp?style=for-the-badge&logo=git&logoColor=white&color=orange)](https://github.com/LeadMagic/leadmagic-mcp/commits/main)

---

**🎯 19 Powerful Tools • 🔥 Zero Configuration • ⚡ One-Line Setup • 🛡️ Enterprise Security**

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

The easiest way to get started - works on **macOS**, **Windows**, and **Linux**. Our new interactive installer, built with React and Ink, makes setup a breeze.

```bash
# 🔥 Using npx (no installation required)
npx leadmagic-mcp-server install
```

**✨ The installer will:**
- ✅ **Validate your API key** in real-time and show your remaining credits.
- ✅ Automatically detect and configure your preferred AI tool (Claude, Cursor, VS Code, etc.).
- ✅ Create all necessary config files and a local `.env` for development.
- ✅ Provide usage examples and helpful links.

### 📱 Option 2: Quick Manual Setup

If you prefer manual setup or are using a client like **Aider**, you can add the server configuration directly to your client's settings file. The interactive installer provides copy-pasteable snippets for this.

Run the installer and choose the "Other (Manual Setup)" option:
```bash
npx leadmagic-mcp-server install
```

### 🔑 Get Your API Key

1. 🌐 Visit [LeadMagic Dashboard](https://app.leadmagic.io/dashboard/api-keys)
2. 📝 Sign up for free (if needed)
3. 🔐 Generate your API key
4. 📋 Paste it into the interactive installer when prompted.

### ⚡ npx Usage (Zero Installation)

You can use the server without installing, which is great for quick tests or containerized environments:

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
- 👤 `search_profile` - Get full B2B profile details (300 req/min)
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
"Find personal email for B2B profile https://linkedin.com/in/johndoe"
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
"Find mobile number for this B2B profile"
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
| 🤖 **Aider** | Manual Configuration | ✅ Supported | AI pair programming in your terminal |
| ✨ **Augment Code** | Manual Configuration | ✅ Supported | AI coding assistant |
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
│   ├── index.ts        # 🚀 Main entry point and CLI command handling
│   ├── server.ts       # 🔌 MCP server implementation with all 19 tools
│   ├── client.ts       # 🌐 LeadMagic API client wrapper  
│   ├── types.ts        # 📝 TypeScript types and Zod schemas
│   └── install.tsx     # 🎨 The new interactive installer (React/Ink)
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

### v1.0.1 (Latest) - June 27, 2025
- 🎨 Redesigned README with professional and impactful header
- 📦 Enhanced package.json with better description and keywords  
- 🎯 Improved branding and visual presentation
- 🔧 Documentation polish and terminology consistency
- 🏷️ Added enhanced badges with security verification
- 📚 Overall professional presentation improvements

### v1.0.0 - June 27, 2025
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