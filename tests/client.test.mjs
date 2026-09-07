import { test } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { LeadMagicClient, LeadMagicError } from '../dist/client.js';
import { B2BAdDetailsRequestSchema, EmployeeFinderRequestSchema } from '../dist/types.js';
const key='test-only-placeholder';
const routes={getCredits:['get','/v1/credits'],validateEmail:['post','/v1/people/email-validation'],findEmail:['post','/v1/people/email-finder'],searchProfile:['post','/v1/people/profile-search'],searchCompany:['post','/v1/companies/company-search'],findMobile:['post','/v1/people/mobile-finder'],emailToProfile:['post','/v1/people/b2b-profile'],findJobs:['post','/v1/jobs/jobs-finder'],findRole:['post','/v1/people/role-finder'],findEmployees:['post','/v1/people/employee-finder'],getCompanyFunding:['post','/v1/companies/company-funding'],findPersonalEmail:['post','/v1/people/personal-email-finder'],socialToWorkEmail:['post','/v1/people/b2b-profile-email'],searchGoogleAds:['post','/v1/ads/google-ads-search'],searchMetaAds:['post','/v1/ads/meta-ads-search'],searchB2BAds:['post','/v1/ads/b2b-ads-search'],getB2BAdDetails:['post','/v1/ads/b2b-ads-details'],getJobCountries:['get','/v1/jobs/countries'],getJobTypes:['get','/v1/jobs/job-types']};
for(const [name,[method,path]] of Object.entries(routes))test(`${name} uses public REST route`,async()=>{
 const client=new LeadMagicClient({apiKey:key});
 client.client.defaults.adapter=async config=>{
  assert.equal(config.url,path);assert.equal(config.method,method);assert.equal(config.headers.get('X-API-Key'),key);
  assert.equal(config.maxRedirects,0);assert.equal(config.validateStatus(200),true);assert.equal(config.validateStatus(401),false);assert.equal(config.validateStatus(429),false);assert.equal(config.validateStatus(500),false);
  return {status:200,statusText:'OK',headers:{},config,data:{credits:100}};
 };
 assert.equal(typeof client[name],'function');await client[name]({});
});
test('HTTP errors omit upstream data and credentials',async()=>{
 const client=new LeadMagicClient({apiKey:key});let calls=0;
 client.client.defaults.adapter=async config=>{calls++;throw new axios.AxiosError('sensitive request','ERR_BAD_REQUEST',config,{}, {status:401,data:{message:key},config,headers:{},statusText:'Unauthorized'});};
 await assert.rejects(client.getCredits(),error=>{assert.ok(error instanceof LeadMagicError);assert.equal(error.status,401);assert.equal(error.response,undefined);assert.ok(!error.message.includes(key));return true;});
 assert.equal(calls,1);assert.equal(client.getConfig().apiKey,'[REDACTED]');
});
test('current ad and employee inputs',()=>{assert.deepEqual(B2BAdDetailsRequestSchema.parse({ad_url:'https://example.com/ad'}),{ad_url:'https://example.com/ad'});assert.equal(EmployeeFinderRequestSchema.parse({company_name:'Example'}).limit,20);});

test('generic requests cannot forward credentials to another origin',async()=>{const client=new LeadMagicClient({apiKey:key});for(const path of ['https://example.com','//example.com','/\\example.com'])await assert.rejects(client.request('get',path),/relative API path/);});
