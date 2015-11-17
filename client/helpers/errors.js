// Local (client-only) collection

// this collection's data will never be saved into the server-side database
Errors = new Mongo.Collection(null);

// We don't need to worry about allow or deny or any other security concerns, 
// as this collection is “local” to the current user.
throwError = function(message) {
  Errors.insert({message: message});
};
