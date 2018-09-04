Package.describe({
  name: 'demo:prod-source-maps',
  version: '0.0.1',
  summary: 'Serve source maps in production Meteor deployments',
  git: '',
  documentation: 'README.md',
});

var dependencies = [
  'ecmascript',
  'underscore',
];

Package.onUse(function(api) {
  api.use(dependencies, ['client', 'server']);
  api.mainModule('server/main.js', 'server');
});
