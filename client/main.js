import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import moment from 'moment-timezone';

import '../common';
import './main.html';

// If you haven't tried async/await with your Meteor Methods...
async function callPromise(methodName, ...args) {
  return new Promise((resolve, reject) => {
    Meteor.apply(methodName, args, {}, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

Template.clock.onCreated(function() {
  const tpl = this;

  Meteor.subscribe('users.basic');
  Meteor.subscribe('users.theme');
  Meteor.subscribe('users.timezone');

  _.extend(tpl, {

    currentMoment: new ReactiveVar(moment()),

    currentFormattedTime: new ReactiveVar(''),

    moonRotation: new ReactiveVar(0),

    showColons: new ReactiveVar(true),

    themeColor: new ReactiveVar('#eee'),

    initialize() {
      tpl.startTimer();
      tpl.watchTime();
      tpl.watchMoon();
      tpl.recordLastActiveDate();
    },

    startTimer() {
      Meteor.setInterval(() => tpl.currentMoment.set(moment()), 1000);
    },

    watchTime() {
      Tracker.autorun(() => {
        const user = Meteor.user();
        const timezone = user && user.preferences && user.preferences.timezone || moment.tz.guess();
        const currentMoment = tpl.currentMoment.get();
        currentMoment.tz(timezone);
        const shouldShowColons = Tracker.nonreactive(() => tpl.showColons.get());
        const format = shouldShowColons ? 'HH:mm:ss' : 'HH mm ss';
        tpl.currentFormattedTime.set(currentMoment.format(format));
        tpl.showColons.set(!shouldShowColons);
      });
    },

    watchMoon() {
      Tracker.autorun(async () => {
        const currentMoment = tpl.currentMoment.get();
        const illumination = await callPromise('getMoonIllumination', {
          date: new Date(currentMoment),
        });
        tpl.moonRotation.set(illumination * 180 - 90)
      });
    },

    recordLastActiveDate() {
      Meteor.setInterval(() => {
        if (Meteor.userId()) {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              last_active_date: new Date(),
            },
          });
        }
      }, 300);
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
