export const siteConfig = {
  basePath: '/puretronics-funnel-build/',
  canonicalUrl: 'https://justvking.github.io/puretronics-funnel-build/',
  // Set only after Puretronics approves the booking destination or contact fallback.
  bookingUrl: null as string | null,
  technicalResourcesUrl: '#technical-evidence',
  serviceSupportUrl: 'https://pureindia.net/contact-us',
  websiteUrl: 'https://pureindia.net/',
  privacyUrl: null as string | null,
  linkedInUrl: 'https://www.linkedin.com/company/puretronics/',
  indexable: false,
  analyticsMode: 'disabled' as 'development' | 'disabled',
} as const;
