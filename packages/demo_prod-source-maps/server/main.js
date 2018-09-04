/**
  This file demonstrates how you might approach allowing certain clients to see
  your app's sourcemaps in production. You can add IPs to this whitelist, and
  the WebApp handler will disallow anyone else from accessing a `.map` file.
*/

const ipWhitelist = [
  'your-ip-here',
];

// Just for the sake of demonstration, we allow all origins too see sourcemaps.
// If your application source code is not public, you should use the IP
// whitelist instead.
const allowAllOrigins = true;

import { WebApp } from 'meteor/webapp';

if (Meteor.isProduction) {
  WebApp.rawConnectHandlers.use((req, res, next) => {
    try {
      let forwardedFor = req.headers['x-forwarded-for'],
          whitelistedIP = allowAllOrigins || (forwardedFor && App.ipWhitelist.includes(forwardedFor.split(',')[0])),
          blacklistedFile = req.originalUrl.endsWith('.map')
      ;
      if (!whitelistedIP && blacklistedFile) {
        res.end();
        return;
      }
    } catch(e) {
      console.error(e.stack);
    }
    next();
  });
}
