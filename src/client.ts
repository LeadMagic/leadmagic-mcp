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

export class LeadMagicError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public response?: any
  ) {
    super(message);
    this.name = 'LeadMagicError';
  }
}

export class LeadMagicClient {
  private client: AxiosInstance;

  constructor(config: LeadMagicConfig) {
    if (!config.apiKey) {
      throw new Error('LeadMagic API key is required');
    }

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.leadmagic.io',
      timeout: config.timeout || 30000,
      headers: {
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'leadmagic-mcp-server/1.0.0',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          throw new LeadMagicError(
            status,
            data?.error || 'API_ERROR',
            data?.message || error.message,
            data
          );
        } else if (error.request) {
          throw new LeadMagicError(0, 'NETWORK_ERROR', 'Network error occurred');
        } else {
          throw new LeadMagicError(0, 'UNKNOWN_ERROR', error.message);
        }
      }
    );
  }

  /**
   * Check available API credits
   */
  async getCredits(): Promise<{ credits: number }> {
    const response = await this.client.post('/credits', {});
    return response.data;
  }

  /**
   * Validate an email address for deliverability and get company information
   */
  async validateEmail(request: EmailValidationRequest): Promise<EmailValidationResponse> {
    const response = await this.client.post('/email-validate', request);
    return response.data;
  }

  /**
   * Find verified email address based on person's name and company
   */
  async findEmail(request: EmailFinderRequest): Promise<EmailFinderResponse> {
    const response = await this.client.post('/email-finder', request);
    return response.data;
  }

  /**
   * Get full profile details from B2B profile URL (e.g., LinkedIn)
   * Rate limit: 300 requests/minute
   */
  async searchProfile(request: ProfileSearchRequest): Promise<ProfileSearchResponse> {
    const response = await this.client.post('/profile-search', request);
    return response.data;
  }

  /**
   * Search for company details using domain, name, or profile URL
   */
  async searchCompany(request: CompanySearchRequest): Promise<DetailedCompany> {
    const response = await this.client.post('/company-search', request);
    return response.data;
  }

  /**
   * Find mobile phone numbers using profile URL, work email, or personal email
   */
  async findMobile(request: MobileFinderRequest): Promise<MobileFinderResponse> {
    const response = await this.client.post('/mobile-finder', request);
    return response.data;
  }

  /**
   * Find B2B profile URL using work email address
   */
  async emailToProfile(request: B2BProfileRequest): Promise<B2BProfileResponse> {
    const response = await this.client.post('/b2b-profile', request);
    return response.data;
  }

  /**
   * Search for job postings based on various criteria
   */
  async findJobs(request: JobsFinderRequest): Promise<JobsFinderResponse> {
    const response = await this.client.post('/jobs-finder', request);
    return response.data;
  }

  /**
   * Find specific roles/positions within a company
   */
  async findRole(request: RoleFinderRequest): Promise<RoleFinderResponse> {
    const response = await this.client.post('/role-finder', request);
    return response.data;
  }

  /**
   * Find employees of a specific company
   */
  async findEmployees(request: EmployeeFinderRequest): Promise<EmployeeFinderResponse> {
    const response = await this.client.post('/employee-finder', request);
    return response.data;
  }

  /**
   * Get comprehensive funding information, financials, competitors, and company insights
   */
  async getCompanyFunding(request: CompanyFundingRequest): Promise<CompanyFundingResponse> {
    const response = await this.client.post('/company-funding', request);
    return response.data;
  }

  /**
   * Find personal email addresses from B2B profile URLs
   */
  async findPersonalEmail(
    request: PersonalEmailFinderRequest
  ): Promise<PersonalEmailFinderResponse> {
    const response = await this.client.post('/personal-email-finder', request);
    return response.data;
  }

  /**
   * Find work email addresses from B2B profile URLs
   */
  async socialToWorkEmail(request: B2BSocialEmailRequest): Promise<B2BSocialEmailResponse> {
    const response = await this.client.post('/b2b-social-email', request);
    return response.data;
  }

  /**
   * Search for Google Ads based on company's domain or name
   */
  async searchGoogleAds(request: AdsSearchRequest): Promise<GoogleAdsResponse> {
    const response = await this.client.post('/google/searchads', request);
    return response.data;
  }

  /**
   * Search for Meta (Facebook/Instagram) Ads based on company's domain or name
   */
  async searchMetaAds(request: AdsSearchRequest): Promise<MetaAdsResponse> {
    const response = await this.client.post('/meta/searchads', request);
    return response.data;
  }

  /**
   * Search for B2B Ads based on company's domain or name
   */
  async searchB2BAds(request: AdsSearchRequest): Promise<B2BAdsResponse> {
    const response = await this.client.post('/b2b/searchads', request);
    return response.data;
  }

  /**
   * Get detailed information about a specific B2B ad
   */
  async getB2BAdDetails(request: B2BAdDetailsRequest): Promise<B2BAdDetailsResponse> {
    const response = await this.client.post('/b2b/ad-details', request);
    return response.data;
  }

  /**
   * Get list of available countries for job filtering
   */
  async getJobCountries(): Promise<JobCountry[]> {
    const response = await this.client.get('/job-country');
    return response.data;
  }

  /**
   * Get list of available job types for filtering
   */
  async getJobTypes(): Promise<JobType[]> {
    const response = await this.client.get('/job-types');
    return response.data;
  }

  /**
   * Generic method for custom API calls
   */
  async request<T = any>(method: string, endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
      });
      return response.data;
         } catch (error: unknown) {
       // Handle specific error types
       if (axios.isAxiosError(error)) {
         const axiosError = error as AxiosError<{ error?: string; message?: string }>;
         const status = axiosError.response?.status || 500;
         const errorData = axiosError.response?.data;
         
         throw new LeadMagicError(
           status,
           axiosError.code || 'REQUEST_FAILED',
           errorData?.message || axiosError.message || 'Request failed',
           errorData
         );
       }
       
       // Handle other errors
       const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
       throw new LeadMagicError(500, 'UNKNOWN_ERROR', errorMessage);
     }
  }
} 