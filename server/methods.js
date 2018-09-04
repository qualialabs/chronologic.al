import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import lune from 'lune';

Meteor.methods({
  'getMoonIllumination'(args) {
    try {
      return lune.phase(date).illumination;
    } catch (e) {
      return 0;
    }
  },
});
