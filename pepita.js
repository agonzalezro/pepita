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
      // If I could I would fire myself after this
      keys[0] = Keys.findOne({
        pageId: pageId,
        keyNumber: 7
      });
      keys[1] = Keys.findOne({
        pageId: pageId,
        keyNumber: 8
      });
      keys[2] = Keys.findOne({
        pageId: pageId,
        keyNumber: 9
      });
      keys[3] = Keys.findOne({
        pageId: pageId,
        keyNumber: 4
      });
      keys[4] = Keys.findOne({
        pageId: pageId,
        keyNumber: 5
      });
      keys[5] = Keys.findOne({
        pageId: pageId,
        keyNumber: 6
      });
      keys[6] = Keys.findOne({
        pageId: pageId,
        keyNumber: 1
      });
      keys[7] = Keys.findOne({
        pageId: pageId,
        keyNumber: 2
      });
      keys[8] = Keys.findOne({
        pageId: pageId,
        keyNumber: 3
      });
      keys[9] = Keys.findOne({
        pageId: pageId,
        keyNumber: 0
      });
      return keys;
    }
  }

  Template.keyboard.shouldBreak = function (number) {
    if (number === 4 || number === 1 || number == 0)
      return true
    return false
  }

  Template.keyboard.rendered = function(){
    $(window).on('keydown', function(e) {
      //Being showed 2 times :(
      var number = e.which - 96;  // numeric keyboard
      var element = $("#" + number)[0];
      if (element) {
        element.click();
        just_fail; // LOL
      }
    });
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
        keyNumber: 0,
        command: "javascript:Template.pepitaEventsIndex();",
        text: "Go back"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 1,
        text: "24° now"
      });

      // Ugliest thing ever!
      for (var index=2; index<10; index++)
        Keys.insert({
          pageId: user.defaultPageId,
          keyNumber: index,
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
        keyNumber: 0,
        command: "javascript:Template.pepitaEventsIndex();",
        text: "Go back"
      }),
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
      });

      // Ugliest thing ever!
      for (var index=3; index<10; index++)
        Keys.insert({
          pageId: user.defaultPageId,
          keyNumber: index,
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
        keyNumber: 0,
        command: "javascript:Template.pepitaEventsGP();",
        text: "Go back"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 1,
        command: "javascript:Template.pepitaEventGPBookVisit();",
        text: "For visit"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 2,
        command: "javascript:Template.pepitaEventGPBookTest();",
        text: "For test"
      });

      // Ugliest thing ever!
      for (var index=3; index<10; index++)
        Keys.insert({
          pageId: user.defaultPageId,
          keyNumber: index,
        })
    });
  }

  Template.pepitaEventGPBookVisit = function () {
    var user = Users.findOne({
      username: "pepita"
    });

    Meteor.call("removeKeys", function() {
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 0,
        command: "javascript:Template.pepitaEventsGPBook();",
        text: "Go back"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 1,
        text: "Today"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 2,
        text: "Tomorrow"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 3,
        text: "Next week"
      }),
      Keys.insert({
        pageId: user.defaultPageId,
        keyNumber: 4,
        text: "Next month"
      });

      // Ugliest thing ever!
      for (var index=5; index<10; index++)
        Keys.insert({
          pageId: user.defaultPageId,
          keyNumber: index,
        })
    });
  }

  // Just show the icons
  Template.pepitaEventsGPBookTest = Template.pepitaEventGPBookVisit;

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
  for (var index=0; index<10; index++) {
    switch(index) {
      case 9:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "tel://00447528423711",
          image: "images/carlosKey.jpg"
        })
        break;
      case 8:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "tel://00447449601002",
          image: "images/alexKey.jpg"
        })
        break;
      case 7:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "javascript:Template.pepitaEventsWeather();",
          image: "images/weather.png"
        })
        break;
      case 6:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
          command: "javascript:Template.pepitaEventsGP();",
          image: "images/stethoscope.jpg",
        })
        break;
      default:
        Keys.insert({
          pageId: defaultPageId,
          keyNumber: index,
        })
        break;
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
