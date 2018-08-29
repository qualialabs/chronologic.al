import { Blaze } from 'meteor/blaze';

Blaze.findTemplate = function(elementOrView) {
  if(elementOrView == undefined) {
    return;
  }

  let view = Object.getPrototypeOf(elementOrView) === Blaze.View.prototype
    ? elementOrView
    : Blaze.getView(elementOrView);

  // Using contentBlocks messes up the natural view hierarchy, so we have to
  // look at view.originalParentView to get the proper view. Not sure how this
  // behaves with nested contentBlocks.
  while (view && view.templateInstance === undefined) {
    view = view.originalParentView || view.parentView;
  }

  if (!view) {
    return;
  }

  return Tracker.nonreactive(() => view.templateInstance());
};

Blaze.selectedTemplate = function() {
  let tpl = eval('Blaze.findTemplate($0)');
  console.log(`Template Name: ${tpl.view.name.split('.')[1]}`);
  return tpl;
};
