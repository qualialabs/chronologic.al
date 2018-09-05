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
  Meteor.subscribe('users.preferences');

  _.extend(tpl, {

    currentFormattedTime: new ReactiveVar(''),

    moonPhase: new ReactiveVar(0),

    showColons: new ReactiveVar(true),

    initialize() {
      watchTime(tpl.currentFormattedTime, tpl.showColons);
      watchMoon(tpl.moonPhase);
      recordLastActiveDate();
    },

    updateMoonCanvas() {
      const phase = tpl.moonPhase.get();
      const skyColor = '#0B1A72';
      const moonColor = '#FFF';

      const canvas = document.getElementById('moonCanvas');
      const ctx = canvas.getContext('2d');

      const halfProgress = (phase * 2) % 1;
      const waxing = phase < 0.5;
      let foregroundColor, backgroundColor;
      if (waxing) {
        foregroundColor = halfProgress < 0.5 ? skyColor : moonColor;
        backgroundColor = halfProgress < 0.5 ? moonColor : skyColor;
      } else {
        foregroundColor = halfProgress < 0.5 ? moonColor : skyColor;
        backgroundColor = halfProgress < 0.5 ? skyColor : moonColor;
      }

      // Background
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2 * Math.PI);
      ctx.fillStyle = backgroundColor;
      ctx.fill();

      // Filled half (on the right when halfProgress < 0.5; otherwise, on the
      // left)
      const offset = halfProgress < 0.5 ? 0 : Math.PI;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, offset-Math.PI/2, offset+Math.PI/2);
      ctx.fillStyle = foregroundColor;
      ctx.fill();

      // Extra curve
      ctx.save();
      ctx.beginPath();
      const width = canvas.width * Math.abs(1 - halfProgress * 2);
      const radius = width / 2;
      ctx.translate(canvas.width / 2 - radius, 0);
      ctx.scale(radius, canvas.height / 2);
      ctx.arc(1, 1, 1, 0, 2 * Math.PI);
      ctx.restore();
      ctx.fillStyle = foregroundColor;
      ctx.fill();

      requestAnimationFrame(() => tpl.updateMoonCanvas());
    },

  });

  tpl.initialize();

});

Template.clock.onRendered(function() {
  const tpl = this;
  tpl.updateMoonCanvas();
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
});
