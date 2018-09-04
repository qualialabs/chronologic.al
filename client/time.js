import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';

currentMoment = new ReactiveVar(moment());
Meteor.setInterval(() => currentMoment.set(moment()), 1000);

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

/**
  This autorun watches the current time and updates the reactive variables to
  reflect the state of the clock. The input, currentMoment, is a reactive
  variable with a `moment` object in it (defined above). The outputs,
  `currentFormattedTime` and `showColons`, are reactive variables used to update
  the display of the clock in client.js.
*/
function watchTime(currentFormattedTime, showColons) {
  Tracker.autorun(() => {
    const user = Meteor.user();
    const timezone = user && user.preferences && user.preferences.timezone || moment.tz.guess();

    const current = currentMoment.get();
    current.tz(timezone);

    const shouldShowColons = Tracker.nonreactive(() => showColons.get());
    const format = shouldShowColons ? 'HH:mm:ss' : 'HH mm ss';

    currentFormattedTime.set(current.format(format));
    showColons.set(!shouldShowColons);
  });
}

/**
  This autorun takes as input the `currentMoment`, a reactive variable with  a
  `moment` object in it (defined above). It sets the moon phase in the provided
  `moonPhase` reactive variable.
*/
function watchMoon(moonPhase) {
  Tracker.autorun(async () => {
    const current = currentMoment.get();
    const phase = await callPromise('getMoonPhase', {
      date: new Date(current),
    });
    moonPhase.set(phase)
  });
}

/**
  This function is responsible for recording the last_active_date on the current
  user, so we know when they last used the app.
*/
function recordLastActiveDate() {
  Meteor.setInterval(() => {
    if (Meteor.userId()) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          last_active_date: new Date(),
        },
      });
    }
  }, 300);
}

export {watchTime, watchMoon, recordLastActiveDate};
