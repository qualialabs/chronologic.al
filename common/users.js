import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import moment from 'moment-timezone';

SimpleSchema.extendOptions(['autoform']);

if (Meteor.isServer) {
  Meteor.users.allow({
    insert: () => true,
    update: () => true,
    remove: () => true,
  });

  Meteor.publish('users.basic', function() {
    return Meteor.users.find({}, {fields: {'preferences': 0}});
  });

  // The problem here was projecting fields below the top-level. Meteor only
  // looks at the top-level keys when deciding what information the client has
  // or does not have.
  // According to the docs (https://docs.meteor.com/api/pubsub.html#Meteor-publish),
  // > If the values of any of the top level fields conflict, the resulting value will
  // > be one of the published values, chosen arbitrarily.
  // To fix the problem, we publish the relevant user preferences in a single
  // publication.
  Meteor.publish('users.preferences', function() {
    return Meteor.users.find({}, {
      fields: {
        'preferences.theme_color': 1,
        'preferences.timezone': 1,
      },
    });
  });
}

Meteor.users.attachSchema(new SimpleSchema({
  'preferences': {
    type: Object,
    optional: true,
  },
  'preferences.theme_color': {
    type: String,
    optional: true,
  },
  'preferences.timezone': {
    type: String,
    optional: true,
    allowedValues: [
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/New_York',
    ],
  },
  'last_active_date': {
    type: Date,
    optional: true,
  },
  // These come from accounts-base
  'emails': {
    type: Array,
    minCount: 1,
    optional: true,
  },
  'emails.$': {
    type: Object,
    optional: true,
  },
  'emails.$.address': {
    type: String,
    optional: true,
  },
  'emails.$.verified': {
    type: Boolean,
    optional: true,
  },
  'login_token': {
    type: Object,
    blackbox: true,
    optional: true,
  },
  'services': {
    type: Object,
    blackbox: true,
    optional: true,
  },
}));
