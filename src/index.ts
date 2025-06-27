#!/usr/bin/env node

/**
 * LeadMagic MCP Server
 * 
 * Main entry point for the LeadMagic Model Context Protocol server.
 * Provides access to all 19 LeadMagic API endpoints through the MCP protocol.
 */

import dotenv from 'dotenv';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createLeadMagicServer } from './server.js';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handle command line arguments
const args = process.argv.slice(2);

// Handle install command
if (args.includes('install') || args.includes('--install')) {
  try {
    const installPath = join(__dirname, '..', 'install.js');
    execSync(`node "${installPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Installation failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
  process.exit(0);
}

// Handle help command
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🎯 LeadMagic MCP Server v1.0.0

Usage:
  leadmagic-mcp-server                    - Start the MCP server
  leadmagic-mcp-server install            - Run interactive installer
  leadmagic-mcp-server --help             - Show this help message
  leadmagic-mcp-server --version          - Show version information

Environment Variables:
  LEADMAGIC_API_KEY                       - Your LeadMagic API key (required)
  LEADMAGIC_BASE_URL                      - Custom API base URL (optional)
  LEADMAGIC_TIMEOUT                       - Request timeout in ms (optional)
  DEBUG                                   - Enable debug logging (optional)

Examples:
  # Start server with environment variable
  LEADMAGIC_API_KEY=your-key leadmagic-mcp-server
  
  # Run via npx
  npx leadmagic-mcp-server install
  
  # Start server via npx
  LEADMAGIC_API_KEY=your-key npx leadmagic-mcp-server

Get your API key: https://app.leadmagic.io/dashboard/api-keys
Documentation: https://github.com/LeadMagic/leadmagic-mcp
`);
  process.exit(0);
}

// Handle version command
if (args.includes('--version') || args.includes('-v')) {
  console.log('leadmagic-mcp-server v1.0.0');
  process.exit(0);
}

async function main() {
  try {
    // Check for API key
    const apiKey = process.env.LEADMAGIC_API_KEY;
    
    if (!apiKey) {
      console.error(`
❌ LeadMagic API key not found!

Please set your API key using one of these methods:

1. Environment variable:
   export LEADMAGIC_API_KEY=your-api-key-here
   
2. .env file:
   echo "LEADMAGIC_API_KEY=your-api-key-here" > .env
   
3. Interactive installer:
   npx leadmagic-mcp-server install

Get your free API key at: https://app.leadmagic.io/dashboard/api-keys
`);
      process.exit(1);
    }

    // Create and start the server
    const server = createLeadMagicServer(apiKey);
    const transport = new StdioServerTransport();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('\n🛑 Received SIGINT, shutting down gracefully...');
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('\n🛑 Received SIGTERM, shutting down gracefully...');
      await server.close();
      process.exit(0);
    });

    // Start the server
    console.error('🚀 Starting LeadMagic MCP Server...');
    console.error(`🔑 API Key: ${apiKey.substring(0, 8)}...`);
    console.error('📡 Server ready - all 19 LeadMagic tools available!');
    
    await server.connect(transport);
    
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 