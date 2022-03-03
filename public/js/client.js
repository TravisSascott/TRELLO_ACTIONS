/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var GLITCH_ICON =
  "https://cdn.glitch.com/2442c68d-7b6d-4b69-9d13-feab530aa88e%2Fglitch-icon.svg?1489773457908";
var GRAY_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg";
var WHITE_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg";

var BLACK_ICON = 
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg";

var randomBadgeColor = function() {
  return ["green", "yellow", "red", "none"][Math.floor(Math.random() * 4)];
};

var getBadges = function(t) {
  return t
    .card("name")
    .get("name")
    .then(function(cardName) {
      console.log("We just loaded the card name for fun: " + cardName);

      return [
        {
          // dynamic badges can have their function rerun after a set number
          // of seconds defined by refresh. Minimum of 10 seconds.
          dynamic: function() {
            // we could also return a Promise that resolves to this as well if we needed to do something async first
            return {
              title: "Detail Badge", // for detail badges only
              text: "Dynamic " + (Math.random() * 100).toFixed(0).toString(),
              icon: GRAY_ICON, // for card front badges only
              color: randomBadgeColor(),
              refresh: 10 // in seconds
            };
          }
        },
        {
          // its best to use static badges unless you need your badges to refresh
          // you can mix and match between static and dynamic
          title: "Detail Badge", // for detail badges only
          text: "Static",
          icon: GRAY_ICON, // for card front badges only
          color: null
        },
        {
          // card detail badges (those that appear on the back of cards)
          // also support callback functions so that you can open for example
          // open a popup on click
          title: "Popup Detail Badge", // for detail badges only
          text: "Popup",
          icon: GRAY_ICON, // for card front badges only
          callback: function(context) {
            // function to run on click
            return context.popup({
              title: "Card Detail Badge Popup",
              url: "./settings.html",
              height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
            });
          }
        },
        {
          // or for simpler use cases you can also provide a url
          // when the user clicks on the card detail badge they will
          // go to a new tab at that url
          title: "URL Detail Badge", // for detail badges only
          text: "URL",
          icon: GRAY_ICON, // for card front badges only
          url: "https://trello.com/home",
          target: "Trello Landing Page" // optional target for above url
        }
      ];
    });
};

var boardButtonCallback = function(t) {
  return t.popup({
    title: "EJEMPLO",
    items: [
      {
        text: "Open Modal",
        callback: function(t) {
          return t.modal({
            url: "./modal.html", // The URL to load for the iframe
            args: { text: "Hello", fullscreen: true }, // Optional args to access later with t.arg('text') on './modal.html'
            accentColor: "#F2D600", // Optional color for the modal header
            height: 500, // Initial height for iframe; not used if fullscreen is true
            fullscreen: true, // Whether the modal should stretch to take up the whole screen
            callback: () => console.log("Goodbye."), // optional function called if user closes modal (via `X` or escape)
            title: "Hello, Modal!", // Optional title for modal header
            // You can add up to 3 action buttons on the modal header - max 1 on the right side.
            actions: [
              {
                icon: GRAY_ICON,
                url: "https://google.com", // Opens the URL passed to it.
                alt: "Leftmost",
                position: "left"
              },
              {
                icon: GRAY_ICON,
                callback: tr =>
                  tr.popup({
                    // Callback to be called when user clicks the action button.
                    title: "Settings",
                    url: "settings.html",
                    height: 164
                  }),
                alt: "Second from left",
                position: "left"
              },
              {
                icon: GRAY_ICON,
                callback: () => console.log("🏎"),
                alt: "Right side",
                position: "right"
              }
            ]
          });
        }
      },
      {
        text: "Open Board Bar",
        callback: function(t) {
          return t
            .boardBar({
              url: "./board-bar.html",
              height: 200
            })
            .then(function() {
              return t.closePopup();
            });
        }
      }
    ]
  });
};

var restApiCardButtonCallback = function(t) {
  return t
    .getRestApi()
    .isAuthorized()
    .then(function(authorized) {
      if (!authorized) {
        // You might be tempted to call client.authorize from a capability handler like the one we are in right now.
        // Unfortunately this does not register as a click by the browser, and it will block the popup. Instead, we need to
        // open a t.popup from our capability handler, and load an iframe that contains a button that calls client.authorize.
        return t.popup({
          title: "Authorize Trello's REST API",
          url: "./api-client-authorize.html"
        });
      } else {
        return t.popup({
          title: "Make a choice",
          items: [
            {
              // We'll use the client on the authorization page to make an example request.
              text: "Make an example request",
              callback: function(t) {
                return t.popup({
                  title: "Authorize Trello's REST API",
                  url: "./api-client-authorize.html"
                });
              }
            },
            {
              // You can de-authorize the REST API client with a call to .clearToken()
              text: "Unauthorize",
              callback: function(t) {
                return t
                  .getRestApi()
                  .clearToken()
                  .then(function() {
                    t.alert("You've successfully deauthorized!");
                    t.closePopup();
                  });
              }
            }
          ]
        });
      }
    });
};

var cardButtonCallback = function(t) {
  // Trello Power-Up Popups are actually pretty powerful
  // Searching is a pretty common use case, so why reinvent the wheel
  var items = ["acad", "arch", "badl", "crla", "grca", "yell", "yose"].map(
    function(parkCode) {
      var urlForCode = "http://www.nps.gov/" + parkCode + "/";
      var nameForCode = "🏞 " + parkCode.toUpperCase();
      return {
        text: nameForCode,
        url: urlForCode,
        callback: function(t) {
          // In this case we want to attach that park to the card as an attachment
          // but first let's ensure that the user can write on this model
          if (t.memberCanWriteToModel("card")) {
            return t
              .attach({ url: urlForCode, name: nameForCode })
              .then(function() {
                // once that has completed we should tidy up and close the popup
                return t.closePopup();
              });
          } else {
            console.log(
              "Oh no! You don't have permission to add attachments to this card."
            );
            return t.closePopup(); // We're just going to close the popup for now.
          }
        }
      };
    }
  );

  // we could provide a standard iframe popup, but in this case we
  // will let Trello do the heavy lifting
  return t.popup({
    title: "Popup Search Example",
    items: items, // Trello will search client-side based on the text property of the items
    search: {
      count: 5, // How many items to display at a time
      placeholder: "Search National Parks",
      empty: "No parks found"
    }
  });

  // in the above case we let Trello do the searching client side
  // but what if we don't have all the information up front?
  // no worries, instead of giving Trello an array of `items` you can give it a function instead
  /*
  return t.popup({
    title: 'Popup Async Search',
    items: function(t, options) {
      // use options.search which is the search text entered so far
      // and return a Promise that resolves to an array of items
      // similar to the items you provided in the client side version above
    },
    search: {
      placeholder: 'Start typing your search',
      empty: 'Huh, nothing there',
      searching: 'Scouring the internet...'
    }
  });
  */
};

// We need to call initialize to get all of our capability handles set up and registered with Trello

  
TrelloPowerUp.initialize({
  "board-buttons": function(t, options) {
      return [
        {
          // or we can also have a button that is just a simple url
          // clicking it will open a new tab at the provided url
          icon: WHITE_ICON,
          text: "ACCIONES",
          callback: function (t){
            return t.modal({
                // the url to load for the iframe
                url: './actions.html',
                // optional arguments to be passed to the iframe as query parameters
                // access later with t.arg('text')
                args: { text: 'Hello' },
                // optional color for header chrome
                accentColor: '#4c2913',
                // initial height for iframe
                height: 600, // not used if fullscreen is true
                // whether the modal should stretch to take up the whole screen
                fullscreen: true,
                // optional function to be called if user closes modal (via `X` or escape, etc)
                callback: () => console.log('Goodbye.'),
                // optional title for header chrome
                title: 'CARGANDO ACCIONES DEL TABLERO',
                // optional action buttons for header chrome
                // max 3, up to 1 on right side
                
              })
          }
        },
       
      ];
    },
  "board-buttons": function (t, opts) {
    return t.board("id").then(function (board) {
      
      //console.log(JSON.stringify(board, null, 5));
      console.log(board.id);
    });
  },
},
  
  
  
  
  
  
  {
    appKey: "your_key_here",
    appName: "My Trello App"
  }
);

console.log("Loaded by: " + document.referrer);
