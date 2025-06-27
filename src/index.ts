#!/usr/bin/env node

import { config } from 'dotenv';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LeadMagicMCPServer } from './server.js';

// Load environment variables
config();

async function main() {
  const apiKey = process.env.LEADMAGIC_API_KEY;
  
  if (!apiKey) {
    console.error('Error: LEADMAGIC_API_KEY environment variable is required');
    console.error('Please set your LeadMagic API key:');
    console.error('export LEADMAGIC_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  try {
    // Create and start the MCP server
    const mcpServer = new LeadMagicMCPServer(apiKey);
    const server = mcpServer.getServer();
    
    // Connect to stdin/stdout for MCP communication
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('LeadMagic MCP Server started successfully');
    console.error('Available tools: 19 LeadMagic API endpoints');
    console.error('Ready for MCP client connections...');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('Received SIGINT, shutting down gracefully...');
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('Received SIGTERM, shutting down gracefully...');
      await server.close();
      process.exit(0);
    });

    // Keep the process running
    await transport;
  } catch (error) {
    console.error('Failed to start LeadMagic MCP Server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 