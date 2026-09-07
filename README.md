# LeadMagic MCP Server: Local B2B Data Enrichment Tools

A TypeScript stdio MCP server that connects AI clients to a subset of the LeadMagic B2B enrichment API. It provides 19 tools for email discovery and validation, people and company enrichment, job research, advertising data, and credits.

[LeadMagic B2B enrichment](https://leadmagic.io?utm_source=github&utm_medium=readme&utm_campaign=leadmagic-mcp&utm_content=readme-intro) · [MCP setup guide](https://leadmagic.io/docs/mcp/setup?utm_source=github&utm_medium=readme&utm_campaign=leadmagic-mcp&utm_content=readme-intro) · [Pricing and credits](https://leadmagic.io/pricing?utm_source=github&utm_medium=readme&utm_campaign=leadmagic-mcp&utm_content=readme-intro)

For the current hosted experience, use **[LeadMagic hosted MCP](https://leadmagic.io/docs/mcp/setup?utm_source=github&utm_medium=readme&utm_campaign=leadmagic-mcp&utm_content=readme-intro)** at `https://mcp.leadmagic.io/mcp` with OAuth. The [Cursor plugin](https://github.com/LeadMagic/leadmagic-cursor-plugin) and [Claude Code plugin](https://github.com/LeadMagic/leadmagic-claude-plugin) configure that service.

## Local installation

Use this package when your client needs a local stdio process and you intend to manage a REST API key. It does not provide the hosted server's complete search, bulk, or OAuth feature set.

```bash
npm ci --ignore-scripts
npm run build
# Set LEADMAGIC_API_KEY securely in your shell or secret manager first.
node dist/index.js
```

Configure your MCP client to launch `node` with the absolute path to `dist/index.js` and provide `LEADMAGIC_API_KEY` through the client's secret or environment mechanism. Do not commit literal keys. Source changes here do not update already published npm packages.

## API behavior

- REST calls use `https://api.leadmagic.io`, documented `/v1/` routes, and `X-API-Key`.
- Credits use `GET /v1/credits` and consume no credits.
- HTTP failures are returned as errors; redirects are rejected to avoid forwarding credentials.
- Diagnostics go to stderr and omit API-key fragments and upstream error payloads.
- Requests time out after 30 seconds by default. Paid requests are not automatically retried.
- Email Finder returns validated work emails. Validate externally sourced emails separately.

See [API documentation](https://leadmagic.io/docs?utm_source=github&utm_medium=readme&utm_campaign=leadmagic-mcp&utm_content=readme-api-behavior) and [credit costs](https://leadmagic.io/docs/v1/credits?utm_source=github&utm_medium=readme&utm_campaign=leadmagic-mcp&utm_content=readme-api-behavior). Tool and package changes should be tested with a small, authorized sample before production use.

## Development

```bash
npm ci --ignore-scripts
npm run validate
npm test
```

Tests use a mocked HTTP adapter and do not consume credits.

## Security and support

Report vulnerabilities privately to [security@leadmagic.io](mailto:security@leadmagic.io). Use [GitHub issues](https://github.com/LeadMagic/leadmagic-mcp/issues) for sanitized bug reports. Never include keys, request headers, or customer data.

MIT licensed.

## Public examples and publication

Examples are fictional unless an explicit public source is cited. See [PUBLICATION.md](PUBLICATION.md) for data, claims, attribution, and disclosure requirements.

## Related LeadMagic projects

- [Hosted MCP for Cursor](https://github.com/LeadMagic/leadmagic-cursor-plugin)
- [Hosted MCP for Claude Code](https://github.com/LeadMagic/leadmagic-claude-plugin)
- [REST API schema](https://github.com/LeadMagic/leadmagic-openapi)

## License and contributions

[MIT license](LICENSE) · [Third-party materials and contribution policy](LICENSE-NOTES.md). Reuse is allowed under the license; changes to this repository require maintainer review.
