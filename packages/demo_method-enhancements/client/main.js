// On the client, we simply add the original Meteor method.
function addMethod(methodName, methodFunction) {
  Meteor.methods({
    [methodName]: methodFunction,
  });
}

export {addMethod};
