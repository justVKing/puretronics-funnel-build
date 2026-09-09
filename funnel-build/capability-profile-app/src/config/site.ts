export const siteConfig = {
  basePath: '/puretronics-funnel-build/',
  canonicalUrl: 'https://justvking.github.io/puretronics-funnel-build/',
  // Puretronics approved this customer-facing route for application-review enquiries.
  bookingUrl: 'https://pureindia.net/contact-us' as string | null,
  technicalResourcesUrl: '#technical-evidence',
  serviceSupportUrl: 'https://pureindia.net/contact-us',
  websiteUrl: 'https://pureindia.net/',
  privacyUrl: null as string | null,
  linkedInUrl: 'https://www.linkedin.com/company/puretronics/',
  indexable: false,
  analyticsMode: 'disabled' as 'development' | 'disabled',
} as const;
