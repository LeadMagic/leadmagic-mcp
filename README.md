# LeadMagic MCP Server

🎯 **Production-ready Model Context Protocol (MCP) server for LeadMagic's complete B2B data enrichment API suite**

[![npm version](https://badge.fury.io/js/leadmagic-mcp-server.svg)](https://badge.fury.io/js/leadmagic-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> Access all 19 LeadMagic API endpoints through the Model Context Protocol for seamless integration with Claude, Cline, and other MCP-compatible AI tools.

## 🚀 Quick Start

### 1. Install

```bash
# Global installation (recommended)
npm install -g leadmagic-mcp-server

# Or using npx (no installation required)
npx leadmagic-mcp-server
```

### 2. Get Your API Key

Get your free API key from [LeadMagic Dashboard](https://app.leadmagic.io/dashboard/api-keys)

### 3. Configure Claude Desktop

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "leadmagic": {
      "command": "leadmagic-mcp-server",
      "env": {
        "LEADMAGIC_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 4. Restart Claude Desktop

That's it! 🎉 You now have access to all 19 LeadMagic tools in Claude.

---

## 🛠️ Available Tools

### 📊 Core Operations (3 tools)
- `get_credits` - Check API credit balance
- `validate_email` - Validate email deliverability and get company info
- `find_email` - Find verified email addresses by name and company

### 🏢 Profile & Company Intelligence (5 tools)  
- `search_profile` - Get full LinkedIn profile details (300 req/min)
- `search_company` - Search companies by domain, name, or profile URL
- `find_mobile` - Find mobile phone numbers from profiles/emails
- `email_to_profile` - Find B2B profile URLs from work emails
- `get_company_funding` - Get funding, financials, and competitor data

### ✉️ Advanced Email Finding (2 tools)
- `find_personal_email` - Find personal emails from B2B profiles
- `social_to_work_email` - Find work emails from social profiles

### 💼 Job & Employee Intelligence (5 tools)
- `find_jobs` - Search job postings with advanced filters
- `find_role` - Find specific roles within companies
- `find_employees` - Find employees of specific companies  
- `get_job_countries` - Get available job search countries
- `get_job_types` - Get available job types for filtering

### 📱 Advertisement Intelligence (4 tools)
- `search_google_ads` - Search Google Ads by company
- `search_meta_ads` - Search Meta (Facebook/Instagram) Ads
- `search_b2b_ads` - Search B2B advertising campaigns
- `get_b2b_ad_details` - Get detailed B2B ad information

---

## 💡 Usage Examples

### Email Discovery & Validation
```
Hey Claude, validate the email john.doe@acme.com and if it's valid, find the mobile number for this person.
```

### Company Intelligence  
```
Claude, search for information about Tesla including their funding, competitors, and current job openings.
```

### Lead Generation
```
Find employees at Microsoft who work in "Product Management" roles and get their contact information.
```

### Competitive Analysis
```
Analyze OpenAI's advertising strategy by searching their Google Ads, Meta Ads, and B2B advertising campaigns.
```

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- LeadMagic API key from [leadmagic.io](https://leadmagic.io)

### Local Development

```bash
# Clone the repository
git clone https://github.com/LeadMagic/leadmagic-mcp.git
cd leadmagic-mcp

# Install dependencies
npm install

# Create environment file
echo "LEADMAGIC_API_KEY=your-api-key-here" > .env

# Start development server
npm run dev

# Build for production
npm run build

# Run validation
npm run validate
```

### Testing with MCP Inspector

```bash
# Start the MCP inspector
npm run inspector

# Open the provided URL in your browser to test all tools
```

---

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js 18+
- **Language**: TypeScript with strict type checking
- **MCP SDK**: @modelcontextprotocol/sdk v1.0.0+  
- **HTTP Client**: Axios with comprehensive error handling
- **Validation**: Zod schemas for all API inputs/outputs
- **Development**: ESLint, Prettier, Jest for testing

### Project Structure
```
├── src/
│   ├── index.ts        # Main entry point and server startup
│   ├── server.ts       # MCP server implementation with all 19 tools
│   ├── client.ts       # LeadMagic API client wrapper  
│   └── types.ts        # TypeScript types and Zod schemas
├── dist/               # Compiled JavaScript output
├── .env.example        # Environment configuration example
└── README.md           # This file
```

---

## 🔒 Security & Best Practices

✅ **No API keys in code** - Always use environment variables  
✅ **Type-safe requests** - Full TypeScript coverage with Zod validation  
✅ **Error handling** - Comprehensive error catching and user-friendly messages  
✅ **Rate limiting** - Respects LeadMagic API rate limits  
✅ **Secure defaults** - Production-ready configuration out of the box  

---

## 📊 API Reference

### Field Naming Convention
**All fields use snake_case** (matching LeadMagic API):
```json
{
  "first_name": "John",
  "company_name": "Acme Corp",
  "email_status": "valid"
}
```

### Authentication
Include your API key in requests:
```bash
X-API-Key: your-leadmagic-api-key
```

### Rate Limits
- **Profile Search**: 300 requests/minute
- **Other endpoints**: Standard rate limits apply

### Error Handling
Consistent error format across all endpoints:
```json
{
  "error": "Bad Request", 
  "message": "API key is missing or invalid."
}
```

---

## 🌐 Other MCP Clients

While this guide focuses on Claude Desktop, this MCP server works with any MCP-compatible client:

### Cline (VS Code)
Add to your Cline configuration:
```json
{
  "mcpServers": {
    "leadmagic": {
      "command": "leadmagic-mcp-server",
      "env": {
        "LEADMAGIC_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Custom Implementations
Use directly with the MCP SDK:
```typescript
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LeadMagicMCPServer } from 'leadmagic-mcp-server';

const server = new LeadMagicMCPServer(process.env.LEADMAGIC_API_KEY);
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 📈 Credit Consumption

| Endpoint | Credits | Notes |
|----------|---------|--------|
| `/credits` | 0 | Free to check |
| `/email-validate` | 0.05 | Very cost-effective |
| `/email-finder` | 1 | Standard rate |
| `/mobile-finder` | 5 | Only if found |
| `/profile-search` | 1 | Rate limited (300/min) |
| `/b2b-profile` | 10 | Higher cost for reverse lookup |
| `/company-funding` | 4 | Premium intelligence |
| `/jobs-finder` | 1 per job | Based on results |
| `/google/searchads` | 1 per ad | Based on ads found |
| All others | 1-2 | Standard rates |

---

## 🤝 Support & Resources

- **📚 API Documentation**: [docs.leadmagic.io](https://docs.leadmagic.io)
- **🌐 Official Website**: [leadmagic.io](https://leadmagic.io)  
- **📊 Dashboard**: [app.leadmagic.io](https://app.leadmagic.io)
- **🆘 Support**: support@leadmagic.io
- **🐛 Issues**: [GitHub Issues](https://github.com/LeadMagic/leadmagic-mcp/issues)

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♀️ Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run validation: `npm run validate`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

---

**🎉 Built with the [official LeadMagic OpenAPI specification](https://github.com/LeadMagic/leadmagic-openapi) for 100% API accuracy** 