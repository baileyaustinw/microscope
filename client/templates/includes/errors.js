Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

// The onRendered callback triggers once our template has been rendered in the browser.
// Inside the callback, this refers to the current template instance,
// and this.data lets us access the data of the object that is currently being rendered (in our case, an error).
Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function() {
    Errors.remove(error._id);
  }, 3000);
});
