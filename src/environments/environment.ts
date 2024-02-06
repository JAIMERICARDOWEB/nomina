// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appVersion: require('../../package.json').version,
  production: false,
  SUPABASE_URL: 'https://dbtcuimfvlyzfadmifef.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidGN1aW1mdmx5emZhZG1pZmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMzY2OTAsImV4cCI6MTk5ODYxMjY5MH0.ylbF7T8fiMw0FE22XF6Q3S6gJ56iZRKW14czuyVY7Sc',
  SUPABASE_SCHEMA: 'siscolsi'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
