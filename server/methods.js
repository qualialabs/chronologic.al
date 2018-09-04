import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import lune from 'lune';

calculateMoonPhase = function calculateMoonPhase(date) {
  const phaseInformation = lune.phase(date);
  return phaseInformation.phhase;
}

Meteor.methods({
  'getMoonPhase'(args) {
    try {
      return calculateMoonPhase(args);
    } catch (e) {
      return 0;
    }
  },
});
