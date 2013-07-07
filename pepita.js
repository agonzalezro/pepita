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
      var keys = [];
      return Keys.find({
        pageId: pageId
      }, {
        sort: {keyNumber: 1}
      });
    }
  }

  /* Navigation functions
   * The way of saving it doesn't seem so nice, but ehy! It's a hackathon :D
   */
  Template.pepitaEventsWeather = function () {
    var user = Users.findOne({
      username: "pepita"
    });

    Meteor.call("removeKeys", function() {
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 1,
        text: "24° now"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 2,
        command: "javascript:Template.pepitaEventsIndex();",
        text: "Go back"
      })
    });
  }

  Template.pepitaEventsGP = function () {
    var user = Users.findOne({
      username: "pepita"
    });

    Meteor.call("removeKeys", function() {
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 1,
        command: "javascript:Template.pepitaEventsGPBook();",
        text: "Book"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 2,
        text: "Check results"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 3,
        command: "javascript:Template.pepitaEventsIndex();",
        text: "Go back"
      })
    });
  }

  Template.pepitaEventsGPBook = function () {
    var user = Users.findOne({
      username: "pepita"
    });

    Meteor.call("removeKeys", function() {
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 1,
        text: "For visit"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 2,
        text: "For test"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 3,
        command: "javascript:Template.pepitaEventsGP();",
        text: "Go back"
      })
    });
  }

  Template.pepitaEventsIndex = function() {
    var user = Users.findOne({
      username: "pepita"
    });

    Meteor.call("removeKeys", function () {
      Meteor.call("generateIndex", user.defaultPageId)
    });
  };
}


/*
 * SERVER code
 */
var createMockupData = function (defaultPageId) {
  if (!defaultPageId) {
    var defaultPageId = Pages.insert({
      "name" : "Pepita's homepage"
    });

    Users.insert({
      username: "pepita",
      history: [],
      defaultPageId: defaultPageId
    });
  }

  // Create the 10 possible keys (just for testing purposes)
  for (var index=0; index<=10; index++) {
    switch(index) {
      case 10:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "tel://00447528423711",
          image: "images/carlosKey.jpg"
        })
        break;
      case 9:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "tel://00447449601002",
          image: "images/alexKey.jpg"
        })
        break;
      case 8:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "javascript:Template.pepitaEventsWeather();",
          image: "images/weather.png"
        })
        break;
      case 7:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "javascript:Template.pepitaEventsGP();",
          text: "GP"
        })
        break;
      /*default:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          image: images
        })
        break;*/
    }
  }
}


var startupApplicationServer = function() {
  if (Users.find().count() === 0 || true) {  // Force it for now
    // Delete all
    Users.remove({}, function() {
      Pages.remove({}, function() {
        Keys.remove({}, createMockupData);
      });
    });
  }
}


if (Meteor.isServer) {
  Meteor.startup(startupApplicationServer);
  Meteor.methods({
    removeKeys: function () {
      Keys.remove({});
    },
    generateIndex: function (defaultPageId) {
      createMockupData(defaultPageId);
    }
  });
}
