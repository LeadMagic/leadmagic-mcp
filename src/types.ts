/**
 * LeadMagic MCP Server - Type Definitions
 * 
 * Comprehensive TypeScript type definitions and Zod schemas for all LeadMagic API endpoints.
 * This file provides type safety, runtime validation, and documentation for the entire API surface.
 * 
 * API Coverage:
 * - Email validation and finding (3 endpoints)
 * - Profile and company search (4 endpoints) 
 * - Mobile number finding (1 endpoint)
 * - Job search and metadata (4 endpoints)
 * - Employee and role finding (2 endpoints)
 * - Company funding and intelligence (1 endpoint)
 * - Advertisement intelligence (4 endpoints)
 * - Credits management (1 endpoint)
 * 
 * @author LeadMagic Team
 * @version 1.0.0
 */

import { z } from 'zod';

// ================================
// CORE CONFIGURATION TYPES
// ================================

/**
 * Configuration interface for LeadMagic API client
 * @interface LeadMagicConfig
 */
export interface LeadMagicConfig {
  /** LeadMagic API key (required) */
  apiKey: string;
  /** Custom API base URL (optional, defaults to https://api.leadmagic.io) */
  baseUrl?: string;
  /** Request timeout in milliseconds (optional, defaults to 30000) */
  timeout?: number;
}

// ================================
// COMMON RESPONSE SCHEMAS
// ================================

/**
 * Schema for API credits response
 */
export const CreditsSchema = z.object({
  /** Number of available credits */
  credits: z.number(),
});

/**
 * Schema for API error responses
 */
export const ErrorSchema = z.object({
  /** Error code identifier */
  error: z.string(),
  /** Human-readable error message */
  message: z.string(),
});

// ================================
// GEOGRAPHIC LOCATION SCHEMAS
// ================================

/**
 * Schema for geographic location information
 * Used across multiple API endpoints for address and location data
 */
export const LocationSchema = z.object({
  /** Location name */
  name: z.string().optional(),
  /** City or locality */
  locality: z.string().optional(),
  /** State, province, or region */
  region: z.string().optional(),
  /** Metropolitan area */
  metro: z.string().optional(),
  /** Country name */
  country: z.string().optional(),
  /** Continent name */
  continent: z.string().optional(),
  /** Street address line 1 */
  street_address: z.string().optional(),
  /** Street address line 2 (can be null) */
  address_line_2: z.string().nullable().optional(),
  /** Postal or ZIP code */
  postal_code: z.string().optional(),
  /** Geographic coordinates */
  geo: z.string().optional(),
});

// ================================
// COMPANY INFORMATION SCHEMAS
// ================================

/**
 * Schema for basic company information
 * Reused across multiple endpoints that return company data
 */
export const CompanySchema = z.object({
  /** Company name */
  company_name: z.string().optional(),
  /** Primary industry */
  company_industry: z.string().optional(),
  /** Company size classification */
  company_size: z.string().optional(),
  /** Year the company was founded */
  company_founded: z.number().optional(),
  /** Type of company (e.g., public, private) */
  company_type: z.string().optional(),
  /** LinkedIn company profile URL */
  company_linkedin_url: z.string().optional(),
  /** LinkedIn company ID */
  company_linkedin_id: z.string().optional(),
  /** Facebook page URL (can be null) */
  company_facebook_url: z.string().nullable().optional(),
  /** Twitter profile URL (can be null) */
  company_twitter_url: z.string().nullable().optional(),
  /** Company location information */
  company_location: LocationSchema.optional(),
});

// ================================
// EMAIL VALIDATION & FINDING
// ================================

/**
 * Request schema for email validation
 */
export const EmailValidationRequestSchema = z.object({
  /** Email address to validate */
  email: z.string().email(),
  /** Optional first name for additional context */
  first_name: z.string().optional(),
  /** Optional last name for additional context */
  last_name: z.string().optional(),
});

/**
 * Response schema for email validation
 * Includes deliverability status and associated company information
 */
export const EmailValidationResponseSchema = z.object({
  /** The validated email address */
  email: z.string(),
  /** Email deliverability status */
  email_status: z.enum(['valid', 'valid_catch_all', 'invalid', 'unknown', 'catch_all']),
  /** Number of credits consumed for this request */
  credits_consumed: z.number(),
  /** Response message */
  message: z.string(),
  /** Whether the domain has catch-all configuration */
  is_domain_catch_all: z.boolean(),
  /** MX record for the email domain */
  mx_record: z.string().optional(),
  /** Email provider (e.g., Gmail, Outlook) */
  mx_provider: z.string().optional(),
  /** Whether MX uses security gateway */
  mx_security_gateway: z.boolean().optional(),
}).merge(CompanySchema);

/**
 * Request schema for email finder
 */
export const EmailFinderRequestSchema = z.object({
  /** First name of the person */
  first_name: z.string(),
  /** Last name of the person */
  last_name: z.string(),
  /** Company domain (alternative to company_name) */
  domain: z.string().optional(),
  /** Company name (alternative to domain) */
  company_name: z.string().optional(),
});

/**
 * Response schema for email finder
 * Returns found email with validation status and company data
 */
export const EmailFinderResponseSchema = z.object({
  /** Found email address */
  email: z.string(),
  /** Email finder status */
  status: z.enum(['valid', 'valid_catch_all', 'not_found']),
  /** Number of credits consumed */
  credits_consumed: z.number(),
  /** Response message */
  message: z.string(),
  /** Person's first name */
  first_name: z.string().optional(),
  /** Person's last name */
  last_name: z.string().optional(),
  /** Email domain */
  domain: z.string().optional(),
  /** Whether domain has catch-all configuration */
  is_domain_catch_all: z.boolean().optional(),
  /** MX record information */
  mx_record: z.string().optional(),
  /** Email provider name */
  mx_provider: z.string().optional(),
  /** Security gateway indicator */
  mx_security_gateway: z.boolean().optional(),
}).merge(CompanySchema);

// ================================
// PROFILE SEARCH SCHEMAS
// ================================

/**
 * Request schema for profile search
 */
export const ProfileSearchRequestSchema = z.object({
  /** B2B profile URL (e.g., LinkedIn profile) */
  profile_url: z.string().url(),
});

/**
 * Schema for detailed person profile information
 */
export const PersonProfileSchema = z.object({
  /** Profile URL */
  profile_url: z.string().optional(),
  /** Person's first name */
  first_name: z.string().optional(),
  /** Person's last name */
  last_name: z.string().optional(),
  /** Full name */
  full_name: z.string().optional(),
  /** LinkedIn public identifier */
  public_identifier: z.string().optional(),
  /** Professional headline */
  headline: z.string().optional(),
  /** Current company name */
  company_name: z.string().optional(),
  /** Company size */
  company_size: z.string().optional(),
  /** Company industry */
  company_industry: z.string().optional(),
  /** Company LinkedIn URL */
  company_linkedin_url: z.string().optional(),
  /** Company website */
  company_website: z.string().optional(),
  /** Total tenure in months */
  total_tenure_months: z.string().optional(),
  /** Total tenure in days */
  total_tenure_days: z.string().optional(),
  /** Total tenure in years */
  total_tenure_years: z.string().optional(),
  /** Number of LinkedIn connections */
  connections: z.number().optional(),
  /** Number of LinkedIn followers */
  followers: z.number().optional(),
  /** Country location */
  country: z.string().optional(),
  /** Location string */
  location: z.string().optional(),
  /** About/bio section */
  about: z.string().optional(),
  /** Work experience history */
  experiences: z.array(z.object({
    /** Company ID */
    company_id: z.string().optional(),
    /** Job title */
    title: z.string().optional(),
    /** Company name */
    subtitle: z.string().optional(),
    /** Additional details */
    caption: z.string().optional(),
  })).optional(),
  /** Education history */
  educations: z.array(z.object({
    /** Institution or degree */
    title: z.string().optional(),
    /** Additional education details */
    caption: z.string().optional(),
  })).optional(),
});

/**
 * Response schema for profile search
 */
export const ProfileSearchResponseSchema = PersonProfileSchema.extend({
  /** Number of credits consumed */
  credits_consumed: z.number(),
});

// ================================
// COMPANY SEARCH SCHEMAS
// ================================

/**
 * Request schema for company search
 */
export const CompanySearchRequestSchema = z.object({
  /** Company domain name */
  company_domain: z.string().optional(),
  /** Company name */
  company_name: z.string().optional(),
  /** Company profile URL */
  profile_url: z.string().url().optional(),
});

/**
 * Schema for detailed company information
 * Enhanced version of basic company schema with additional details
 */
export const DetailedCompanySchema = z.object({
  /** Company name */
  company_name: z.string().optional(),
  /** Unique company identifier */
  company_id: z.number().optional(),
  /** Array of company locations */
  locations: z.array(z.object({
    /** Country */
    country: z.string().optional(),
    /** City */
    city: z.string().optional(),
    /** Geographic area/region */
    geographic_area: z.string().optional(),
    /** Postal code */
    postal_code: z.string().optional(),
    /** Address line 1 */
    line1: z.string().optional(),
    /** Address line 2 (can be null) */
    line2: z.string().nullable().optional(),
    /** Location description */
    description: z.string().optional(),
    /** Whether this is headquarters */
    headquarter: z.boolean().optional(),
    /** Localized name */
    localized_name: z.string().optional(),
    /** Latitude coordinate */
    latitude: z.number().optional(),
    /** Longitude coordinate */
    longitude: z.number().optional(),
  })).optional(),
  /** Total number of employees */
  employee_count: z.number().optional(),
  /** Company specialties/focus areas */
  specialities: z.array(z.string()).optional(),
  /** Employee count range */
  employee_count_range: z.object({
    /** Range start */
    start: z.number().optional(),
    /** Range end */
    end: z.number().optional(),
  }).optional(),
  /** Company tagline */
  tagline: z.string().optional(),
  /** Number of followers */
  follower_count: z.number().optional(),
  /** Primary industry */
  industry: z.string().optional(),
  /** Company description */
  description: z.string().optional(),
  /** Website URL */
  website_url: z.string().optional(),
  /** Company founding date */
  founded_on: z.object({
    /** Month (can be null) */
    month: z.number().nullable().optional(),
    /** Year */
    year: z.number().optional(),
    /** Day (can be null) */
    day: z.number().nullable().optional(),
  }).optional(),
  /** Universal name identifier */
  universal_name: z.string().optional(),
  /** Company hashtag */
  hashtag: z.string().optional(),
  /** Industry taxonomy classification */
  industry_v2_taxonomy: z.string().optional(),
  /** Profile URL */
  url: z.string().optional(),
  /** Credits consumed for this request */
  credits_consumed: z.number(),
});

// ================================
// MOBILE NUMBER FINDING
// ================================

/**
 * Request schema for mobile finder
 */
export const MobileFinderRequestSchema = z.object({
  /** B2B profile URL */
  profile_url: z.string().url().optional(),
  /** Work email address */
  work_email: z.string().email().optional(),
  /** Personal email address */
  personal_email: z.string().email().optional(),
});

/**
 * Response schema for mobile finder
 */
export const MobileFinderResponseSchema = z.object({
  /** Response message */
  message: z.string(),
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Found mobile number (can be null) */
  mobile_number: z.string().nullable().optional(),
});

// ================================
// B2B PROFILE CONVERSION
// ================================

/**
 * Request schema for B2B profile lookup (email to profile)
 */
export const B2BProfileRequestSchema = z.object({
  /** Work email address */
  work_email: z.string().email(),
});

/**
 * Response schema for B2B profile lookup
 */
export const B2BProfileResponseSchema = z.object({
  /** Found profile URL */
  profile_url: z.string().optional(),
  /** Response message */
  message: z.string(),
  /** Credits consumed */
  credits_consumed: z.number(),
});

// ================================
// JOB SEARCH SCHEMAS
// ================================

/**
 * Request schema for job finder
 */
export const JobsFinderRequestSchema = z.object({
  /** Company name to search within */
  company_name: z.string().optional(),
  /** Company website URL */
  company_website: z.string().optional(),
  /** Job title to search for */
  job_title: z.string().optional(),
  /** Location filter */
  location: z.string().optional(),
  /** Experience level filter */
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  /** Job description keywords */
  job_description: z.string().optional(),
  /** Country ID for filtering */
  country_id: z.string().optional(),
  /** Page number for pagination */
  page: z.number().min(1).default(1),
  /** Results per page */
  per_page: z.number().min(1).max(50).default(20),
});

/**
 * Schema for individual job result
 */
export const JobResultSchema = z.object({
  /** Company information */
  company: z.object({
    /** Company name */
    name: z.string().optional(),
    /** Company website */
    website_url: z.string().optional(),
    /** LinkedIn company URL */
    linkedin_url: z.string().optional(),
    /** Twitter handle */
    twitter_handle: z.string().optional(),
    /** GitHub URL */
    github_url: z.string().optional(),
    /** Whether company is an agency */
    is_agency: z.boolean().optional(),
  }).optional(),
  /** Job title */
  title: z.string().optional(),
  /** Job location */
  location: z.string().optional(),
  /** Job types */
  types: z.array(z.object({
    /** Type ID */
    id: z.number().optional(),
    /** Type name */
    name: z.string().optional(),
  })).optional(),
  /** Cities where job is available */
  cities: z.array(z.object({
    /** Geographic name ID */
    geonameid: z.number().optional(),
    /** ASCII name */
    asciiname: z.string().optional(),
    /** City name */
    name: z.string().optional(),
    /** Country information */
    country: z.object({
      /** Country ID */
      id: z.number().optional(),
      /** Country code */
      code: z.string().optional(),
      /** Country name */
      name: z.string().optional(),
    }).optional(),
  })).optional(),
  /** Whether remote work is available */
  has_remote: z.boolean().optional(),
  /** Publication date */
  published: z.string().optional(),
  /** Expiration date (can be null) */
  expired: z.string().nullable().optional(),
  /** Application URL */
  application_url: z.string().optional(),
  /** Job posting language */
  language: z.string().optional(),
  /** Minimum salary */
  salary_min: z.string().optional(),
  /** Maximum salary */
  salary_max: z.string().optional(),
  /** Salary currency */
  salary_currency: z.string().optional(),
  /** Required experience level */
  experience_level: z.string().optional(),
  /** Job description */
  description: z.string().optional(),
});

/**
 * Response schema for job finder
 */
export const JobsFinderResponseSchema = z.object({
  /** Total number of matching jobs */
  total_count: z.number(),
  /** Current page number */
  page: z.number(),
  /** Results per page */
  per_page: z.number(),
  /** Total number of pages */
  total_pages: z.number(),
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Array of job results */
  results: z.array(JobResultSchema),
});

// ================================
// ROLE & EMPLOYEE FINDING
// ================================

/**
 * Request schema for role finder
 */
export const RoleFinderRequestSchema = z.object({
  /** Job title to search for */
  job_title: z.string(),
  /** Company name */
  company_name: z.string().optional(),
  /** Company domain */
  company_domain: z.string().optional(),
  /** Company profile URL */
  company_profile_url: z.string().url().optional(),
});

/**
 * Response schema for role finder
 */
export const RoleFinderResponseSchema = z.object({
  /** Response message */
  message: z.string(),
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Company name */
  company_name: z.string().optional(),
  /** Company website */
  company_website: z.string().optional(),
});

/**
 * Request schema for employee finder
 */
export const EmployeeFinderRequestSchema = z.object({
  /** Company name to search within */
  company_name: z.string(),
  /** Page number for pagination */
  page: z.number().min(1).default(1),
  /** Results per page */
  per_page: z.number().min(1).max(50).default(20),
});

/**
 * Response schema for employee finder
 */
export const EmployeeFinderResponseSchema = z.object({
  /** Response message */
  message: z.string(),
  /** Total count of employees */
  total_count: z.number().optional(),
  /** Count of returned results */
  returned_count: z.number().optional(),
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Array of employee data */
  data: z.array(z.object({
    /** Employee first name */
    first_name: z.string().optional(),
    /** Employee last name */
    last_name: z.string().optional(),
    /** Job title */
    title: z.string().optional(),
    /** Website URL */
    website: z.string().optional(),
    /** Company name */
    company_name: z.string().optional(),
  })).optional(),
});

// ================================
// COMPANY FUNDING & INTELLIGENCE
// ================================

/**
 * Request schema for company funding information
 */
export const CompanyFundingRequestSchema = z.object({
  /** Company domain */
  company_domain: z.string().optional(),
  /** Company name */
  company_name: z.string().optional(),
});

/**
 * Response schema for company funding information
 * Provides comprehensive financial and competitive intelligence
 */
export const CompanyFundingResponseSchema = z.object({
  /** Basic company information */
  basicInfo: z.object({
    /** Company name */
    companyName: z.string().optional(),
    /** Company description */
    description: z.string().optional(),
    /** Short name */
    shortName: z.string().optional(),
    /** Founded date */
    founded: z.string().optional(),
    /** Primary domain */
    primaryDomain: z.string().optional(),
    /** Phone number */
    phone: z.string().optional(),
    /** Company status */
    status: z.string().optional(),
    /** Number of followers */
    followers: z.number().optional(),
    /** Ownership type */
    ownership: z.string().optional(),
  }).optional(),
  /** Financial information */
  financialInfo: z.object({
    /** Revenue amount */
    revenue: z.number().optional(),
    /** Formatted revenue string */
    formattedRevenue: z.string().optional(),
    /** Total funding raised */
    totalFunding: z.number().optional(),
    /** Formatted funding string */
    formattedFunding: z.string().optional(),
  }).optional(),
  /** Company size information */
  companySize: z.object({
    /** Number of employees */
    employees: z.number().optional(),
    /** Employee range description */
    employeeRange: z.string().optional(),
  }).optional(),
  /** Top competitors */
  topCompetitors: z.array(z.object({
    /** Competitor name */
    name: z.string().optional(),
    /** Competitor revenue */
    revenue: z.string().optional(),
    /** Competitor employee count */
    employees: z.string().optional(),
    /** Competitor website */
    website: z.string().optional(),
  })).optional(),
  /** Credits consumed */
  credits_consumed: z.number(),
});

// ================================
// EMAIL FINDING VARIATIONS
// ================================

/**
 * Request schema for personal email finder
 */
export const PersonalEmailFinderRequestSchema = z.object({
  /** B2B profile URL */
  profile_url: z.string().url(),
});

/**
 * Response schema for personal email finder
 */
export const PersonalEmailFinderResponseSchema = z.object({
  /** Found personal email (can be null) */
  personal_email: z.string().nullable().optional(),
  /** Search status */
  status: z.enum(['found', 'not_found']),
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Response message */
  message: z.string(),
});

/**
 * Request schema for B2B social to work email conversion
 */
export const B2BSocialEmailRequestSchema = z.object({
  /** B2B profile URL */
  profile_url: z.string().url(),
});

/**
 * Response schema for B2B social to work email conversion
 */
export const B2BSocialEmailResponseSchema = z.object({
  /** Found work email (can be null) */
  work_email: z.string().nullable().optional(),
  /** Search status */
  status: z.enum(['found', 'not_found']),
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Response message */
  message: z.string(),
});

// ================================
// ADVERTISEMENT INTELLIGENCE
// ================================

/**
 * Request schema for advertisement searches
 */
export const AdsSearchRequestSchema = z.object({
  /** Company domain */
  company_domain: z.string().optional(),
  /** Company name */
  company_name: z.string().optional(),
});

/**
 * Schema for Google Ad information
 */
export const GoogleAdSchema = z.object({
  /** Advertiser ID */
  advertiser_id: z.string().optional(),
  /** Creative ID */
  creative_id: z.string().optional(),
  /** Advertiser name */
  advertiser_name: z.string().optional(),
  /** Ad format */
  format: z.string().optional(),
  /** Campaign start date */
  start: z.string().optional(),
  /** Last seen date */
  last_seen: z.string().optional(),
  /** Original URL */
  original_url: z.string().optional(),
  /** Ad variants */
  variants: z.array(z.object({
    /** Ad content */
    content: z.string().optional(),
    /** Height in pixels (can be null) */
    height: z.number().nullable().optional(),
    /** Width in pixels (can be null) */
    width: z.number().nullable().optional(),
  })).optional(),
});

/**
 * Response schema for Google Ads search
 */
export const GoogleAdsResponseSchema = z.object({
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Array of Google ads */
  ads: z.array(GoogleAdSchema),
});

/**
 * Response schema for Meta (Facebook/Instagram) Ads search
 */
export const MetaAdsResponseSchema = z.object({
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Array of Meta ads */
  ads: z.array(z.object({
    /** Ad archive ID */
    ad_archive_id: z.string().optional(),
    /** Page ID */
    page_id: z.string().optional(),
    /** Page name */
    page_name: z.string().optional(),
    /** Whether ad is currently active */
    is_active: z.boolean().optional(),
    /** Publisher platforms */
    publisher_platform: z.array(z.string()).optional(),
    /** Ad snapshot data */
    snapshot: z.object({
      /** Ad body content */
      body: z.object({
        /** HTML markup */
        markup: z.string().optional(),
      }).optional(),
      /** Ad title */
      title: z.string().optional(),
      /** Call-to-action text */
      cta_text: z.string().optional(),
      /** Ad images */
      images: z.array(z.object({
        /** Original image URL */
        original_image_url: z.string().optional(),
      })).optional(),
      /** Ad videos */
      videos: z.array(z.object({
        /** High definition video URL */
        video_hd_url: z.string().optional(),
      })).optional(),
    }).optional(),
  })),
});

/**
 * Response schema for B2B Ads search
 */
export const B2BAdsResponseSchema = z.object({
  /** Credits consumed */
  credits_consumed: z.number(),
  /** Array of B2B ads */
  ads: z.array(z.object({
    /** Ad ID */
    ad_id: z.string().optional(),
    /** Company name */
    company_name: z.string().optional(),
    /** Ad title */
    ad_title: z.string().optional(),
    /** Ad description */
    ad_description: z.string().optional(),
    /** Ad URL */
    ad_url: z.string().optional(),
  })),
});

/**
 * Request schema for B2B ad details
 */
export const B2BAdDetailsRequestSchema = z.object({
  /** Ad ID to get details for */
  ad_id: z.string(),
});

/**
 * Response schema for B2B ad details
 */
export const B2BAdDetailsResponseSchema = z.object({
  /** Ad ID */
  ad_id: z.string(),
  /** Company name */
  company_name: z.string().optional(),
  /** Ad title */
  ad_title: z.string().optional(),
  /** Ad description */
  ad_description: z.string().optional(),
  /** Ad URL */
  ad_url: z.string().optional(),
  /** Campaign information */
  campaign_info: z.object({
    /** Campaign name */
    campaign_name: z.string().optional(),
    /** Campaign start date */
    start_date: z.string().optional(),
    /** Campaign end date (can be null) */
    end_date: z.string().nullable().optional(),
  }).optional(),
  /** Credits consumed */
  credits_consumed: z.number(),
});

// ================================
// JOB METADATA SCHEMAS
// ================================

/**
 * Schema for job country information
 */
export const JobCountrySchema = z.object({
  /** Country ID */
  id: z.string(),
  /** Country name */
  name: z.string(),
});

/**
 * Schema for job type information
 */
export const JobTypeSchema = z.object({
  /** Job type ID */
  id: z.number(),
  /** Job type name */
  name: z.string(),
});

// ================================
// TYPESCRIPT TYPE EXPORTS
// ================================

/** Configuration type for LeadMagic client */
export type Location = z.infer<typeof LocationSchema>;
export type Company = z.infer<typeof CompanySchema>;

/** Email validation and finding types */
export type EmailValidationRequest = z.infer<typeof EmailValidationRequestSchema>;
export type EmailValidationResponse = z.infer<typeof EmailValidationResponseSchema>;
export type EmailFinderRequest = z.infer<typeof EmailFinderRequestSchema>;
export type EmailFinderResponse = z.infer<typeof EmailFinderResponseSchema>;

/** Profile and company search types */
export type ProfileSearchRequest = z.infer<typeof ProfileSearchRequestSchema>;
export type ProfileSearchResponse = z.infer<typeof ProfileSearchResponseSchema>;
export type PersonProfile = z.infer<typeof PersonProfileSchema>;
export type CompanySearchRequest = z.infer<typeof CompanySearchRequestSchema>;
export type DetailedCompany = z.infer<typeof DetailedCompanySchema>;

/** Mobile and B2B profile types */
export type MobileFinderRequest = z.infer<typeof MobileFinderRequestSchema>;
export type MobileFinderResponse = z.infer<typeof MobileFinderResponseSchema>;
export type B2BProfileRequest = z.infer<typeof B2BProfileRequestSchema>;
export type B2BProfileResponse = z.infer<typeof B2BProfileResponseSchema>;

/** Job search and employee types */
export type JobsFinderRequest = z.infer<typeof JobsFinderRequestSchema>;
export type JobsFinderResponse = z.infer<typeof JobsFinderResponseSchema>;
export type JobResult = z.infer<typeof JobResultSchema>;
export type RoleFinderRequest = z.infer<typeof RoleFinderRequestSchema>;
export type RoleFinderResponse = z.infer<typeof RoleFinderResponseSchema>;
export type EmployeeFinderRequest = z.infer<typeof EmployeeFinderRequestSchema>;
export type EmployeeFinderResponse = z.infer<typeof EmployeeFinderResponseSchema>;

/** Company funding and intelligence types */
export type CompanyFundingRequest = z.infer<typeof CompanyFundingRequestSchema>;
export type CompanyFundingResponse = z.infer<typeof CompanyFundingResponseSchema>;

/** Email finding variation types */
export type PersonalEmailFinderRequest = z.infer<typeof PersonalEmailFinderRequestSchema>;
export type PersonalEmailFinderResponse = z.infer<typeof PersonalEmailFinderResponseSchema>;
export type B2BSocialEmailRequest = z.infer<typeof B2BSocialEmailRequestSchema>;
export type B2BSocialEmailResponse = z.infer<typeof B2BSocialEmailResponseSchema>;

/** Advertisement intelligence types */
export type AdsSearchRequest = z.infer<typeof AdsSearchRequestSchema>;
export type GoogleAdsResponse = z.infer<typeof GoogleAdsResponseSchema>;
export type MetaAdsResponse = z.infer<typeof MetaAdsResponseSchema>;
export type B2BAdsResponse = z.infer<typeof B2BAdsResponseSchema>;
export type B2BAdDetailsRequest = z.infer<typeof B2BAdDetailsRequestSchema>;
export type B2BAdDetailsResponse = z.infer<typeof B2BAdDetailsResponseSchema>;

/** Job metadata types */
export type JobCountry = z.infer<typeof JobCountrySchema>;
export type JobType = z.infer<typeof JobTypeSchema>; 