Users = new Meteor.Collection("users");
Pages = new Meteor.Collection("pages");
Keys = new Meteor.Collection("keys");

if (Meteor.isClient) {

  var user = Users.findOne({ username: "pepita" });
  Template.keyboard.keys = function () {
    var pageId = _.last([ user.defaultPageId ].concat(user.history));
    return Keys.find({ pageId: pageId });
  };

}

if (Meteor.isServer) {

  Meteor.startup(function () {
    // code to run on server at startup 

    // this creates some sample data
    Pages.remove({ }, function () {
      var defaultPageId = Pages.insert({ "name" : "Pepita's homepage" });
      Users.remove({ }, function () {
        Users.insert({ "username" : "pepita", "history" : [ ], "defaultPageId" : defaultPageId });
        Keys.remove({ } , function () {
          Keys.insert({ "pageId" : defaultPageId, "keyNumber" : 4, "command" : "tel://00447449601002", "image" : "images/alexKey.jpg" });
          Keys.insert({ "pageId" : defaultPageId, "keyNumber" : 5, "command" : "Call Carlos", "image" : "images/carlosKey.jpg" });
        });
      });
    });
    console.log("Hello");

  });

}

