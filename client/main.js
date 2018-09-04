import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import moment from 'moment-timezone';

import { watchTime, watchMoon, recordLastActiveDate } from './time';

import '../common';
import './main.html';

Template.clock.onCreated(function() {
  const tpl = this;

  Meteor.subscribe('users.basic');
  Meteor.subscribe('users.theme');
  Meteor.subscribe('users.timezone');

  _.extend(tpl, {

    currentFormattedTime: new ReactiveVar(''),

    moonRotation: new ReactiveVar(0),

    showColons: new ReactiveVar(true),

    initialize() {
      watchTime(tpl.currentFormattedTime, tpl.showColons);
      watchMoon(tpl.moonRotation);
      recordLastActiveDate();
    },

  });

  tpl.initialize();

});

Template.clock.helpers({
  currentTime() {
    const tpl = Template.instance();
    return tpl.currentFormattedTime.get();
  },
  timeStyle() {
    const tpl = Template.instance();
    const user = Meteor.user();
    const themeColor = user && user.preferences && user.preferences.theme_color || '#eee';
    return `background-color: ${themeColor};`;
  },
  user() {
    return Meteor.user();
  },
  moonRotation() {
    const tpl = Template.instance();
    return tpl.moonRotation.get();
  },
  negativeMoonRotation() {
    const tpl = Template.instance();
    return -tpl.moonRotation.get();
  },
});
