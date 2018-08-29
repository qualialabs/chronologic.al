import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'clickButton'() {
    return 'hello';
  },
});
