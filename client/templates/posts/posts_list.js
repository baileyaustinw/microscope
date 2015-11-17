Template.postsList.helpers({
  posts: function() {
    return Posts.find({}, {
      sort: {submitted: -1}
    });
  },
  postsCount: function() {
    return Posts.find().count() > 0;
  }
});
