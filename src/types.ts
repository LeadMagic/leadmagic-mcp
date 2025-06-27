import { z } from 'zod';

// Base Configuration
export interface LeadMagicConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// Common response types
export const CreditsSchema = z.object({
  credits: z.number(),
});

export const ErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
});

// Location schema
export const LocationSchema = z.object({
  name: z.string().optional(),
  locality: z.string().optional(),
  region: z.string().optional(),
  metro: z.string().optional(),
  country: z.string().optional(),
  continent: z.string().optional(),
  street_address: z.string().optional(),
  address_line_2: z.string().nullable().optional(),
  postal_code: z.string().optional(),
  geo: z.string().optional(),
});

// Company schema
export const CompanySchema = z.object({
  company_name: z.string().optional(),
  company_industry: z.string().optional(),
  company_size: z.string().optional(),
  company_founded: z.number().optional(),
  company_type: z.string().optional(),
  company_linkedin_url: z.string().optional(),
  company_linkedin_id: z.string().optional(),
  company_facebook_url: z.string().nullable().optional(),
  company_twitter_url: z.string().nullable().optional(),
  company_location: LocationSchema.optional(),
});

// Email validation schemas
export const EmailValidationRequestSchema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const EmailValidationResponseSchema = z.object({
  email: z.string(),
  email_status: z.enum(['valid', 'valid_catch_all', 'invalid', 'unknown', 'catch_all']),
  credits_consumed: z.number(),
  message: z.string(),
  is_domain_catch_all: z.boolean(),
  mx_record: z.string().optional(),
  mx_provider: z.string().optional(),
  mx_security_gateway: z.boolean().optional(),
}).merge(CompanySchema);

// Email finder schemas
export const EmailFinderRequestSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  domain: z.string().optional(),
  company_name: z.string().optional(),
});

export const EmailFinderResponseSchema = z.object({
  email: z.string(),
  status: z.enum(['valid', 'valid_catch_all', 'not_found']),
  credits_consumed: z.number(),
  message: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  domain: z.string().optional(),
  is_domain_catch_all: z.boolean().optional(),
  mx_record: z.string().optional(),
  mx_provider: z.string().optional(),
  mx_security_gateway: z.boolean().optional(),
}).merge(CompanySchema);

// Profile search schemas
export const ProfileSearchRequestSchema = z.object({
  profile_url: z.string().url(),
});

export const PersonProfileSchema = z.object({
  profile_url: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  full_name: z.string().optional(),
  public_identifier: z.string().optional(),
  headline: z.string().optional(),
  company_name: z.string().optional(),
  company_size: z.string().optional(),
  company_industry: z.string().optional(),
  company_linkedin_url: z.string().optional(),
  company_website: z.string().optional(),
  total_tenure_months: z.string().optional(),
  total_tenure_days: z.string().optional(),
  total_tenure_years: z.string().optional(),
  connections: z.number().optional(),
  followers: z.number().optional(),
  country: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  experiences: z.array(z.object({
    company_id: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    caption: z.string().optional(),
  })).optional(),
  educations: z.array(z.object({
    title: z.string().optional(),
    caption: z.string().optional(),
  })).optional(),
});

export const ProfileSearchResponseSchema = PersonProfileSchema.extend({
  credits_consumed: z.number(),
});

// Company search schemas
export const CompanySearchRequestSchema = z.object({
  company_domain: z.string().optional(),
  company_name: z.string().optional(),
  profile_url: z.string().url().optional(),
});

export const DetailedCompanySchema = z.object({
  company_name: z.string().optional(),
  company_id: z.number().optional(),
  locations: z.array(z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    geographic_area: z.string().optional(),
    postal_code: z.string().optional(),
    line1: z.string().optional(),
    line2: z.string().nullable().optional(),
    description: z.string().optional(),
    headquarter: z.boolean().optional(),
    localized_name: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })).optional(),
  employee_count: z.number().optional(),
  specialities: z.array(z.string()).optional(),
  employee_count_range: z.object({
    start: z.number().optional(),
    end: z.number().optional(),
  }).optional(),
  tagline: z.string().optional(),
  follower_count: z.number().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  website_url: z.string().optional(),
  founded_on: z.object({
    month: z.number().nullable().optional(),
    year: z.number().optional(),
    day: z.number().nullable().optional(),
  }).optional(),
  universal_name: z.string().optional(),
  hashtag: z.string().optional(),
  industry_v2_taxonomy: z.string().optional(),
  url: z.string().optional(),
  credits_consumed: z.number(),
});

// Mobile finder schemas
export const MobileFinderRequestSchema = z.object({
  profile_url: z.string().url().optional(),
  work_email: z.string().email().optional(),
  personal_email: z.string().email().optional(),
});

export const MobileFinderResponseSchema = z.object({
  message: z.string(),
  credits_consumed: z.number(),
  mobile_number: z.string().nullable().optional(),
});

// B2B profile schemas
export const B2BProfileRequestSchema = z.object({
  work_email: z.string().email(),
});

export const B2BProfileResponseSchema = z.object({
  profile_url: z.string().optional(),
  message: z.string(),
  credits_consumed: z.number(),
});

// Jobs schemas
export const JobsFinderRequestSchema = z.object({
  company_name: z.string().optional(),
  company_website: z.string().optional(),
  job_title: z.string().optional(),
  location: z.string().optional(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  job_description: z.string().optional(),
  country_id: z.string().optional(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(50).default(20),
});

export const JobResultSchema = z.object({
  company: z.object({
    name: z.string().optional(),
    website_url: z.string().optional(),
    linkedin_url: z.string().optional(),
    twitter_handle: z.string().optional(),
    github_url: z.string().optional(),
    is_agency: z.boolean().optional(),
  }).optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  types: z.array(z.object({
    id: z.number().optional(),
    name: z.string().optional(),
  })).optional(),
  cities: z.array(z.object({
    geonameid: z.number().optional(),
    asciiname: z.string().optional(),
    name: z.string().optional(),
    country: z.object({
      id: z.number().optional(),
      code: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
  })).optional(),
  has_remote: z.boolean().optional(),
  published: z.string().optional(),
  expired: z.string().nullable().optional(),
  application_url: z.string().optional(),
  language: z.string().optional(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  salary_currency: z.string().optional(),
  experience_level: z.string().optional(),
  description: z.string().optional(),
});

export const JobsFinderResponseSchema = z.object({
  total_count: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
  credits_consumed: z.number(),
  results: z.array(JobResultSchema),
});

// Role finder schemas
export const RoleFinderRequestSchema = z.object({
  job_title: z.string(),
  company_name: z.string().optional(),
  company_domain: z.string().optional(),
  company_profile_url: z.string().url().optional(),
});

export const RoleFinderResponseSchema = z.object({
  message: z.string(),
  credits_consumed: z.number(),
  company_name: z.string().optional(),
  company_website: z.string().optional(),
});

// Employee finder schemas
export const EmployeeFinderRequestSchema = z.object({
  company_name: z.string(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(50).default(20),
});

export const EmployeeFinderResponseSchema = z.object({
  message: z.string(),
  total_count: z.number().optional(),
  returned_count: z.number().optional(),
  credits_consumed: z.number(),
  data: z.array(z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    title: z.string().optional(),
    website: z.string().optional(),
    company_name: z.string().optional(),
  })).optional(),
});

// Company funding schemas
export const CompanyFundingRequestSchema = z.object({
  company_domain: z.string().optional(),
  company_name: z.string().optional(),
});

export const CompanyFundingResponseSchema = z.object({
  basicInfo: z.object({
    companyName: z.string().optional(),
    description: z.string().optional(),
    shortName: z.string().optional(),
    founded: z.string().optional(),
    primaryDomain: z.string().optional(),
    phone: z.string().optional(),
    status: z.string().optional(),
    followers: z.number().optional(),
    ownership: z.string().optional(),
  }).optional(),
  financialInfo: z.object({
    revenue: z.number().optional(),
    formattedRevenue: z.string().optional(),
    totalFunding: z.number().optional(),
    formattedFunding: z.string().optional(),
  }).optional(),
  companySize: z.object({
    employees: z.number().optional(),
    employeeRange: z.string().optional(),
  }).optional(),
  topCompetitors: z.array(z.object({
    name: z.string().optional(),
    revenue: z.string().optional(),
    employees: z.string().optional(),
    website: z.string().optional(),
  })).optional(),
  credits_consumed: z.number(),
});

// Personal email finder schemas
export const PersonalEmailFinderRequestSchema = z.object({
  profile_url: z.string().url(),
});

export const PersonalEmailFinderResponseSchema = z.object({
  personal_email: z.string().nullable().optional(),
  status: z.enum(['found', 'not_found']),
  credits_consumed: z.number(),
  message: z.string(),
});

// B2B social email schemas
export const B2BSocialEmailRequestSchema = z.object({
  profile_url: z.string().url(),
});

export const B2BSocialEmailResponseSchema = z.object({
  work_email: z.string().nullable().optional(),
  status: z.enum(['found', 'not_found']),
  credits_consumed: z.number(),
  message: z.string(),
});

// Advertisement schemas
export const AdsSearchRequestSchema = z.object({
  company_domain: z.string().optional(),
  company_name: z.string().optional(),
});

export const GoogleAdSchema = z.object({
  advertiser_id: z.string().optional(),
  creative_id: z.string().optional(),
  advertiser_name: z.string().optional(),
  format: z.string().optional(),
  start: z.string().optional(),
  last_seen: z.string().optional(),
  original_url: z.string().optional(),
  variants: z.array(z.object({
    content: z.string().optional(),
    height: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
  })).optional(),
});

export const GoogleAdsResponseSchema = z.object({
  credits_consumed: z.number(),
  ads: z.array(GoogleAdSchema),
});

export const MetaAdsResponseSchema = z.object({
  credits_consumed: z.number(),
  ads: z.array(z.object({
    ad_archive_id: z.string().optional(),
    page_id: z.string().optional(),
    page_name: z.string().optional(),
    is_active: z.boolean().optional(),
    publisher_platform: z.array(z.string()).optional(),
    snapshot: z.object({
      body: z.object({
        markup: z.string().optional(),
      }).optional(),
      title: z.string().optional(),
      cta_text: z.string().optional(),
      images: z.array(z.object({
        original_image_url: z.string().optional(),
      })).optional(),
      videos: z.array(z.object({
        video_hd_url: z.string().optional(),
      })).optional(),
    }).optional(),
  })),
});

export const B2BAdsResponseSchema = z.object({
  credits_consumed: z.number(),
  ads: z.array(z.object({
    ad_id: z.string().optional(),
    company_name: z.string().optional(),
    ad_title: z.string().optional(),
    ad_description: z.string().optional(),
    ad_url: z.string().optional(),
  })),
});

export const B2BAdDetailsRequestSchema = z.object({
  ad_id: z.string(),
});

export const B2BAdDetailsResponseSchema = z.object({
  ad_id: z.string(),
  company_name: z.string().optional(),
  ad_title: z.string().optional(),
  ad_description: z.string().optional(),
  ad_url: z.string().optional(),
  campaign_info: z.object({
    campaign_name: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().nullable().optional(),
  }).optional(),
  credits_consumed: z.number(),
});

// Job metadata schemas
export const JobCountrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const JobTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Type exports
export type Location = z.infer<typeof LocationSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type EmailValidationRequest = z.infer<typeof EmailValidationRequestSchema>;
export type EmailValidationResponse = z.infer<typeof EmailValidationResponseSchema>;
export type EmailFinderRequest = z.infer<typeof EmailFinderRequestSchema>;
export type EmailFinderResponse = z.infer<typeof EmailFinderResponseSchema>;
export type ProfileSearchRequest = z.infer<typeof ProfileSearchRequestSchema>;
export type ProfileSearchResponse = z.infer<typeof ProfileSearchResponseSchema>;
export type PersonProfile = z.infer<typeof PersonProfileSchema>;
export type CompanySearchRequest = z.infer<typeof CompanySearchRequestSchema>;
export type DetailedCompany = z.infer<typeof DetailedCompanySchema>;
export type MobileFinderRequest = z.infer<typeof MobileFinderRequestSchema>;
export type MobileFinderResponse = z.infer<typeof MobileFinderResponseSchema>;
export type B2BProfileRequest = z.infer<typeof B2BProfileRequestSchema>;
export type B2BProfileResponse = z.infer<typeof B2BProfileResponseSchema>;
export type JobsFinderRequest = z.infer<typeof JobsFinderRequestSchema>;
export type JobsFinderResponse = z.infer<typeof JobsFinderResponseSchema>;
export type JobResult = z.infer<typeof JobResultSchema>;
export type RoleFinderRequest = z.infer<typeof RoleFinderRequestSchema>;
export type RoleFinderResponse = z.infer<typeof RoleFinderResponseSchema>;
export type EmployeeFinderRequest = z.infer<typeof EmployeeFinderRequestSchema>;
export type EmployeeFinderResponse = z.infer<typeof EmployeeFinderResponseSchema>;
export type CompanyFundingRequest = z.infer<typeof CompanyFundingRequestSchema>;
export type CompanyFundingResponse = z.infer<typeof CompanyFundingResponseSchema>;
export type PersonalEmailFinderRequest = z.infer<typeof PersonalEmailFinderRequestSchema>;
export type PersonalEmailFinderResponse = z.infer<typeof PersonalEmailFinderResponseSchema>;
export type B2BSocialEmailRequest = z.infer<typeof B2BSocialEmailRequestSchema>;
export type B2BSocialEmailResponse = z.infer<typeof B2BSocialEmailResponseSchema>;
export type AdsSearchRequest = z.infer<typeof AdsSearchRequestSchema>;
export type GoogleAdsResponse = z.infer<typeof GoogleAdsResponseSchema>;
export type MetaAdsResponse = z.infer<typeof MetaAdsResponseSchema>;
export type B2BAdsResponse = z.infer<typeof B2BAdsResponseSchema>;
export type B2BAdDetailsRequest = z.infer<typeof B2BAdDetailsRequestSchema>;
export type B2BAdDetailsResponse = z.infer<typeof B2BAdDetailsResponseSchema>;
export type JobCountry = z.infer<typeof JobCountrySchema>;
export type JobType = z.infer<typeof JobTypeSchema>; 