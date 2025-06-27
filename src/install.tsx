#!/usr/bin/env node

/**
 * LeadMagic MCP Server - Interactive Installer (Ink-powered)
 * 
 * A beautiful, interactive React-based CLI installer that helps users easily 
 * configure the LeadMagic MCP server with their preferred MCP client.
 * 
 * Built with Ink - React for command-line interfaces
 * 
 * Features:
 * - Beautiful, responsive UI with colors and borders
 * - Interactive menus and input forms
 * - Real-time progress indicators
 * - Multi-step guided installation
 * - Support for all major MCP clients
 * - Comprehensive error handling and validation
 * 
 * Supported Clients:
 * - Claude Desktop
 * - Cursor (Cline extension)  
 * - Windsurf
 * - Continue.dev
 * - VS Code (Cline/Continue extensions)
 * - Zed Editor
 * - Generic clients (Aider, Augment, etc.)
 * 
 * @author LeadMagic Team
 * @version 2.1.0
 */

import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import Link from 'ink-link';
import Spinner from 'ink-spinner';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { LeadMagicClient, LeadMagicError } from './client.js';

// ===== TYPES AND INTERFACES =====

/**
 * Configuration paths for different MCP clients across platforms
 */
interface ClientConfigPaths {
  claude: string;
  cursor: string;
  windsurf: string;
  continue: string;
  vscode: string;
  zed: string;
}

/**
 * MCP server configuration structure
 */
interface MCPServerConfig {
  command: string;
  env: {
    LEADMAGIC_API_KEY: string;
  };
}

/**
 * Generic configuration structure for MCP clients
 */
interface MCPConfig {
  mcpServers?: Record<string, MCPServerConfig>;
  'cline.mcpServers'?: Record<string, MCPServerConfig>;
  [key: string]: unknown;
}

/**
 * Continue.dev specific configuration structure
 */
interface ContinueConfig {
  mcpServers?: Array<{
    name: string;
    command: string;
    env: {
      LEADMAGIC_API_KEY: string;
    };
  }>;
  [key: string]: unknown;
}

/**
 * Installation step types
 */
type InstallationStep = 'welcome' | 'apiKey' | 'clientSelection' | 'installing' | 'complete' | 'error' | 'manualSetup';

/**
 * Available MCP clients
 */
interface MCPClient {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

/**
 * Installation result for each client
 */
interface InstallationResult {
  client: string;
  success: boolean;
  message: string;
  configPath?: string;
  configAdded?: MCPServerConfig | { name: string } & MCPServerConfig;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Gets platform-specific configuration paths for all supported MCP clients
 * @returns Object containing paths for each client
 */
function getConfigPaths(): ClientConfigPaths {
  const platform = os.platform();
  const home = os.homedir();
  
  const basePaths = {
    darwin: {
      claude: path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
      cursor: path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json'),
      windsurf: path.join(home, 'Library', 'Application Support', 'Windsurf', 'User', 'settings.json'),
      continue: path.join(home, '.continue', 'config.json'),
      vscode: path.join(home, 'Library', 'Application Support', 'Code', 'User', 'settings.json'),
      zed: path.join(home, '.config', 'zed', 'settings.json'),
    },
    win32: {
      claude: path.join(home, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'),
      cursor: path.join(home, 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json'),
      windsurf: path.join(home, 'AppData', 'Roaming', 'Windsurf', 'User', 'settings.json'),
      continue: path.join(home, '.continue', 'config.json'),
      vscode: path.join(home, 'AppData', 'Roaming', 'Code', 'User', 'settings.json'),
      zed: path.join(home, 'AppData', 'Roaming', 'Zed', 'settings.json'),
    },
    linux: {
      claude: path.join(home, '.config', 'claude', 'claude_desktop_config.json'),
      cursor: path.join(home, '.config', 'Cursor', 'User', 'settings.json'),
      windsurf: path.join(home, '.config', 'Windsurf', 'User', 'settings.json'),
      continue: path.join(home, '.continue', 'config.json'),
      vscode: path.join(home, '.config', 'Code', 'User', 'settings.json'),
      zed: path.join(home, '.config', 'zed', 'settings.json'),
    },
  };
  
  return basePaths[platform as keyof typeof basePaths] || basePaths.linux;
}

/**
 * Ensures the directory for a config file exists
 * @param configPath - Path to the configuration file
 */
function ensureConfigDir(configPath: string): void {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

/**
 * Safely reads and parses a configuration file
 * @param configPath - Path to the configuration file
 * @returns Parsed configuration object or empty object if file doesn't exist/is invalid
 */
function readConfigSafely<T = Record<string, unknown>>(configPath: string): T {
  if (!fs.existsSync(configPath)) {
    return {} as T;
  }
  
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    // Strip comments before parsing
    const jsonString = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    if (jsonString.trim() === '') return {} as T;
    return JSON.parse(jsonString) as T;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(`The existing configuration file at ${configPath} is not valid JSON. Please fix or remove it and try again.`);
    }
    throw e; // Re-throw other errors
  }
}

/**
 * Writes configuration to file with proper formatting
 * @param configPath - Path to write the configuration
 * @param config - Configuration object to write
 */
function writeConfig(configPath: string, config: Record<string, unknown>): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Provides user-friendly error messages for file system operations.
 * @param error - The error object.
 * @param filePath - The path of the file that was being accessed.
 * @returns A user-friendly error string.
 */
function getFriendlyFileSystemError(error: unknown, filePath: string): string {
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
      case 'EACCES':
        return `Permission Denied: Could not write to the file at ${filePath}. Please check file permissions or run the installer with administrator privileges (e.g., using 'sudo').`;
      case 'EPERM':
        return `Operation not permitted: Could not modify the file at ${filePath}. This may be due to security settings or file ownership.`;
      case 'EISDIR':
        return `Path is a directory: Expected a file but found a directory at ${filePath}. Please resolve the path conflict.`;
      case 'ENOENT':
        return `Directory not found: A directory in the path ${filePath} does not exist and could not be created.`;
      default:
        return `A file system error occurred (${(error as {code: string}).code}) while accessing ${filePath}.`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return `An unknown error occurred while accessing ${filePath}.`;
}

/**
 * Creates a local .env file for development
 * @param apiKey - LeadMagic API key
 * @returns Installation result for the .env file
 */
function createEnvFile(apiKey: string): InstallationResult {
  const envPath = path.resolve('.env');
  try {
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
  
    fs.writeFileSync(envPath, envContent);
    return {
      client: '.env file',
      success: true,
      message: 'Created for local development',
      configPath: envPath,
    };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, envPath);
    return {
      client: '.env file',
      success: false,
      message: errorMessage,
      configPath: envPath,
    };
  }
}

// ===== CLIENT INSTALLATION FUNCTIONS =====

const leadmagicServerConfig = (apiKey: string) => ({
  command: "leadmagic-mcp-server",
  env: {
    LEADMAGIC_API_KEY: apiKey
  }
});

function installForClaude(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().claude;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = leadmagicServerConfig(apiKey);
    
    config.mcpServers = { ...config.mcpServers, leadmagic: serverConfig };
    
    writeConfig(configPath, config);
    return { client: 'Claude Desktop', success: true, message: 'Configured successfully', configPath, configAdded: serverConfig };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, configPath);
    return { client: 'Claude Desktop', success: false, message: errorMessage, configPath };
  }
}

function installForCursor(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().cursor;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = leadmagicServerConfig(apiKey);

    config['cline.mcpServers'] = { ...config['cline.mcpServers'], leadmagic: serverConfig };
    
    writeConfig(configPath, config);
    return { client: 'Cursor (Cline)', success: true, message: 'Configured successfully', configPath, configAdded: serverConfig };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, configPath);
    return { client: 'Cursor (Cline)', success: false, message: errorMessage, configPath };
  }
}

function installForWindsurf(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().windsurf;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = leadmagicServerConfig(apiKey);
    
    config.mcpServers = { ...config.mcpServers, leadmagic: serverConfig };

    writeConfig(configPath, config);
    return { client: 'Windsurf', success: true, message: 'Configured successfully', configPath, configAdded: serverConfig };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, configPath);
    return { client: 'Windsurf', success: false, message: errorMessage, configPath };
  }
}

function installForContinue(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().continue;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<ContinueConfig>(configPath);
    const serverConfig = { name: "leadmagic", ...leadmagicServerConfig(apiKey) };
    
    if (!config.mcpServers) config.mcpServers = [];
    
    config.mcpServers = config.mcpServers.filter(server => server.name !== 'leadmagic');
    config.mcpServers.push(serverConfig);
    
    writeConfig(configPath, config);
    return { client: 'Continue.dev', success: true, message: 'Configured successfully', configPath, configAdded: serverConfig };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, configPath);
    return { client: 'Continue.dev', success: false, message: errorMessage, configPath };
  }
}

function installForVSCode(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().vscode;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = leadmagicServerConfig(apiKey);

    config['cline.mcpServers'] = { ...config['cline.mcpServers'], leadmagic: serverConfig };
    
    writeConfig(configPath, config);
    return { client: 'VS Code', success: true, message: 'Configured successfully', configPath, configAdded: serverConfig };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, configPath);
    return { client: 'VS Code', success: false, message: errorMessage, configPath };
  }
}

function installForZed(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().zed;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = leadmagicServerConfig(apiKey);

    config.mcpServers = { ...config.mcpServers, leadmagic: serverConfig };

    writeConfig(configPath, config);
    return { client: 'Zed Editor', success: true, message: 'Configured successfully', configPath, configAdded: serverConfig };
  } catch (error) {
    const errorMessage = getFriendlyFileSystemError(error, configPath);
    return { client: 'Zed Editor', success: false, message: errorMessage, configPath };
  }
}

// ===== REACT COMPONENTS =====

const Header: React.FC = () => (
  <Box flexDirection="column" marginBottom={1}>
    <Box borderStyle="double" borderColor="cyan" paddingX={2}>
      <Text color="cyan" bold>🎯 LeadMagic MCP Server - Interactive Installer</Text>
    </Box>
  </Box>
);

const Welcome: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  useInput((input) => {
    if (input === '\r' || input === ' ') onNext();
  });

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1} marginBottom={1}>
        <Text bold>Welcome to the LeadMagic MCP Server installer!</Text>
        <Text>This will get you set up to use 19 powerful B2B data tools in your favorite AI environment.</Text>
      </Box>
      <Box flexDirection="column" borderStyle="round" borderColor="magenta" padding={1} marginBottom={1}>
        <Text bold color="magenta">What is MCP?</Text>
        <Text>The Model Context Protocol (MCP) allows AI assistants like Claude, Cursor, and Continue.dev to use external tools. This server exposes the entire LeadMagic API as a suite of MCP tools.</Text>
      </Box>
      <Box justifyContent="center" marginTop={1}>
        <Text color="cyan" bold>Press ENTER to continue...</Text>
      </Box>
    </Box>
  );
};

const ApiKeyInput: React.FC<{ onNext: (apiKey: string) => void, onBack: () => void }> = ({ onNext, onBack }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    setError('');
    setCredits(null);
    try {
      const client = new LeadMagicClient(key);
      const creditsData = await client.getCredits();
      setCredits(creditsData.credits);
      setTimeout(() => onNext(key), 1500); // Wait a moment so user can see credits
    } catch (err) {
      if (err instanceof LeadMagicError && (err.isClientError())) {
        setError('Invalid API Key. Please check the key and try again.');
      } else {
        setError(`Could not connect to the LeadMagic API. Please check your network connection.`);
      }
    } finally {
      setIsValidating(false);
    }
  };

  useInput((inputChar, key) => {
    if (key.escape) onBack();
    else if (key.return) {
      if (!input || input.length < 10) {
        setError('Invalid API key. Please enter a valid key from LeadMagic.');
      } else {
        validateApiKey(input);
      }
    }
    else if (key.backspace || key.delete) setInput(current => current.slice(0, -1));
    else if (inputChar && !key.ctrl && !key.meta) setInput(current => current + inputChar);
  });

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1} marginBottom={1}>
        <Text bold color="cyan">🔑 Step 1: Enter Your LeadMagic API Key</Text>
        <Text>You can get your free API key from the dashboard:</Text>
        <Link url="https://app.leadmagic.io/dashboard/api-keys">
          <Text color="blue" underline>https://app.leadmagic.io/dashboard/api-keys</Text>
        </Link>
      </Box>
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginBottom={1}>
        <Text>API Key:</Text>
        <Text color="green">{input ? '•'.repeat(input.length) : '(typing...)'}</Text>
      </Box>

      {isValidating && (
        <Box marginTop={1}>
          <Text color="yellow">
            <Spinner type="dots" /> Validating API key...
          </Text>
        </Box>
      )}

      {error && !isValidating && (
        <Box borderStyle="round" borderColor="red" paddingX={1} marginTop={1}>
          <Text color="red">❌ {error}</Text>
        </Box>
      )}

      {credits !== null && !isValidating && (
        <Box borderStyle="round" borderColor="green" paddingX={1} marginTop={1}>
          <Text color="green">✅ Success! You have <Text bold>{credits.toLocaleString()}</Text> credits remaining.</Text>
        </Box>
      )}
      
      <Box marginTop={1}><Text color="blue">Press ENTER to validate, ESC to go back.</Text></Box>
    </Box>
  );
};

const ClientSelection: React.FC<{ onNext: (clients: string[]) => void, onBack: () => void, onManualSetup: () => void }> = ({ onNext, onBack, onManualSetup }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const clients: MCPClient[] = [
    { id: 'all', name: 'All Supported Clients', emoji: '🌟', description: 'Configure all detected clients automatically' },
    { id: 'claude', name: 'Claude Desktop', emoji: '🤖', description: 'For the native Anthropic Claude app' },
    { id: 'cursor', name: 'Cursor', emoji: '🎯', description: 'For the Cursor editor (with Cline extension)' },
    { id: 'vscode', name: 'VS Code', emoji: '💻', description: 'For VS Code (with Cline or Continue.dev)' },
    { id: 'continue', name: 'Continue.dev', emoji: '🔄', description: 'For the Continue.dev extension' },
    { id: 'zed', name: 'Zed Editor', emoji: '⚡', description: 'For the Zed editor' },
    { id: 'windsurf', name: 'Windsurf', emoji: '🏄', description: 'For the Windsurf editor' },
    { id: 'env', name: 'Local .env File Only', emoji: '📝', description: 'For local development or custom scripts' },
    { id: 'manual', name: 'Other (Manual Setup)', emoji: '🔧', description: 'Show instructions for other clients (Aider, etc.)' },
  ];

  useInput((input, key) => {
    if (key.escape) onBack();
    else if (key.upArrow) setSelectedIndex(i => Math.max(0, i - 1));
    else if (key.downArrow) setSelectedIndex(i => Math.min(clients.length - 1, i + 1));
    else if (key.return) {
      const selected = clients[selectedIndex];
      if (selected.id === 'manual') onManualSetup();
      else if (selected.id === 'env') onNext(['env']);
      else if (selected.id === 'all') onNext(['claude', 'cursor', 'windsurf', 'continue', 'vscode', 'zed']);
      else onNext([selected.id]);
    }
  });

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginBottom={1}>
        <Text bold color="yellow">🛠️  Step 2: Choose Your AI Environment</Text>
        <Text>Select where you want to use the LeadMagic tools.</Text>
      </Box>
      <Box flexDirection="column">
        {clients.map((client, index) => (
          <Box key={client.id} paddingX={1}>
            <Text color={index === selectedIndex ? "cyan" : "white"} bold={index === selectedIndex}>
              {index === selectedIndex ? "→ " : "  "}
              {client.emoji} {client.name}
            </Text>
            {index === selectedIndex && <Text color="gray"> - {client.description}</Text>}
          </Box>
        ))}
      </Box>
      <Box marginTop={1}><Text color="blue">Use ↑↓ and ENTER to select. ESC to go back.</Text></Box>
    </Box>
  );
};

const InstallationProgress: React.FC<{ apiKey: string, selectedClients: string[], onComplete: (results: InstallationResult[]) => void, onError: (error: string) => void }> = ({ apiKey, selectedClients, onComplete, onError }) => {
  const [progress, setProgress] = useState<InstallationResult[]>([]);

  const installationMap: Record<string, (apiKey: string) => InstallationResult> = {
    claude: installForClaude,
    cursor: installForCursor,
    windsurf: installForWindsurf,
    continue: installForContinue,
    vscode: installForVSCode,
    zed: installForZed,
    env: createEnvFile,
  };

  useEffect(() => {
    (async () => {
      try {
        const allResults: InstallationResult[] = [];
        const clientsToInstall = selectedClients.includes('env') ? ['env'] : [...selectedClients, 'env'];
        
        for (const clientId of clientsToInstall) {
          await new Promise(resolve => setTimeout(resolve, 200));
          const installFunction = installationMap[clientId];
          if (installFunction) {
            const result = installFunction(apiKey);
            allResults.push(result);
            setProgress([...allResults]);
          }
        }
        onComplete(allResults);
      } catch (e) {
        onError(e instanceof Error ? e.message : 'An unknown error occurred');
      }
    })();
  }, []);

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginBottom={1}>
        <Text bold color="yellow">⚙️  Step 3: Installation in Progress...</Text>
        <Box flexDirection="column" marginTop={1}>
          {progress.map((result, i) => (
            <Text key={i} color={result.success ? "green" : "red"}>
              {result.success ? "✅" : "❌"} {result.client}: {result.message}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const InstallationComplete: React.FC<{ results: InstallationResult[], onExit: () => void }> = ({ results, onExit }) => {
  useInput((input) => { if (input) onExit(); });
  
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="double" borderColor="green" padding={1} marginBottom={1}>
        <Text bold color="green">🎉 Installation Complete!</Text>
      </Box>
      {successes.length > 0 && (
        <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1} marginBottom={1}>
          <Text bold color="green">✅ Success!</Text>
          {successes.map((r, i) => (
            <Box key={i} flexDirection="column">
              <Text>• {r.client} configured at: <Text color="gray">{r.configPath}</Text></Text>
              {r.configAdded && <Text>  {JSON.stringify(r.configAdded)}</Text>}
            </Box>
          ))}
        </Box>
      )}
      {failures.length > 0 && (
        <Box flexDirection="column" borderStyle="round" borderColor="red" padding={1} marginBottom={1}>
          <Text bold color="red">❌ Failures</Text>
          {failures.map((r, i) => <Text key={i}>• {r.client}: {r.message}</Text>)}
        </Box>
      )}
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1} marginBottom={1}>
        <Text bold color="cyan">🚀 Next Steps</Text>
        <Text>1. <Text bold>Restart your IDE/Client</Text> to load the new tools.</Text>
        <Text>2. Use commands like: <Text color="yellow">"Find email for elon at tesla.com"</Text></Text>
        <Box>
          <Text>3. Check credits at: </Text>
          <Link url="https://app.leadmagic.io">
            <Text color="blue" underline>https://app.leadmagic.io</Text>
          </Link>
        </Box>
      </Box>
      <Box justifyContent="center" marginTop={1}><Text color="cyan" bold>Press ANY KEY to exit.</Text></Box>
    </Box>
  );
};

const ManualSetup: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  useInput((input, key) => { if (key.escape) onBack(); });
  const apiKey = "your-leadmagic-api-key";

  const jsonSnippet = (serverConfig: unknown) => JSON.stringify(serverConfig, null, 2);

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1} marginBottom={1}>
        <Text bold color="cyan">🔧 Manual MCP Server Configuration</Text>
        <Text>For any client that supports MCP (Aider, custom scripts, etc.), you'll need to add a configuration block to its settings file (usually a JSON or YAML file).</Text>
      </Box>
      
      <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1} marginBottom={1}>
        <Text bold>Standard Clients (Claude, Cursor, Zed, etc.)</Text>
        <Text>Look for a `mcpServers` or `cline.mcpServers` object in your client's `settings.json`:</Text>
        <Text color="green">{jsonSnippet({ mcpServers: { leadmagic: leadmagicServerConfig(apiKey) } })}</Text>
      </Box>
      
      <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1} marginBottom={1}>
        <Text bold>Continue.dev</Text>
        <Text>Look for the `mcpServers` array in `~/.continue/config.json`:</Text>
        <Text color="green">{jsonSnippet({ mcpServers: [{ name: "leadmagic", ...leadmagicServerConfig(apiKey) }] })}</Text>
      </Box>

      <Box borderStyle="round" borderColor="yellow" padding={1} marginBottom={1}>
        <Text>💡 <Text bold>IMPORTANT:</Text> Replace <Text color="yellow">"{apiKey}"</Text> with your actual API key.</Text>
      </Box>
      <Box justifyContent="center" marginTop={1}><Text color="cyan" bold>Press ESC to go back.</Text></Box>
    </Box>
  );
};

const ErrorDisplay: React.FC<{ error: string, onRestart: () => void, onExit: () => void }> = ({ error, onRestart, onExit }) => {
  useInput((input, key) => {
    if (key.escape || input === 'q') onExit();
    if (input === 'r' || key.return) onRestart();
  });
  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" borderStyle="round" borderColor="red" padding={1} marginBottom={1}>
        <Text bold color="red">❌ An Error Occurred</Text>
        <Text>{error}</Text>
      </Box>
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginBottom={1}>
          <Text bold color="yellow">💡 Troubleshooting:</Text>
          <Text>• Check your API key is valid.</Text>
          <Text>• Ensure you have write permissions.</Text>
          <Text>• Try running with administrator privileges.</Text>
          <Box>
            <Text>• Visit: </Text>
            <Link url="https://github.com/LeadMagic/leadmagic-mcp">
              <Text color="blue" underline>https://github.com/LeadMagic/leadmagic-mcp</Text>
            </Link>
          </Box>
        </Box>
      <Box justifyContent="center" marginTop={1}><Text color="cyan">Press R to restart, or ESC to exit.</Text></Box>
    </Box>
  );
};

const InstallerApp: React.FC = () => {
  const [step, setStep] = useState<InstallationStep>('welcome');
  const [apiKey, setApiKey] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [results, setResults] = useState<InstallationResult[]>([]);
  const [error, setError] = useState('');
  const { exit } = useApp();

  const restart = () => {
    setStep('welcome');
    setApiKey('');
    setSelectedClients([]);
    setResults([]);
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome': return <Welcome onNext={() => setStep('apiKey')} />;
      case 'apiKey': return <ApiKeyInput onNext={(key) => { setApiKey(key); setStep('clientSelection'); }} onBack={() => setStep('welcome')} />;
      case 'clientSelection': return <ClientSelection onNext={(clients) => { setSelectedClients(clients); setStep('installing'); }} onBack={() => setStep('apiKey')} onManualSetup={() => setStep('manualSetup')} />;
      case 'installing': return <InstallationProgress apiKey={apiKey} selectedClients={selectedClients} onComplete={(res) => { setResults(res); setStep('complete'); }} onError={(err) => { setError(err); setStep('error'); }} />;
      case 'complete': return <InstallationComplete results={results} onExit={exit} />;
      case 'manualSetup': return <ManualSetup onBack={() => setStep('clientSelection')} />;
      case 'error': return <ErrorDisplay error={error} onRestart={restart} onExit={exit} />;
      default: return <Text>Loading...</Text>;
    }
  };

  return renderStep();
};

if (import.meta.url === `file://${process.argv[1]}`) {
  render(<InstallerApp />);
}

export default InstallerApp; 