# Changelog

All notable changes to the LeadMagic MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-27

### ✨ Added

#### Complete API Coverage
- **All 19 LeadMagic API endpoints** fully implemented and tested
- Email validation and finding capabilities
- Profile and company search functionality  
- Mobile number discovery
- Job and employee intelligence
- Company funding and financial data
- Advertisement intelligence (Google, Meta, B2B)
- Complete type safety with Zod schemas

#### Universal MCP Client Support
- **Interactive installer** for easy setup across all platforms
- **Claude Desktop** - Official Anthropic client support
- **Cursor** - Cline extension integration
- **Windsurf** - Codeium's AI IDE support
- **Continue.dev** - Open source coding assistant
- **VS Code** - Cline and Continue extension support
- **Zed Editor** - Modern code editor integration
- **Any MCP-compatible client** - Standard protocol support

#### Developer Experience
- **Zero-config npx usage** - Run without installation
- **TypeScript-first** with strict type checking
- **Comprehensive error handling** with user-friendly messages
- **Production-ready configuration** out of the box
- **Automatic config detection** for multiple platforms
- **Interactive CLI** with colored output and clear instructions

#### API Features
- **Rate limiting compliance** with LeadMagic API limits
- **Comprehensive validation** using Zod schemas
- **Error recovery** and retry logic
- **Secure credential handling** via environment variables
- **Request/response logging** for debugging
- **Custom timeout configuration**

#### Documentation & Testing
- **Complete README** with installation matrix
- **API reference** with credit consumption details
- **Usage examples** for all 19 endpoints
- **Live API validation** with real endpoint testing
- **MCP inspector support** for development
- **Security best practices** documentation

#### Distribution & Installation
- **npm package** ready for global distribution
- **GitHub repository** with complete source code
- **Interactive installer binary** (`leadmagic-mcp-install`)
- **Environment templates** (.env.example)
- **Cross-platform support** (macOS, Windows, Linux)

### 🛠️ Technical Details

#### Architecture
- **Node.js 18+** runtime support
- **ES modules** with modern JavaScript
- **MCP SDK v1.0.0+** for protocol compliance
- **Axios HTTP client** with comprehensive error handling
- **Zod validation** for all API inputs and outputs
- **ESLint & Prettier** for code quality

#### API Endpoints Implemented
1. **Credits Management**
   - `get_credits` - Check API credit balance

2. **Email Operations** 
   - `validate_email` - Email deliverability validation
   - `find_email` - Find verified email addresses
   - `find_personal_email` - Personal email discovery
   - `social_to_work_email` - Work email from social profiles

3. **Profile & Company Intelligence**
   - `search_profile` - LinkedIn profile enrichment (300 req/min)
   - `search_company` - Company data enrichment
   - `email_to_profile` - B2B profile URLs from emails
   - `get_company_funding` - Funding, financials, competitors

4. **Contact Discovery**
   - `find_mobile` - Mobile phone number finder

5. **Job & Employee Intelligence**
   - `find_jobs` - Job posting search with filters
   - `find_role` - Specific role/position finder
   - `find_employees` - Company employee discovery
   - `get_job_countries` - Available job search countries
   - `get_job_types` - Available job types for filtering

6. **Advertisement Intelligence**
   - `search_google_ads` - Google Ads search
   - `search_meta_ads` - Meta (Facebook/Instagram) Ads
   - `search_b2b_ads` - B2B advertising campaigns
   - `get_b2b_ad_details` - Detailed B2B ad information

### 🔒 Security Features
- **No API keys in code** - Environment variable only
- **Secure configuration** - Automatic .gitignore setup
- **Input validation** - All requests validated with Zod
- **Error sanitization** - No sensitive data in error messages
- **Rate limiting respect** - Complies with API limits

### 📊 Credit Consumption Reference
| Endpoint | Credits | Notes |
|----------|---------|-------|
| `/credits` | 0 | Free balance check |
| `/email-validate` | 0.05 | Very cost-effective |
| `/email-finder` | 1 | Standard rate |
| `/mobile-finder` | 5 | Only charged if found |
| `/profile-search` | 1 | Rate limited (300/min) |
| `/b2b-profile` | 10 | Higher cost for reverse lookup |
| `/company-funding` | 4 | Premium intelligence |
| `/jobs-finder` | 1 per job | Based on results |
| `/google/searchads` | 1 per ad | Based on ads found |
| All others | 1-2 | Standard rates |

### 🌐 Compatibility Matrix
| Platform | Installation Method | Status |
|----------|-------------------|---------|
| **macOS** | Interactive installer | ✅ Fully tested |
| **Windows** | Interactive installer | ✅ Fully tested |  
| **Linux** | Interactive installer | ✅ Fully tested |
| **Claude Desktop** | Auto-config | ✅ Production ready |
| **Cursor + Cline** | Auto-config | ✅ Production ready |
| **Windsurf** | Auto-config | ✅ Production ready |
| **Continue.dev** | Auto-config | ✅ Production ready |
| **VS Code** | Auto-config | ✅ Production ready |
| **Zed** | Auto-config | ✅ Production ready |

### 📝 Notes
- Built using the official [LeadMagic OpenAPI 3.1 specification](https://github.com/LeadMagic/leadmagic-openapi)
- 100% API accuracy with real-world testing
- Production deployment at [LeadMagic MCP GitHub](https://github.com/LeadMagic/leadmagic-mcp)
- Ready for npm publication and distribution

---

## Future Releases

### Planned Features
- Additional authentication methods
- Webhook support for real-time updates
- Batch processing capabilities  
- Advanced caching strategies
- Performance monitoring and analytics
- API rate limiting dashboard

---

*For support, issues, or feature requests, visit [GitHub Issues](https://github.com/LeadMagic/leadmagic-mcp/issues)* 