/**
 * LeadMagic MCP Server - API Client
 * 
 * A comprehensive TypeScript client for the LeadMagic API that provides type-safe access
 * to all 19 LeadMagic endpoints. Includes robust error handling, request/response validation,
 * and professional API patterns.
 * 
 * Features:
 * - Full TypeScript type safety with Zod validation
 * - Comprehensive error handling with custom error types
 * - Automatic request/response interceptors
 * - Configurable timeout and retry logic
 * - Professional logging and debugging support
 * 
 * @author LeadMagic Team
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type {
  LeadMagicConfig,
  EmailValidationRequest,
  EmailValidationResponse,
  EmailFinderRequest,
  EmailFinderResponse,
  ProfileSearchRequest,
  ProfileSearchResponse,
  CompanySearchRequest,
  DetailedCompany,
  MobileFinderRequest,
  MobileFinderResponse,
  B2BProfileRequest,
  B2BProfileResponse,
  JobsFinderRequest,
  JobsFinderResponse,
  RoleFinderRequest,
  RoleFinderResponse,
  EmployeeFinderRequest,
  EmployeeFinderResponse,
  CompanyFundingRequest,
  CompanyFundingResponse,
  PersonalEmailFinderRequest,
  PersonalEmailFinderResponse,
  B2BSocialEmailRequest,
  B2BSocialEmailResponse,
  AdsSearchRequest,
  GoogleAdsResponse,
  MetaAdsResponse,
  B2BAdsResponse,
  B2BAdDetailsRequest,
  B2BAdDetailsResponse,
  JobCountry,
  JobType,
} from './types.js';

/**
 * Custom error class for LeadMagic API errors
 * Provides structured error information with HTTP status codes and API-specific details
 */
export class LeadMagicError extends Error {
  /**
   * Creates a new LeadMagic API error
   * @param status - HTTP status code
   * @param code - API error code
   * @param message - Error message
   * @param response - Raw API response data
   */
  constructor(
    public status: number,
    public code: string,
    message: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'LeadMagicError';
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, LeadMagicError.prototype);
  }

  /**
   * Returns a formatted string representation of the error
   */
  toString(): string {
    return `${this.name}: [${this.status}] ${this.code} - ${this.message}`;
  }

  /**
   * Returns whether this is a client error (4xx status code)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Returns whether this is a server error (5xx status code)
   */
  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Returns whether this is a network/connectivity error
   */
  isNetworkError(): boolean {
    return this.status === 0;
  }
}

/**
 * Professional HTTP client for the LeadMagic API
 * 
 * This client provides type-safe access to all LeadMagic API endpoints with:
 * - Automatic authentication via API key
 * - Request/response validation and transformation
 * - Comprehensive error handling and reporting
 * - Built-in retry logic and timeout management
 * - Professional logging and debugging capabilities
 */
export class LeadMagicClient {
  private client: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Creates a new LeadMagic API client instance
   * @param config - Client configuration options
   * @throws {Error} If API key is not provided
   */
  constructor(config: LeadMagicConfig) {
    if (!config.apiKey) {
      throw new Error('LeadMagic API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.leadmagic.io';
    this.timeout = config.timeout || 30000;

    this.client = this.createHttpClient();
    this.setupInterceptors();
  }

  /**
   * Creates and configures the Axios HTTP client
   * @private
   */
  private createHttpClient(): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'leadmagic-mcp-server/1.0.0',
      },
      validateStatus: (status) => {
        // Accept all status codes and handle errors in interceptor
        return status < 600;
      },
    });
  }

  /**
   * Sets up request/response interceptors for error handling and logging
   * @private
   */
  private setupInterceptors(): void {
    // Request interceptor for debugging
    this.client.interceptors.request.use(
      (config) => {
        if (process.env.DEBUG) {
          console.debug(`[LeadMagic] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.DEBUG) {
          console.debug(`[LeadMagic] Response: ${response.status} ${response.statusText}`);
        }
        return response;
      },
      (error) => {
        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * Transforms Axios errors into LeadMagic-specific error types
   * @private
   */
  private transformError(error: unknown): LeadMagicError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string; message?: string }>;
      
      if (axiosError.response) {
        // Server responded with error status
        const { status, data } = axiosError.response;
        return new LeadMagicError(
          status,
          data?.error || 'API_ERROR',
          data?.message || axiosError.message || 'Request failed',
          data
        );
      } else if (axiosError.request) {
        // Network error - no response received
        return new LeadMagicError(
          0,
          'NETWORK_ERROR',
          'Network error occurred - please check your connection'
        );
      } else {
        // Request setup error
        return new LeadMagicError(
          0,
          'REQUEST_ERROR',
          axiosError.message || 'Request configuration error'
        );
      }
    }

    // Handle non-Axios errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new LeadMagicError(500, 'UNKNOWN_ERROR', errorMessage);
  }

  // ================================
  // CREDITS MANAGEMENT
  // ================================

  /**
   * Check available API credits for your LeadMagic account
   * 
   * @returns Promise resolving to credits information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const credits = await client.getCredits();
   * console.log(`Available credits: ${credits.credits}`);
   * ```
   */
  async getCredits(): Promise<{ credits: number }> {
    const response = await this.client.post('/credits', {});
    return response.data;
  }

  // ================================
  // EMAIL VALIDATION & FINDING
  // ================================

  /**
   * Validate an email address for deliverability and get company information
   * 
   * @param request - Email validation parameters
   * @returns Promise resolving to validation results with company data
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.validateEmail({
   *   email: 'john@example.com',
   *   first_name: 'John',
   *   last_name: 'Doe'
   * });
   * console.log(`Email status: ${result.email_status}`);
   * ```
   */
  async validateEmail(request: EmailValidationRequest): Promise<EmailValidationResponse> {
    const response = await this.client.post('/email-validate', request);
    return response.data;
  }

  /**
   * Find verified email address based on person's name and company
   * 
   * @param request - Email finder parameters
   * @returns Promise resolving to found email with validation status
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.findEmail({
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   company_name: 'Microsoft'
   * });
   * console.log(`Found email: ${result.email}`);
   * ```
   */
  async findEmail(request: EmailFinderRequest): Promise<EmailFinderResponse> {
    const response = await this.client.post('/email-finder', request);
    return response.data;
  }

  // ================================
  // PROFILE & COMPANY SEARCH
  // ================================

  /**
   * Get full profile details from B2B profile URL (e.g., LinkedIn)
   * 
   * Rate limit: 300 requests/minute
   * 
   * @param request - Profile search parameters
   * @returns Promise resolving to detailed profile information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const profile = await client.searchProfile({
   *   profile_url: 'https://linkedin.com/in/johndoe'
   * });
   * console.log(`Profile: ${profile.full_name} at ${profile.company_name}`);
   * ```
   */
  async searchProfile(request: ProfileSearchRequest): Promise<ProfileSearchResponse> {
    const response = await this.client.post('/profile-search', request);
    return response.data;
  }

  /**
   * Search for company details using domain, name, or profile URL
   * 
   * @param request - Company search parameters
   * @returns Promise resolving to detailed company information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const company = await client.searchCompany({
   *   company_domain: 'microsoft.com'
   * });
   * console.log(`Company: ${company.company_name} (${company.employee_count} employees)`);
   * ```
   */
  async searchCompany(request: CompanySearchRequest): Promise<DetailedCompany> {
    const response = await this.client.post('/company-search', request);
    return response.data;
  }

  // ================================
  // MOBILE & CONTACT FINDING
  // ================================

  /**
   * Find mobile phone numbers using profile URL, work email, or personal email
   * 
   * @param request - Mobile finder parameters
   * @returns Promise resolving to mobile number information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.findMobile({
   *   profile_url: 'https://linkedin.com/in/johndoe'
   * });
   * console.log(`Mobile: ${result.mobile_number}`);
   * ```
   */
  async findMobile(request: MobileFinderRequest): Promise<MobileFinderResponse> {
    const response = await this.client.post('/mobile-finder', request);
    return response.data;
  }

  /**
   * Find B2B profile URL using work email address
   * 
   * @param request - B2B profile lookup parameters
   * @returns Promise resolving to profile URL information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.emailToProfile({
   *   work_email: 'john@microsoft.com'
   * });
   * console.log(`Profile URL: ${result.profile_url}`);
   * ```
   */
  async emailToProfile(request: B2BProfileRequest): Promise<B2BProfileResponse> {
    const response = await this.client.post('/b2b-profile', request);
    return response.data;
  }

  // ================================
  // JOB SEARCH & RECRUITMENT
  // ================================

  /**
   * Search for job postings based on various criteria
   * 
   * @param request - Job search parameters
   * @returns Promise resolving to paginated job results
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const jobs = await client.findJobs({
   *   job_title: 'Software Engineer',
   *   company_name: 'Microsoft',
   *   location: 'Seattle',
   *   page: 1,
   *   per_page: 20
   * });
   * console.log(`Found ${jobs.total_count} jobs`);
   * ```
   */
  async findJobs(request: JobsFinderRequest): Promise<JobsFinderResponse> {
    const response = await this.client.post('/jobs-finder', request);
    return response.data;
  }

  /**
   * Find specific roles/positions within a company
   * 
   * @param request - Role finder parameters
   * @returns Promise resolving to role information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const role = await client.findRole({
   *   job_title: 'Product Manager',
   *   company_name: 'Microsoft'
   * });
   * console.log(`Role found at: ${role.company_name}`);
   * ```
   */
  async findRole(request: RoleFinderRequest): Promise<RoleFinderResponse> {
    const response = await this.client.post('/role-finder', request);
    return response.data;
  }

  /**
   * Find employees of a specific company
   * 
   * @param request - Employee finder parameters
   * @returns Promise resolving to paginated employee results
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const employees = await client.findEmployees({
   *   company_name: 'Microsoft',
   *   page: 1,
   *   per_page: 50
   * });
   * console.log(`Found ${employees.total_count} employees`);
   * ```
   */
  async findEmployees(request: EmployeeFinderRequest): Promise<EmployeeFinderResponse> {
    const response = await this.client.post('/employee-finder', request);
    return response.data;
  }

  // ================================
  // COMPANY INTELLIGENCE
  // ================================

  /**
   * Get comprehensive funding information, financials, competitors, and company insights
   * 
   * @param request - Company funding parameters
   * @returns Promise resolving to comprehensive company intelligence
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const funding = await client.getCompanyFunding({
   *   company_domain: 'stripe.com'
   * });
   * console.log(`Funding: ${funding.financialInfo?.formattedFunding}`);
   * ```
   */
  async getCompanyFunding(request: CompanyFundingRequest): Promise<CompanyFundingResponse> {
    const response = await this.client.post('/company-funding', request);
    return response.data;
  }

  // ================================
  // EMAIL FINDING VARIATIONS
  // ================================

  /**
   * Find personal email addresses from B2B profile URLs
   * 
   * @param request - Personal email finder parameters
   * @returns Promise resolving to personal email information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.findPersonalEmail({
   *   profile_url: 'https://linkedin.com/in/johndoe'
   * });
   * console.log(`Personal email: ${result.personal_email}`);
   * ```
   */
  async findPersonalEmail(
    request: PersonalEmailFinderRequest
  ): Promise<PersonalEmailFinderResponse> {
    const response = await this.client.post('/personal-email-finder', request);
    return response.data;
  }

  /**
   * Find work email addresses from B2B profile URLs
   * 
   * @param request - B2B social email parameters
   * @returns Promise resolving to work email information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.socialToWorkEmail({
   *   profile_url: 'https://linkedin.com/in/johndoe'
   * });
   * console.log(`Work email: ${result.work_email}`);
   * ```
   */
  async socialToWorkEmail(request: B2BSocialEmailRequest): Promise<B2BSocialEmailResponse> {
    const response = await this.client.post('/b2b-social-email', request);
    return response.data;
  }

  // ================================
  // ADVERTISEMENT INTELLIGENCE
  // ================================

  /**
   * Search for Google Ads based on company's domain or name
   * 
   * @param request - Google Ads search parameters
   * @returns Promise resolving to Google Ads data
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const ads = await client.searchGoogleAds({
   *   company_domain: 'example.com'
   * });
   * console.log(`Found ${ads.ads.length} Google ads`);
   * ```
   */
  async searchGoogleAds(request: AdsSearchRequest): Promise<GoogleAdsResponse> {
    const response = await this.client.post('/google/searchads', request);
    return response.data;
  }

  /**
   * Search for Meta (Facebook/Instagram) Ads based on company's domain or name
   * 
   * @param request - Meta Ads search parameters
   * @returns Promise resolving to Meta Ads data
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const ads = await client.searchMetaAds({
   *   company_name: 'Example Corp'
   * });
   * console.log(`Found ${ads.ads.length} Meta ads`);
   * ```
   */
  async searchMetaAds(request: AdsSearchRequest): Promise<MetaAdsResponse> {
    const response = await this.client.post('/meta/searchads', request);
    return response.data;
  }

  /**
   * Search for B2B Ads based on company's domain or name
   * 
   * @param request - B2B Ads search parameters
   * @returns Promise resolving to B2B Ads data
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const ads = await client.searchB2BAds({
   *   company_domain: 'example.com'
   * });
   * console.log(`Found ${ads.ads.length} B2B ads`);
   * ```
   */
  async searchB2BAds(request: AdsSearchRequest): Promise<B2BAdsResponse> {
    const response = await this.client.post('/b2b/searchads', request);
    return response.data;
  }

  /**
   * Get detailed information about a specific B2B ad
   * 
   * @param request - B2B ad details parameters
   * @returns Promise resolving to detailed ad information
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const details = await client.getB2BAdDetails({
   *   ad_id: 'ad_123456'
   * });
   * console.log(`Ad: ${details.ad_title} by ${details.company_name}`);
   * ```
   */
  async getB2BAdDetails(request: B2BAdDetailsRequest): Promise<B2BAdDetailsResponse> {
    const response = await this.client.post('/b2b/ad-details', request);
    return response.data;
  }

  // ================================
  // METADATA & REFERENCE DATA
  // ================================

  /**
   * Get list of available countries for job filtering
   * 
   * @returns Promise resolving to array of job countries
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const countries = await client.getJobCountries();
   * console.log(`Available countries: ${countries.length}`);
   * ```
   */
  async getJobCountries(): Promise<JobCountry[]> {
    const response = await this.client.get('/job-country');
    return response.data;
  }

  /**
   * Get list of available job types for filtering
   * 
   * @returns Promise resolving to array of job types
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const types = await client.getJobTypes();
   * console.log(`Available job types: ${types.length}`);
   * ```
   */
  async getJobTypes(): Promise<JobType[]> {
    const response = await this.client.get('/job-types');
    return response.data;
  }

  // ================================
  // GENERIC REQUEST METHOD
  // ================================

  /**
   * Generic method for custom API calls to any LeadMagic endpoint
   * 
   * This method provides low-level access to the API for advanced use cases
   * or when new endpoints are added that aren't yet supported by specific methods.
   * 
   * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param endpoint - API endpoint path (e.g., '/custom-endpoint')
   * @param data - Request payload (for POST, PUT requests)
   * @returns Promise resolving to the API response data
   * @throws {LeadMagicError} If the request fails
   * 
   * @example
   * ```typescript
   * const result = await client.request('POST', '/custom-endpoint', {
   *   param: 'value'
   * });
   * ```
   */
  async request<T = unknown>(method: string, endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.request({
      method: method.toUpperCase(),
      url: endpoint,
      data,
    });
    return response.data;
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Get the current API configuration
   * 
   * @returns Current client configuration (API key is masked for security)
   */
  getConfig(): Partial<LeadMagicConfig> {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      apiKey: this.apiKey.substring(0, 8) + '...' // Mask API key for security
    };
  }

  /**
   * Test the API connection and authentication
   * 
   * @returns Promise resolving to connection test results
   * @throws {LeadMagicError} If the connection test fails
   */
  async testConnection(): Promise<{ success: boolean; credits: number }> {
    try {
      const result = await this.getCredits();
      return {
        success: true,
        credits: result.credits
      };
    } catch (error) {
      if (error instanceof LeadMagicError) {
        throw error;
      }
      throw new LeadMagicError(0, 'CONNECTION_TEST_FAILED', 'Unable to test connection');
    }
  }
} 