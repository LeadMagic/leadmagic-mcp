#!/usr/bin/env node

/**
 * LeadMagic MCP Server - Interactive Installer
 * 
 * This script helps users easily configure the LeadMagic MCP server
 * with their preferred MCP client (Claude Desktop, Cursor, Windsurf, Continue.dev, etc.)
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function getConfigPaths() {
  const platform = os.platform();
  const home = os.homedir();
  
  const paths = {
    claude: platform === 'darwin' 
      ? path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : platform === 'win32'
      ? path.join(home, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json')
      : path.join(home, '.config', 'claude', 'claude_desktop_config.json'),
      
    cursor: platform === 'darwin'
      ? path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json')
      : platform === 'win32'
      ? path.join(home, 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json')
      : path.join(home, '.config', 'Cursor', 'User', 'settings.json'),
      
    windsurf: platform === 'darwin'
      ? path.join(home, 'Library', 'Application Support', 'Windsurf', 'User', 'settings.json')
      : platform === 'win32'
      ? path.join(home, 'AppData', 'Roaming', 'Windsurf', 'User', 'settings.json')
      : path.join(home, '.config', 'Windsurf', 'User', 'settings.json'),
      
    continue: platform === 'darwin'
      ? path.join(home, '.continue', 'config.json')
      : platform === 'win32'
      ? path.join(home, '.continue', 'config.json')
      : path.join(home, '.continue', 'config.json'),
      
    vscode: platform === 'darwin'
      ? path.join(home, 'Library', 'Application Support', 'Code', 'User', 'settings.json')
      : platform === 'win32'
      ? path.join(home, 'AppData', 'Roaming', 'Code', 'User', 'settings.json')
      : path.join(home, '.config', 'Code', 'User', 'settings.json'),
      
    zed: platform === 'darwin'
      ? path.join(home, '.config', 'zed', 'settings.json')
      : platform === 'win32'
      ? path.join(home, 'AppData', 'Roaming', 'Zed', 'settings.json')
      : path.join(home, '.config', 'zed', 'settings.json')
  };
  
  return paths;
}

function promptForInput(question) {
  process.stdout.write(question + ' ');
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function getApiKey() {
  log('\n🔑 LeadMagic API Key Setup', 'cyan');
  log('Get your free API key at: https://app.leadmagic.io/dashboard/api-keys', 'blue');
  
  const apiKey = await promptForInput('\nEnter your LeadMagic API key:');
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    log('❌ Invalid API key. Please get a real API key from LeadMagic.', 'red');
    process.exit(1);
  }
  
  return apiKey;
}

function ensureConfigDir(configPath) {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

function readConfigSafely(configPath) {
  if (!fs.existsSync(configPath)) {
    return {};
  }
  
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    log(`⚠️  Existing config file is invalid, creating new one: ${configPath}`, 'yellow');
    return {};
  }
}

async function installForClaude(apiKey) {
  log('\n🤖 Configuring Claude Desktop...', 'blue');
  
  const configPath = getConfigPaths().claude;
  ensureConfigDir(configPath);
  
  let config = readConfigSafely(configPath);
  
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  config.mcpServers.leadmagic = {
    command: "leadmagic-mcp-server",
    env: {
      LEADMAGIC_API_KEY: apiKey
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  log('✅ Claude Desktop configured successfully!', 'green');
  log(`📁 Config saved to: ${configPath}`, 'blue');
  log('🔄 Please restart Claude Desktop to see the LeadMagic tools', 'yellow');
}

async function installForCursor(apiKey) {
  log('\n🎯 Configuring Cursor (Cline)...', 'blue');
  
  const configPath = getConfigPaths().cursor;
  ensureConfigDir(configPath);
  
  let config = readConfigSafely(configPath);
  
  // Add MCP server configuration for Cline extension
  if (!config["cline.mcpServers"]) {
    config["cline.mcpServers"] = {};
  }
  
  config["cline.mcpServers"].leadmagic = {
    command: "leadmagic-mcp-server",
    env: {
      LEADMAGIC_API_KEY: apiKey
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  log('✅ Cursor (Cline) configured successfully!', 'green');
  log(`📁 Config saved to: ${configPath}`, 'blue');
  log('🔄 Please restart Cursor to see the LeadMagic tools in Cline', 'yellow');
  log('📦 Make sure the Cline extension is installed from the marketplace', 'cyan');
}

async function installForWindsurf(apiKey) {
  log('\n🏄 Configuring Windsurf...', 'blue');
  
  const configPath = getConfigPaths().windsurf;
  ensureConfigDir(configPath);
  
  let config = readConfigSafely(configPath);
  
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  config.mcpServers.leadmagic = {
    command: "leadmagic-mcp-server",
    env: {
      LEADMAGIC_API_KEY: apiKey
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  log('✅ Windsurf configured successfully!', 'green');
  log(`📁 Config saved to: ${configPath}`, 'blue');
  log('🔄 Please restart Windsurf to see the LeadMagic tools', 'yellow');
}

async function installForContinue(apiKey) {
  log('\n🔄 Configuring Continue.dev...', 'blue');
  
  const configPath = getConfigPaths().continue;
  ensureConfigDir(configPath);
  
  let config = readConfigSafely(configPath);
  
  if (!config.mcpServers) {
    config.mcpServers = [];
  }
  
  // Remove existing LeadMagic server if present
  config.mcpServers = config.mcpServers.filter(server => server.name !== 'leadmagic');
  
  // Add LeadMagic MCP server
  config.mcpServers.push({
    name: "leadmagic",
    command: "leadmagic-mcp-server",
    env: {
      LEADMAGIC_API_KEY: apiKey
    }
  });
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  log('✅ Continue.dev configured successfully!', 'green');
  log(`📁 Config saved to: ${configPath}`, 'blue');
  log('🔄 Please restart your editor with Continue.dev extension', 'yellow');
}

async function installForVSCode(apiKey) {
  log('\n💻 Configuring VS Code (Cline/Continue)...', 'blue');
  
  const configPath = getConfigPaths().vscode;
  ensureConfigDir(configPath);
  
  let config = readConfigSafely(configPath);
  
  // For Cline extension in VS Code
  if (!config["cline.mcpServers"]) {
    config["cline.mcpServers"] = {};
  }
  
  config["cline.mcpServers"].leadmagic = {
    command: "leadmagic-mcp-server",
    env: {
      LEADMAGIC_API_KEY: apiKey
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  log('✅ VS Code configured successfully!', 'green');
  log(`📁 Config saved to: ${configPath}`, 'blue');
  log('🔄 Please restart VS Code to see the LeadMagic tools', 'yellow');
  log('📦 Make sure Cline or Continue extension is installed', 'cyan');
}

async function installForZed(apiKey) {
  log('\n⚡ Configuring Zed Editor...', 'blue');
  
  const configPath = getConfigPaths().zed;
  ensureConfigDir(configPath);
  
  let config = readConfigSafely(configPath);
  
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  config.mcpServers.leadmagic = {
    command: "leadmagic-mcp-server",
    env: {
      LEADMAGIC_API_KEY: apiKey
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  log('✅ Zed Editor configured successfully!', 'green');
  log(`📁 Config saved to: ${configPath}`, 'blue');
  log('🔄 Please restart Zed to see the LeadMagic tools', 'yellow');
}

async function createEnvFile(apiKey) {
  log('\n📝 Creating local .env file...', 'blue');
  
  const envContent = `# LeadMagic MCP Server Configuration
# Generated by installer on ${new Date().toISOString()}

LEADMAGIC_API_KEY=${apiKey}

# Optional: Custom API base URL (defaults to https://api.leadmagic.io)
# LEADMAGIC_BASE_URL=https://api.leadmagic.io

# Optional: Request timeout in milliseconds (defaults to 30000)
# LEADMAGIC_TIMEOUT=30000

# Optional: Enable debug logging (defaults to false)  
# DEBUG=true
`;
  
  fs.writeFileSync('.env', envContent);
  log('✅ .env file created for local development', 'green');
}

async function generateManualConfigs(apiKey) {
  log('\n📋 Manual Configuration Examples', 'cyan');
  log('');
  log('For other MCP clients, use these configurations:', 'blue');
  log('');
  
  // Claude Desktop
  log('🤖 Claude Desktop (~/.config/claude/claude_desktop_config.json):', 'yellow');
  log(JSON.stringify({
    mcpServers: {
      leadmagic: {
        command: "leadmagic-mcp-server",
        env: {
          LEADMAGIC_API_KEY: "your-api-key-here"
        }
      }
    }
  }, null, 2), 'green');
  
  log('');
  
  // Cursor/VS Code
  log('🎯 Cursor/VS Code settings.json (Cline extension):', 'yellow');
  log(JSON.stringify({
    "cline.mcpServers": {
      leadmagic: {
        command: "leadmagic-mcp-server",
        env: {
          LEADMAGIC_API_KEY: "your-api-key-here"
        }
      }
    }
  }, null, 2), 'green');
  
  log('');
  
  // Continue.dev
  log('🔄 Continue.dev (~/.continue/config.json):', 'yellow');
  log(JSON.stringify({
    mcpServers: [{
      name: "leadmagic",
      command: "leadmagic-mcp-server",
      env: {
        LEADMAGIC_API_KEY: "your-api-key-here"
      }
    }]
  }, null, 2), 'green');
  
  log('');
  log('💡 Replace "your-api-key-here" with your actual LeadMagic API key', 'cyan');
}

async function showUsageExamples() {
  log('\n🎯 Usage Examples:', 'cyan');
  log('');
  log('After setup, you can use these commands in your MCP client:', 'blue');
  log('');
  log('📧 Email Operations:', 'yellow');
  log('• "Find the email for John Doe at Microsoft"', 'green');
  log('• "Validate the email john@acme.com"', 'green');
  log('• "Find personal email for LinkedIn profile [URL]"', 'green');
  log('');
  log('🏢 Company Intelligence:', 'yellow');
  log('• "Search for Tesla company information"', 'green');
  log('• "Get funding information for Stripe"', 'green');
  log('• "Find employees at OpenAI who work in engineering"', 'green');
  log('');
  log('💼 Job & Recruitment:', 'yellow');
  log('• "Find software engineer jobs at tech companies"', 'green');
  log('• "Search for product manager roles in San Francisco"', 'green');
  log('• "Find mobile number for this LinkedIn profile"', 'green');
  log('');
  log('📱 Advertisement Intelligence:', 'yellow');
  log('• "Search for Google Ads from competitor.com"', 'green');
  log('• "Find Meta ads for company XYZ"', 'green');
  log('• "Get B2B advertising campaigns for [domain]"', 'green');
  log('');
  log('All 19 LeadMagic tools are now available! 🚀', 'magenta');
}

async function showNpxInstructions() {
  log('\n⚡ Quick npx Usage (No Installation Required):', 'cyan');
  log('');
  log('You can also use LeadMagic MCP server without installing:', 'blue');
  log('');
  log('# Run the server directly', 'green');
  log('npx leadmagic-mcp-server', 'yellow');
  log('');
  log('# Run the interactive installer', 'green');
  log('npx leadmagic-mcp-server install', 'yellow');
  log('');
  log('# Set API key via environment variable', 'green');
  log('LEADMAGIC_API_KEY=your-key npx leadmagic-mcp-server', 'yellow');
}

async function main() {
  console.clear();
  
  log('🎯 LeadMagic MCP Server - Interactive Installer', 'cyan');
  log('═'.repeat(60), 'blue');
  log('');
  log('This installer will help you set up the LeadMagic MCP server', 'blue');
  log('with your preferred AI development environment.', 'blue');
  log('');
  log('Supported clients:', 'yellow');
  log('• Claude Desktop 🤖', 'green');
  log('• Cursor (Cline extension) 🎯', 'green');
  log('• Windsurf 🏄', 'green');
  log('• Continue.dev 🔄', 'green');
  log('• VS Code (Cline/Continue) 💻', 'green');
  log('• Zed Editor ⚡', 'green');
  log('• Any MCP-compatible client 🔗', 'green');
  
  process.stdin.setRawMode(false);
  process.stdin.setEncoding('utf8');
  
  try {
    // Get API key
    const apiKey = await getApiKey();
    
    // Choose installation type
    log('\n🛠️  Choose your installation:', 'cyan');
    log('1. Claude Desktop', 'green');
    log('2. Cursor (Cline)', 'green');
    log('3. Windsurf', 'green');
    log('4. Continue.dev', 'green');
    log('5. VS Code (Cline/Continue)', 'green');
    log('6. Zed Editor', 'green');
    log('7. All of the above', 'green');
    log('8. Local development only (.env file)', 'green');
    log('9. Show manual config examples', 'green');
    
    const choice = await promptForInput('\nEnter your choice (1-9):');
    
    switch (choice) {
      case '1':
        await installForClaude(apiKey);
        break;
      case '2':
        await installForCursor(apiKey);
        break;
      case '3':
        await installForWindsurf(apiKey);
        break;
      case '4':
        await installForContinue(apiKey);
        break;
      case '5':
        await installForVSCode(apiKey);
        break;
      case '6':
        await installForZed(apiKey);
        break;
      case '7':
        await installForClaude(apiKey);
        await installForCursor(apiKey);
        await installForWindsurf(apiKey);
        await installForContinue(apiKey);
        await installForVSCode(apiKey);
        await installForZed(apiKey);
        break;
      case '8':
        await createEnvFile(apiKey);
        break;
      case '9':
        await generateManualConfigs(apiKey);
        break;
      default:
        log('❌ Invalid choice. Please run the installer again.', 'red');
        process.exit(1);
    }
    
    if (choice !== '8' && choice !== '9') {
      const createEnv = await promptForInput('\nCreate .env file for local development? (y/n):');
      if (createEnv.toLowerCase() === 'y' || createEnv.toLowerCase() === 'yes') {
        await createEnvFile(apiKey);
      }
    }
    
    if (choice !== '9') {
      await showUsageExamples();
      await showNpxInstructions();
    }
    
    log('\n🎉 Installation complete!', 'green');
    log('');
    log('Next steps:', 'yellow');
    log('1. Restart your AI development environment', 'blue');
    log('2. Start using LeadMagic tools in your conversations', 'blue');
    log('3. Check your credits at: https://app.leadmagic.io', 'blue');
    log('');
    log('Need help? Visit: https://github.com/LeadMagic/leadmagic-mcp', 'cyan');
    
  } catch (error) {
    log(`\n❌ Installation failed: ${error.message}`, 'red');
    process.exit(1);
  }
  
  process.exit(0);
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('LeadMagic MCP Server Installer');
  console.log('');
  console.log('Usage:');
  console.log('  node install.js                 - Run interactive installer');
  console.log('  npx leadmagic-mcp-server install - Run via npx');
  console.log('');
  console.log('Environment variables:');
  console.log('  LEADMAGIC_API_KEY - Your LeadMagic API key');
  process.exit(0);
}

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  log('\n\n👋 Installation cancelled.', 'yellow');
  process.exit(0);
});

main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
}); 