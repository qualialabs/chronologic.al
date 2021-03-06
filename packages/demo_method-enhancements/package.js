Package.describe({
  name: 'demo:method-enhancements',
  version: '0.0.1',
  summary: 'Additions to native Meteor Method behavior',
  git: '',
  documentation: 'README.md',
});

var dependencies = [
  'ecmascript',
  'underscore',
];

Package.onUse(function(api) {
  api.use(dependencies, ['client', 'server']);
  api.mainModule('client/main.js', 'client');
  api.mainModule('server/main.js', 'server');
});
