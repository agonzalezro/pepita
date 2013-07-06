Users = new Meteor.Collection("users");
Pages = new Meteor.Collection("pages");
Keys = new Meteor.Collection("keys");

/*
 * CLIENT code
 */
if (Meteor.isClient) {
  Template.keyboard.keys = function () {
    var user = Users.findOne({
      username: "pepita"
    });
    if (user) {
      var pageId = _.last([user.defaultPageId].concat(user.history));
      return Keys.find({
        pageId: pageId
      });
    }
  }
}


/*
 * SERVER code
 */
var startupApplicationServer = function() {
  if (Users.find().count() === 0) {
    var defaultPageId = Pages.insert({
      "name" : "Pepita's homepage"
    });

    Users.remove({}, function () {
      Users.insert({
        username: "pepita",
        history: [],
        defaultPageId: defaultPageId
      });
      Keys.remove({} , function () {
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: 4,
          command: "tel://00447449601002",
          image: "images/alexKey.jpg"
        });
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: 5,
          command: "Call Carlos",
          image: "images/carlosKey.jpg"
        });
      });
    });

    console.log("Mock data created!");
  }
}


if (Meteor.isServer) {
  Meteor.startup(startupApplicationServer);
}
