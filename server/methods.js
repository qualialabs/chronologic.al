import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import lune from 'lune';

calculateMoonIllumination = function calculateMoonIllumination(args) {
  const phaseInformation = lune.phase(date);
  return phaseInformation.illumination;
}

Meteor.methods({
  'getMoonIllumination'(args) {
    try {
      return calculateMoonIllumination();
    } catch (e) {
      return 0;
    }
  },
});
