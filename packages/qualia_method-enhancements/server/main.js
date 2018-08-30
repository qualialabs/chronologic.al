// For our method caller ID:
import { DDP } from 'meteor/ddp';
import { Random } from 'meteor/random';
import Fiber from 'fibers';

function calledByTheServer() {
  // Dark, dark magic from Lucas...
  let isInternalCall = false;
  if (Fiber.current._meteor_dynamics[0]) {
    isInternalCall = Fiber.current._meteor_dynamics[0].description.startsWith('internal');
  }
  return isInternalCall || (!DDP._CurrentInvocation.get() || !DDP._CurrentInvocation.get().connection);
}

function identifyCaller(userID) {
  if (calledByTheServer()) {
    return 'The Server';
  } else if (userID) {
    const user = Meteor.users.findOne(userID, {fields: {emails: 1}});
    return `"${user.emails[0].address}"`;
  } else {
    return 'An Anonymous User';
  }
}

const nativeMeteorMethods = Meteor.methods.bind(Meteor);

function addMethod(methodName, methodFunction) {
  // Add additional features and diagnostics around the original Method
  // functionality
  async function wrappedMethod() {
    const callerName = identifyCaller(this.userId);
    // This unique call ID allows you to match arguments and result in the logs
    const callID = Random.id();
    console.log(`${callerName} called "${methodName}" (${callID}) with arguments`, JSON.stringify(arguments, null, 2));

    // Now we actually call the user-provided function
    const result = await methodFunction.apply(methodFunction, arguments);

    console.log(`${callerName} finished call to "${methodName}" (${callID}) with result`, result);
    return result;
  }
  // Register the Meteor method with our wrapper around it
  nativeMeteorMethods({
    [methodName]: wrappedMethod,
  });
}

// The patch
Meteor.methods = function(methodsObject) {
  _.each(methodsObject, (method, name) => {
    addMethod(name, method);
  });
}

export {addMethod};
