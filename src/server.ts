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

export class LeadMagicMCPServer {
  private server: McpServer;
  private client: LeadMagicClient;

  constructor(apiKey: string) {
    this.server = new McpServer({
      name: 'leadmagic-mcp-server',
      version: '1.0.0',
    });

    this.client = new LeadMagicClient({
      apiKey,
    });

    this.setupTools();
  }

  private setupTools(): void {
    // 1. Credits Management
    this.server.registerTool(
      'get_credits',
      {
        title: 'Get API Credits',
        description: 'Check the number of available API credits for your LeadMagic account',
        inputSchema: {},
      },
      async () => {
        try {
          const result = await this.client.getCredits();
          return {
            content: [
              {
                type: 'text' as const,
                text: `Available credits: ${result.credits}`,
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 2. Email Validation
    this.server.registerTool(
      'validate_email',
      {
        title: 'Email Validation',
        description:
          'Validate an email address for deliverability and retrieve associated company information',
        inputSchema: EmailValidationRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = EmailValidationRequestSchema.parse(params);
          const result = await this.client.validateEmail(validatedParams);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 3. Email Finder
    this.server.registerTool(
      'find_email',
      {
        title: 'Email Finder',
        description: 'Find verified email address based on a person\'s name and company',
        inputSchema: EmailFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = EmailFinderRequestSchema.parse(params);
          const result = await this.client.findEmail(validatedParams);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 4. Profile Search
    this.server.registerTool(
      'search_profile',
      {
        title: 'Profile Search',
        description:
          'Get full profile details from B2B profile URL (e.g., LinkedIn). Rate limit: 300 requests/minute',
        inputSchema: ProfileSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchProfile(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 5. Company Search
    this.server.registerTool(
      'search_company',
      {
        title: 'Company Search',
        description: 'Search for company details using domain, name, or profile URL',
        inputSchema: CompanySearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchCompany(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 6. Mobile Finder
    this.server.registerTool(
      'find_mobile',
      {
        title: 'Mobile Finder',
        description: 'Find mobile phone numbers using profile URL, work email, or personal email',
        inputSchema: MobileFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findMobile(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 7. B2B Profile (Email to Profile)
    this.server.registerTool(
      'email_to_profile',
      {
        title: 'Email to B2B Profile',
        description: 'Find B2B profile URL using work email address',
        inputSchema: B2BProfileRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.emailToProfile(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 8. Jobs Finder
    this.server.registerTool(
      'find_jobs',
      {
        title: 'Jobs Finder',
        description: 'Search for job postings based on various criteria',
        inputSchema: JobsFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findJobs(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 9. Role Finder
    this.server.registerTool(
      'find_role',
      {
        title: 'Role Finder',
        description: 'Find specific roles/positions within a company',
        inputSchema: RoleFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findRole(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 10. Employee Finder
    this.server.registerTool(
      'find_employees',
      {
        title: 'Employee Finder',
        description: 'Find employees of a specific company',
        inputSchema: EmployeeFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findEmployees(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 11. Company Funding
    this.server.registerTool(
      'get_company_funding',
      {
        title: 'Company Funding',
        description:
          'Get comprehensive funding information, financials, competitors, and company insights',
        inputSchema: CompanyFundingRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.getCompanyFunding(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 12. Personal Email Finder
    this.server.registerTool(
      'find_personal_email',
      {
        title: 'Personal Email Finder',
        description: 'Find personal email addresses from B2B profile URLs',
        inputSchema: PersonalEmailFinderRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.findPersonalEmail(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 13. B2B Social to Email
    this.server.registerTool(
      'social_to_work_email',
      {
        title: 'B2B Social to Email',
        description: 'Find work email addresses from B2B profile URLs',
        inputSchema: B2BSocialEmailRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.socialToWorkEmail(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 14. Google Ads Search
    this.server.registerTool(
      'search_google_ads',
      {
        title: 'Google Ads Search',
        description: 'Search for Google Ads based on company\'s domain or name',
        inputSchema: AdsSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchGoogleAds(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 15. Meta Ads Search
    this.server.registerTool(
      'search_meta_ads',
      {
        title: 'Meta Ads Search',
        description: 'Search for Meta (Facebook/Instagram) Ads based on company\'s domain or name',
        inputSchema: AdsSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchMetaAds(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 16. B2B Ads Search
    this.server.registerTool(
      'search_b2b_ads',
      {
        title: 'B2B Ads Search',
        description: 'Search for B2B Ads based on company\'s domain or name',
        inputSchema: AdsSearchRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.searchB2BAds(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 17. B2B Ad Details
    this.server.registerTool(
      'get_b2b_ad_details',
      {
        title: 'B2B Ad Details',
        description: 'Get detailed information about a specific B2B ad',
        inputSchema: B2BAdDetailsRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.getB2BAdDetails(params);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 18. Get Job Countries
    this.server.registerTool(
      'get_job_countries',
      {
        title: 'Get Job Countries',
        description: 'Retrieve list of available countries for job filtering',
        inputSchema: {},
      },
      async () => {
        try {
          const result = await this.client.getJobCountries();
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // 19. Get Job Types
    this.server.registerTool(
      'get_job_types',
      {
        title: 'Get Job Types',
        description: 'Retrieve list of available job types for filtering',
        inputSchema: {},
      },
      async () => {
        try {
          const result = await this.client.getJobTypes();
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  private handleError(error: unknown): { content: Array<{ type: 'text'; text: string }> } {
    console.error('LeadMagic API Error:', error);

    if (error instanceof LeadMagicError) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error ${error.status}: ${error.message}\nCode: ${error.code}`,
          },
        ],
      };
    }

    if (error instanceof Error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error.message}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: 'An unknown error occurred',
        },
      ],
    };
  }

  public getServer(): McpServer {
    return this.server;
  }
} 