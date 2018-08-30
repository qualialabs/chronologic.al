// For our method caller ID:
import { DDP } from 'meteor/ddp';
import Fiber from 'fibers';

function calledByTheServer() {
  // Dark, dark magic from Lucas...
  let isInternalCall = false;
  if (Fiber.current._meteor_dynamics[0]) {
    isInternalCall = Fiber.current._meteor_dynamics[0].description.startsWith('internal');
  }
  return isInternalCall || (!DDP._CurrentInvocation.get() || !DDP._CurrentInvocation.get().connection);
}

const nativeMeteorMethods = Meteor.methods.bind(Meteor);

function addMethod(methodName, methodFunction) {
  // Add additional features and diagnostics around the original Method
  // functionality
  async function wrappedMethod() {
    const callerUserID = this.userId;
    let callerName;
    if (calledByTheServer()) {
      callerName = 'The Server';
    } else if (callerUserID) {
      callerName = `"${Meteor.user().emails[0].address}"`;
    } else {
      callerName = 'An Anonymous User';
    }
    console.log(`${callerName} called ${methodName} with`, arguments);

    // Now we actually call the user-provided function
    const result = await methodFunction.apply(methodFunction, arguments);

    console.log(result);
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
