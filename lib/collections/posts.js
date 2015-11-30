Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    //We're taking the fieldNames array that contains a list of the fields being modified,
    // and using Underscore's without() Method to return a sub-array containing the fields that are not url or title.
    // If everything's normal, that array should be empty and its length should be 0.
    // If someone is trying anything funky, that array's length will be 1 or more,
    // and the callback will return true (thus denying the update).

    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

validatePost = function(post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";
  if (!post.url)
    errors.url = "Please fill in a URL";

  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', 'You must set a title and URL for your post');

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },
  postUpdate: function(currentPostId, postProperties) {
    check(Meteor.userId(), String);
    check(currentPostId, String);
    check(postProperties, {
      title: String,
      url: String
    });

    var errors = validatePost(postProperties);
    if (errors.title || errors.url)
      return errors.title || errors.url;

    var postWithSameLink = Posts.findOne({url: postProperties.url});
    if (postWithSameLink) {
        var postId = Posts.update(currentPostId, {$set: {title: postProperties.title}});
        return {
          linkExists: true,
          reason: 'A post with this URL already exists.',
          _id: postWithSameLink._id
        };
    } else {
      var postId = Posts.update(currentPostId, {$set: {title: postProperties.title, url: postProperties.url}});
      return {
        _id: currentPostId
      };
    }

  }
});
