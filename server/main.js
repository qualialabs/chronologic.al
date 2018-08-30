import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import '../common';

Meteor.users.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Meteor.publish('users', function() {
  return Meteor.users.find();
});

// We can monkey-patch this by adding the qualia:method-enhancements package
Meteor.methods({
  'clickButton'() {
    return 'hello';
  },
});
