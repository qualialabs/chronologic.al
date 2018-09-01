import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import '../common';

// We can monkey-patch this by adding the qualia:method-enhancements package
Meteor.methods({
  'clickButton'() {
    return 'hello';
  },
});
