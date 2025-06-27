/**
 * LeadMagic MCP Server - Server Implementation
 * 
 * A comprehensive Model Context Protocol (MCP) server that exposes all 19 LeadMagic API
 * endpoints as MCP tools. This server provides seamless integration with MCP-compatible
 * clients like Claude Desktop, Cursor, Windsurf, and others.
 * 
 * Architecture:
 * - Built on the official MCP SDK for maximum compatibility
 * - Comprehensive error handling and user-friendly responses
 * - Type-safe parameter validation using Zod schemas
 * - Professional logging and debugging capabilities
 * - Production-ready with graceful degradation
 * 
 * Tool Categories:
 * - Credits Management (1 tool)
 * - Email Operations (3 tools)
 * - Profile & Company Search (4 tools)
 * - Job & Recruitment (4 tools)
 * - Mobile & Contact Finding (2 tools)
 * - Company Intelligence (1 tool)
 * - Advertisement Intelligence (4 tools)
 * 
 * @author LeadMagic Team
 * @version 1.0.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LeadMagicClient, LeadMagicError } from './client.js';
import {
  EmailValidationRequestSchema,
  EmailFinderRequestSchema,
  ProfileSearchRequestSchema,
  CompanySearchRequestSchema,
  MobileFinderRequestSchema,
  B2BProfileRequestSchema,
  JobsFinderRequestSchema,
  RoleFinderRequestSchema,
  EmployeeFinderRequestSchema,
  CompanyFundingRequestSchema,
  PersonalEmailFinderRequestSchema,
  B2BSocialEmailRequestSchema,
  AdsSearchRequestSchema,
  B2BAdDetailsRequestSchema,
} from './types.js';

/**
 * MCP Tool Response Structure
 * Standard response format for all MCP tools that matches MCP SDK expectations
 */
interface MCPToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  [x: string]: unknown;
}

/**
 * LeadMagic MCP Server Class
 * 
 * This class implements a complete MCP server that exposes all LeadMagic API functionality
 * as MCP tools. It handles authentication, parameter validation, error management, and
 * response formatting according to MCP specifications.
 */
export class LeadMagicMCPServer {
  private server: McpServer;
  private client: LeadMagicClient;
  private readonly apiKey: string;

  /**
   * Creates a new LeadMagic MCP server instance
   * 
   * @param apiKey - LeadMagic API key for authentication
   * @throws {Error} If API key is invalid or missing
   */
  constructor(apiKey: string) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      throw new Error('Valid LeadMagic API key is required');
    }

    this.apiKey = apiKey.trim();
    
    // Initialize MCP server with metadata
    this.server = new McpServer({
      name: 'leadmagic-mcp-server',
      version: '1.0.0',
    });

    // Initialize LeadMagic API client
    this.client = new LeadMagicClient({
      apiKey: this.apiKey,
    });

    // Register all MCP tools
    this.setupTools();
  }

  /**
   * Registers all LeadMagic API endpoints as MCP tools
   * 
   * This method sets up all 19 LeadMagic tools with proper schemas, descriptions,
   * and error handling. Each tool is carefully configured to provide the best
   * user experience in MCP clients.
   * 
   * @private
   */
  private setupTools(): void {
    this.setupCreditsTools();
    this.setupEmailTools();
    this.setupProfileAndCompanyTools();
    this.setupJobAndRecruitmentTools();
    this.setupMobileAndContactTools();
    this.setupCompanyIntelligenceTools();
    this.setupAdvertisementTools();
    this.setupMetadataTools();
  }

  // ================================
  // CREDITS MANAGEMENT TOOLS
  // ================================

  /**
   * Sets up credits management tools
   * @private
   */
  private setupCreditsTools(): void {
    this.server.registerTool(
      'get_credits',
      {
        title: 'Get API Credits',
        description: 'Check the number of available API credits for your LeadMagic account. Essential for monitoring usage and planning API calls.',
        inputSchema: {},
      },
      async () => {
        try {
          const result = await this.client.getCredits();
          return this.formatSuccessResponse(
            `Available credits: ${result.credits.toLocaleString()}`,
            { credits: result.credits }
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // EMAIL OPERATION TOOLS
  // ================================

  /**
   * Sets up email-related tools (validation, finding, variations)
   * @private
   */
  private setupEmailTools(): void {
    // Email Validation Tool
    this.server.registerTool(
      'validate_email',
      {
        title: 'Email Validation',
        description: 'Validate an email address for deliverability and retrieve associated company information. Provides detailed analysis of email validity, MX records, and catch-all detection.',
        inputSchema: EmailValidationRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = EmailValidationRequestSchema.parse(params);
          const result = await this.client.validateEmail(validatedParams);
          
          return this.formatSuccessResponse(
            `Email validation completed for ${result.email}`,
            result,
            `Status: ${result.email_status}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Email Finder Tool
    this.server.registerTool(
      'find_email',
      {
        title: 'Email Finder',
        description: 'Find verified email address based on a person\'s name and company. Combines multiple data sources to locate professional email addresses with high accuracy.',
        inputSchema: EmailFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = EmailFinderRequestSchema.parse(params);
          const result = await this.client.findEmail(validatedParams);
          
          return this.formatSuccessResponse(
            `Email search completed for ${validatedParams.first_name} ${validatedParams.last_name}`,
            result,
            `Found: ${result.email || 'Not found'}, Status: ${result.status}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Personal Email Finder Tool
    this.server.registerTool(
      'find_personal_email',
      {
        title: 'Personal Email Finder',
        description: 'Find personal email addresses from B2B profile URLs. Useful for reaching contacts through their personal channels when professional emails are not available.',
        inputSchema: PersonalEmailFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findPersonalEmail(params);
          
          return this.formatSuccessResponse(
            `Personal email search completed`,
            result,
            `Status: ${result.status}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // B2B Social to Work Email Tool
    this.server.registerTool(
      'social_to_work_email',
      {
        title: 'B2B Social to Email',
        description: 'Find work email addresses from B2B profile URLs. Converts social profile information into professional email contacts.',
        inputSchema: B2BSocialEmailRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.socialToWorkEmail(params);
          
          return this.formatSuccessResponse(
            `Work email search completed`,
            result,
            `Status: ${result.status}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // PROFILE & COMPANY SEARCH TOOLS
  // ================================

  /**
   * Sets up profile and company search tools
   * @private
   */
  private setupProfileAndCompanyTools(): void {
    // Profile Search Tool
    this.server.registerTool(
      'search_profile',
      {
        title: 'Profile Search',
        description: 'Get full profile details from B2B profile URL (e.g., LinkedIn). Extracts comprehensive professional information including work history, education, and company details. Rate limit: 300 requests/minute.',
        inputSchema: ProfileSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchProfile(params);
          
          const summary = `Profile: ${result.full_name || 'N/A'} at ${result.company_name || 'N/A'}`;
          
          return this.formatSuccessResponse(
            `Profile search completed`,
            result,
            `${summary}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Company Search Tool
    this.server.registerTool(
      'search_company',
      {
        title: 'Company Search',
        description: 'Search for detailed company information using domain, name, or profile URL. Provides comprehensive business intelligence including employee count, locations, industry details, and company metadata.',
        inputSchema: CompanySearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchCompany(params);
          
          const summary = `Company: ${result.company_name || 'N/A'} (${result.employee_count?.toLocaleString() || 'N/A'} employees)`;
          
          return this.formatSuccessResponse(
            `Company search completed`,
            result,
            `${summary}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Email to Profile Tool
    this.server.registerTool(
      'email_to_profile',
      {
        title: 'Email to B2B Profile',
        description: 'Find B2B profile URL using work email address. Reverse lookup functionality to discover professional profiles from email addresses.',
        inputSchema: B2BProfileRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.emailToProfile(params);
          
          return this.formatSuccessResponse(
            `Profile lookup completed for ${params.work_email}`,
            result,
            `Profile URL: ${result.profile_url || 'Not found'}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // JOB & RECRUITMENT TOOLS
  // ================================

  /**
   * Sets up job search and recruitment tools
   * @private
   */
  private setupJobAndRecruitmentTools(): void {
    // Jobs Finder Tool
    this.server.registerTool(
      'find_jobs',
      {
        title: 'Jobs Finder',
        description: 'Search for job postings based on various criteria including company, title, location, and experience level. Supports pagination and advanced filtering for comprehensive job market research.',
        inputSchema: JobsFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findJobs(params);
          
          const summary = `Found ${result.total_count.toLocaleString()} jobs (Page ${result.page}/${result.total_pages})`;
          
          return this.formatSuccessResponse(
            `Job search completed`,
            result,
            `${summary}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Role Finder Tool
    this.server.registerTool(
      'find_role',
      {
        title: 'Role Finder',
        description: 'Find specific roles/positions within a company. Targeted search for particular job titles or functions within organizations.',
        inputSchema: RoleFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findRole(params);
          
          return this.formatSuccessResponse(
            `Role search completed for "${params.job_title}"`,
            result,
            `Company: ${result.company_name || 'N/A'}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Employee Finder Tool
    this.server.registerTool(
      'find_employees',
      {
        title: 'Employee Finder',
        description: 'Find employees of a specific company. Discover team members, their roles, and contact information within target organizations. Supports pagination for large companies.',
        inputSchema: EmployeeFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findEmployees(params);
          
          const summary = `Found ${result.total_count?.toLocaleString() || 'N/A'} employees at ${params.company_name}`;
          
          return this.formatSuccessResponse(
            `Employee search completed`,
            result,
            `${summary}, Returned: ${result.returned_count || 0}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Job Countries Tool
    this.server.registerTool(
      'get_job_countries',
      {
        title: 'Get Job Countries',
        description: 'Retrieve list of available countries for job filtering. Essential reference data for geographic job searches and market analysis.',
        inputSchema: {},
      },
      async () => {
        try {
          const result = await this.client.getJobCountries();
          
          return this.formatSuccessResponse(
            `Retrieved ${result.length} available countries for job filtering`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Job Types Tool
    this.server.registerTool(
      'get_job_types',
      {
        title: 'Get Job Types',
        description: 'Retrieve list of available job types for filtering. Reference data for categorizing and filtering job searches by employment type.',
        inputSchema: {},
      },
      async () => {
        try {
          const result = await this.client.getJobTypes();
          
          return this.formatSuccessResponse(
            `Retrieved ${result.length} available job types for filtering`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // MOBILE & CONTACT FINDING TOOLS
  // ================================

  /**
   * Sets up mobile and contact finding tools
   * @private
   */
  private setupMobileAndContactTools(): void {
    // Mobile Finder Tool
    this.server.registerTool(
      'find_mobile',
      {
        title: 'Mobile Finder',
        description: 'Find mobile phone numbers using profile URL, work email, or personal email. Discover direct contact numbers for better outreach and communication.',
        inputSchema: MobileFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findMobile(params);
          
          return this.formatSuccessResponse(
            `Mobile number search completed`,
            result,
            `Mobile: ${result.mobile_number || 'Not found'}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // COMPANY INTELLIGENCE TOOLS
  // ================================

  /**
   * Sets up company intelligence and funding tools
   * @private
   */
  private setupCompanyIntelligenceTools(): void {
    // Company Funding Tool
    this.server.registerTool(
      'get_company_funding',
      {
        title: 'Company Funding',
        description: 'Get comprehensive funding information, financials, competitors, and company insights. Essential for investment research, competitive analysis, and business intelligence.',
        inputSchema: CompanyFundingRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.getCompanyFunding(params);
          
          const fundingInfo = result.financialInfo?.formattedFunding || 'N/A';
          const revenue = result.financialInfo?.formattedRevenue || 'N/A';
          const employees = result.companySize?.employeeRange || 'N/A';
          
          const summary = `Funding: ${fundingInfo}, Revenue: ${revenue}, Employees: ${employees}`;
          
          return this.formatSuccessResponse(
            `Company funding analysis completed`,
            result,
            `${summary}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // ADVERTISEMENT INTELLIGENCE TOOLS
  // ================================

  /**
   * Sets up advertisement intelligence tools
   * @private
   */
  private setupAdvertisementTools(): void {
    // Google Ads Search Tool
    this.server.registerTool(
      'search_google_ads',
      {
        title: 'Google Ads Search',
        description: 'Search for Google Ads based on company\'s domain or name. Analyze competitor advertising strategies, creative content, and campaign insights.',
        inputSchema: AdsSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchGoogleAds(params);
          
          return this.formatSuccessResponse(
            `Google Ads search completed`,
            result,
            `Found ${result.ads.length} Google ads, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Meta Ads Search Tool
    this.server.registerTool(
      'search_meta_ads',
      {
        title: 'Meta Ads Search',
        description: 'Search for Meta (Facebook/Instagram) Ads based on company\'s domain or name. Discover social media advertising strategies and creative campaigns.',
        inputSchema: AdsSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchMetaAds(params);
          
          return this.formatSuccessResponse(
            `Meta Ads search completed`,
            result,
            `Found ${result.ads.length} Meta ads, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // B2B Ads Search Tool
    this.server.registerTool(
      'search_b2b_ads',
      {
        title: 'B2B Ads Search',
        description: 'Search for B2B Ads based on company\'s domain or name. Analyze business-to-business advertising campaigns and professional marketing strategies.',
        inputSchema: AdsSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchB2BAds(params);
          
          return this.formatSuccessResponse(
            `B2B Ads search completed`,
            result,
            `Found ${result.ads.length} B2B ads, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // B2B Ad Details Tool
    this.server.registerTool(
      'get_b2b_ad_details',
      {
        title: 'B2B Ad Details',
        description: 'Get detailed information about a specific B2B ad including campaign information, creative details, and performance insights.',
        inputSchema: B2BAdDetailsRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.getB2BAdDetails(params);
          
          return this.formatSuccessResponse(
            `B2B Ad details retrieved for ad ${params.ad_id}`,
            result,
            `Title: ${result.ad_title || 'N/A'}, Company: ${result.company_name || 'N/A'}, Credits used: ${result.credits_consumed}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // METADATA TOOLS
  // ================================

  /**
   * Sets up metadata and reference data tools
   * @private
   */
  private setupMetadataTools(): void {
    // These are already included in setupJobAndRecruitmentTools
    // but keeping this structure for potential future metadata tools
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Formats successful API responses for MCP clients
   * 
   * @param message - User-friendly message describing the operation
   * @param data - Raw API response data
   * @param summary - Optional summary for quick overview
   * @returns Formatted MCP tool response
   * @private
   */
  private formatSuccessResponse(
    message: string,
    data?: unknown,
    summary?: string
  ): MCPToolResponse {
    const responseText = [
      `✅ ${message}`,
      summary ? `\n📊 ${summary}` : '',
      data ? `\n\n📋 **Detailed Results:**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`` : ''
    ].filter(Boolean).join('');

    return {
      content: [
        {
          type: 'text' as const,
          text: responseText,
        },
      ],
    };
  }

  /**
   * Handles and formats errors for MCP clients
   * 
   * Provides comprehensive error information while maintaining user-friendly messaging.
   * Includes specific guidance for common error scenarios.
   * 
   * @param error - The error that occurred
   * @returns Formatted MCP error response
   * @private
   */
  private handleError(error: unknown): MCPToolResponse {
    console.error('LeadMagic API Error:', error);

    let errorMessage = '❌ An unexpected error occurred';
    let errorDetails = '';
    let troubleshooting = '';

    if (error instanceof LeadMagicError) {
      // Handle LeadMagic-specific errors
      errorMessage = `❌ LeadMagic API Error: ${error.message}`;
      errorDetails = `**Error Code:** ${error.code}\n**Status:** ${error.status}`;
      
      // Provide specific troubleshooting guidance
      if (error.isClientError()) {
        if (error.status === 401) {
          troubleshooting = '🔧 **Troubleshooting:** Please check your API key is valid and has sufficient permissions.';
        } else if (error.status === 429) {
          troubleshooting = '🔧 **Troubleshooting:** Rate limit exceeded. Please wait a moment before making more requests.';
        } else if (error.status === 400) {
          troubleshooting = '🔧 **Troubleshooting:** Please check that all required parameters are provided and valid.';
        } else {
          troubleshooting = '🔧 **Troubleshooting:** Please verify your request parameters and try again.';
        }
      } else if (error.isServerError()) {
        troubleshooting = '🔧 **Troubleshooting:** LeadMagic server error. Please try again in a few moments.';
      } else if (error.isNetworkError()) {
        troubleshooting = '🔧 **Troubleshooting:** Network connectivity issue. Please check your internet connection.';
      }
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors
      errorMessage = `❌ Error: ${error.message}`;
      errorDetails = `**Type:** ${error.name}`;
      troubleshooting = '🔧 **Troubleshooting:** Please check your input parameters and try again.';
    } else {
      // Handle unknown error types
      errorMessage = '❌ An unknown error occurred';
      errorDetails = '**Type:** Unknown';
      troubleshooting = '🔧 **Troubleshooting:** Please try again or contact support if the issue persists.';
    }

    const responseText = [
      errorMessage,
      errorDetails ? `\n${errorDetails}` : '',
      troubleshooting ? `\n\n${troubleshooting}` : '',
      '\n\n💡 **Need Help?** Visit: https://github.com/LeadMagic/leadmagic-mcp/issues'
    ].filter(Boolean).join('');

    return {
      content: [
        {
          type: 'text' as const,
          text: responseText,
        },
      ],
    };
  }

  /**
   * Gets the underlying MCP server instance
   * 
   * @returns The MCP server instance for external usage
   */
  public getServer(): McpServer {    
    return this.server;
  }

  /**
   * Tests the LeadMagic API connection
   * 
   * @returns Promise resolving to connection test results
   */
  public async testConnection(): Promise<{ success: boolean; credits?: number; error?: string }> {
    try {
      const result = await this.client.testConnection();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Gets server statistics and health information
   * 
   * @returns Server health and configuration information
   */
  public getServerInfo(): {
    name: string;
    version: string;
    toolCount: number;
    apiKeyMasked: string;
    clientConfig: Partial<import('./types.js').LeadMagicConfig>;
  } {
    return {
      name: 'leadmagic-mcp-server',
      version: '1.0.0',
      toolCount: 19, // Total number of registered tools
      apiKeyMasked: this.apiKey.substring(0, 8) + '...',
      clientConfig: this.client.getConfig()
    };
  }
}

/**
 * Factory function to create a new LeadMagic MCP server instance
 * 
 * This is the main entry point for creating MCP servers. It provides a clean
 * interface that abstracts the complexity of server initialization.
 * 
 * @param apiKey - LeadMagic API key for authentication
 * @returns Configured MCP server ready for use
 * @throws {Error} If API key is invalid
 * 
 * @example
 * ```typescript
 * const server = createLeadMagicServer('your-api-key');
 * await server.connect(transport);
 * ```
 */
export function createLeadMagicServer(apiKey: string): McpServer {
  const mcpServer = new LeadMagicMCPServer(apiKey);
  return mcpServer.getServer();
} 