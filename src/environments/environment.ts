// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appVersion: require('../../package.json').version,
  production: false,
  SUPABASE_URL: 'https://qzwzalzhmisdirpoihlr.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6d3phbHpobWlzZGlycG9paGxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTU4NTQ2OCwiZXhwIjoyMDIxMTYxNDY4fQ.MfSyrrnD54-dYnMykqYYsJ-JQaXFtiJqy0IE4sEPj2A',
  SUPABASE_SCHEMA: 'public'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
