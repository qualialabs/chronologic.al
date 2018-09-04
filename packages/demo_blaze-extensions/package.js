Package.describe({
  name: 'demo:blaze-extensions',
  version: '0.0.1',
  summary: 'Additional functionality for Blaze templates',
  git: '',
  documentation: 'README.md',
});

var dependencies = [
  'ecmascript',
  'underscore',
  'blaze',
];

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');
  api.use(dependencies, ['client', 'server']);
  api.mainModule('client/main.js', 'client');
});
