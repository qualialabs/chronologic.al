import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import moment from 'moment-timezone';

SimpleSchema.extendOptions(['autoform']);

Meteor.users.attachSchema(new SimpleSchema({
  theme_color: {
    type: String,
    optional: true,
  },
  last_active_date: {
    type: Date,
    optional: true,
  },
  timezone: {
    type: String,
    optional: true,
    allowedValues: [
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/New_York',
    ],
  },

  // These come from accounts-base
  emails: {
    type: Array,
    minCount: 1,
  },
  'emails.$': Object,
  'emails.$.address': String,
  'emails.$.verified': Boolean,
  login_token: {
    type: Object,
    blackbox: true,
  },
  services: {
    type: Object,
    blackbox: true,
  },
}));
