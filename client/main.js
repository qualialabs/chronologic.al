import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

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

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  const tpl = this;
  tpl.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    const tpl = Template.instance();
    return tpl.counter.get();
  },
});

Template.hello.events({
  async 'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(await callPromise('clickButton'));
  },
});
