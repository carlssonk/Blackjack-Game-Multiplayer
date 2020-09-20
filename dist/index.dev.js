"use strict";

// Websocket server
var http = require("http");

var express = require("express");

var _require = require("websocket"),
    client = _require.client;

var _require2 = require("path"),
    join = _require2.join;

var app = express(); // Serve all the static files, (ex. index.html app.js style.css)

app.use(express["static"]("public/")); // Before 8081

app.listen(8081, function () {
  return console.log("Listening on http port 8081");
});

var websocketServer = require("websocket").server;

var httpServer = http.createServer(); // Before 8080

httpServer.listen(8080, function () {
  return console.log("Listening... on 8080");
}); // hashmap clients

var clients = {};
var games = {};
var players = {};
var spectators = {}; // const lobbySpectators = {};

var playerSlotHTML = {};
var dealer = null;
var gameOn = null;
var player = null;
var wsServer = new websocketServer({
  "httpServer": httpServer
});
wsServer.on("request", function (request) {
  // Someone trying to connect
  var connection = request.accept(null, request.origin);
  connection.on("open", function () {
    return console.log("opened");
  });
  connection.on("close", function () {
    console.log("closed");
  });
  connection.on("message", function (message) {
    var result = JSON.parse(message.utf8Data); // a user want to create a new game

    if (result.method === "create") {
      // console.log("create")
      var _clientId = result.clientId;
      var _theClient = result.theClient;
      var playerSlot = result.playerSlot;
      var _playerSlotHTML = result.playerSlotHTML;
      var offline = result.offline;
      var roomId = partyId();
      var gameId = "http://localhost:8081/" + roomId;
      app.get('/' + roomId, function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
      }); // .route.path

      games[gameId] = {
        "id": gameId,
        "clients": [],
        "players": [],
        "dealer": dealer,
        "gameOn": gameOn,
        "player": player,
        "spectators": [],
        // "lobbySpectators": [],
        "playerSlot": playerSlot,
        "playerSlotHTML": [// 7 objectes because the playerSlot has a length of 7
        {}, {}, {}, {}, {}, {}, {}]
      };
      var _payLoad = {
        "method": "create",
        "game": games[gameId],
        "roomId": roomId,
        "offline": offline
      };
      var con = clients[_clientId].connection;
      con.send(JSON.stringify(_payLoad));
    } // a client want to join


    if (result.method === "join") {
      var nickname = result.nickname;
      var avatar = result.avatar;
      var _gameId = result.gameId;
      var _roomId = result.roomId;
      var _theClient2 = result.theClient;
      var _clientId2 = result.clientId; // const gameId = result.gameId;

      var game = games[_gameId];
      var _players = game.players;
      var _spectators = game.spectators;
      var _playerSlot = game.playerSlot;
      var _playerSlotHTML2 = game.playerSlotHTML; // const partyId = result.partyId;

      _theClient2.nickname = nickname;
      _theClient2.avatar = avatar;

      if (game.spectators.length >= 7) {
        // Max players reached
        return;
      } // Push unique Id to the client


      _theClient2.clientId = _clientId2; // Push client to players array
      // game.players.push(theClient)

      game.spectators.push(_theClient2); // Assign theClient to game.spectators[i]

      for (var i = 0; i < game.spectators.length; i++) {
        if (game.spectators[i].clientId === _clientId2) {
          // theClient = game.spectators[i]
          game.spectators[i] = _theClient2;
        }
      }

      var _payLoad2 = {
        "method": "join",
        "game": game,
        "players": _players,
        "spectators": _spectators,
        "playerSlotHTML": _playerSlotHTML2,
        "roomId": _roomId
      }; // loop through all clients and tell them that people has joined
      // if(game.players.length === 0) {

      if (!game.gameOn === true) {
        game.spectators.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad2));
        });
      } // }


      var payLoadClient = {
        "method": "joinClient",
        "theClient": _theClient2,
        // "players": players,
        // "spectators": spectators,
        // "playerSlotHTML": playerSlotHTML,
        "game": game // "gameOn": gameOn

      }; // Send theClient to THE CLIENT

      if (!game.gameOn === true) {
        clients[_clientId2].connection.send(JSON.stringify(payLoadClient));
      }

      var newPlayer = _theClient2; // Important to send this payLoad last, because it needs to know the the clientId

      var payLoadClientArray = {
        "method": "updateClientArray",
        "players": _players,
        "newPlayer": newPlayer,
        "spectators": _spectators,
        "playerSlot": _playerSlot,
        "playerSlotHTML": _playerSlotHTML2
      }; // if(game.players.length === 0) {

      if (!game.gameOn === true) {
        game.spectators.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(payLoadClientArray));
        });
      } // }
      // If a player joins mid-game


      var payLoadMidGame = {
        "method": "joinMidGame",
        "theClient": _theClient2,
        "game": game
      };

      if (game.gameOn === true) {
        clients[_clientId2].connection.send(JSON.stringify(payLoadMidGame));
      } // Send this to ALL clients, to let them know that a new spectator joined


      var payLoadMidGameUpdate = {
        "method": "joinMidGameUpdate",
        "spectators": _spectators,
        "newPlayer": newPlayer
      };

      if (game.gameOn === true) {
        game.spectators.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(payLoadMidGameUpdate));
        });
      }
    }

    if (result.method === "terminateRoom") {} // let roomId = result.roomId
    // // console.log(app._router.stack[3].route.path)
    // for(let i = 3; i < app._router.stack.length; i++) {
    //   // console.log(app._router.stack[i])
    //   console.log(app._router.stack[i].route.path)
    //   console.log("/" + roomId)
    //   if(app._router.stack[i].route.path === "/" + roomId) {
    //     console.log(app._router.stack[i].route.path)
    //     app._router.stack.splice(i,1);
    //   }
    // }
    // bets


    if (result.method === "bet") {
      var _players2 = result.players;
      var _spectators2 = result.spectators;
      var _payLoad3 = {
        "method": "bet",
        "players": _players2 // "spectators": spectators

      };

      _spectators2.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad3));
      });
    }

    if (result.method === "deck") {
      var _players3 = result.players;
      var _spectators3 = result.spectators;
      var deck = result.deck;
      var clientDeal = result.clientDeal;
      var _gameOn = result.gameOn;
      var _payLoad4 = {
        "method": "deck",
        "deck": deck,
        "gameOn": _gameOn,
        "clientDeal": clientDeal
      };

      _spectators3.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad4));
      });
    }

    if (result.method === "isReady") {
      var _theClient3 = result.theClient;
      var playerBet = _theClient3;
      var _players4 = result.players;
      var _spectators4 = result.spectators;
      var _payLoad5 = {
        "method": "isReady",
        "players": _players4,
        "theClient": _theClient3
      };

      _spectators4.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad5));
      });
    }

    if (result.method === "hasLeft") {
      var _theClient4 = result.theClient;
      var _players5 = result.players;
      var _spectators5 = result.spectators;
      var _payLoad6 = {
        "method": "hasLeft",
        "players": _players5,
        "spectators": _spectators5,
        "theClient": _theClient4
      };

      _spectators5.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad6));
      });
    }

    if (result.method === "currentPlayer") {
      var _players6 = result.players;
      var _player = result.player;
      var dealersTurn = result.dealersTurn;
      var _spectators6 = result.spectators;
      var _payLoad7 = {
        "method": "currentPlayer",
        "player": _player
      };

      if (dealersTurn === false) {
        _spectators6.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad7));
        });
      }

      if (dealersTurn === true) {
        _players6.pop(_players6.slice(-1)[0]);

        _spectators6.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad7));
        });
      }
    }

    if (result.method === "update") {
      var _players7 = result.players;
      var _dealer = result.dealer;
      var _deck = result.deck;
      var _spectators7 = result.spectators;
      var _gameOn2 = result.gameOn;
      var _dealersTurn = result.dealersTurn;
      var _payLoad8 = {
        "method": "update",
        "players": _players7,
        "dealer": _dealer,
        "deck": _deck,
        "gameOn": _gameOn2
      };

      _spectators7.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad8));
      });
    }

    if (result.method === "thePlay") {
      var _players8 = result.players;
      var _gameId2 = result.gameId;
      var _game = games[_gameId2];
      var _player2 = result.player;
      var _dealersTurn2 = result.dealersTurn;
      var currentPlayer = result.currentPlayer;
      var _spectators8 = result.spectators;
      var _payLoad9 = {
        "method": "thePlay",
        "player": _player2,
        "currentPlayer": currentPlayer,
        "players": _player2 // "theClient": theClient

      }; // players[currentPlayer].clientId.connection.send(JSON.stringify(payLoad))

      if (_dealersTurn2 === false) {
        _game.players.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad9));
        });
      }
    }

    if (result.method === "showSum") {
      var _players9 = result.players;
      var _spectators9 = result.spectators;
      var _payLoad10 = {
        "method": "showSum",
        "players": _players9
      };

      _spectators9.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad10));
      });
    }

    if (result.method === "joinTable") {
      var _theClient5 = result.theClient;
      var user = result.theClient;
      var theSlot = result.theSlot;
      var _gameId3 = result.gameId;
      var _game2 = games[_gameId3];
      var _spectators10 = result.spectators;
      var _players10 = result.players;
      var _playerSlotHTML3 = result.playerSlotHTML; // Update all palyerSlots
      // for(let i = 0; i < playerSlot.length; i++) {
      //   if(playerSlot[i].innerHTML === clientId) {
      //     playerSlotHMTL
      //   }
      // }
      // Push client to players array

      _players10.push(_theClient5); // Push client Id to playerSlotHTML array


      _playerSlotHTML3[theSlot] = clientId; // Assign theClient to game.players[i]

      for (var _i = 0; _i < _players10.length; _i++) {
        if (_players10[_i].clientId === clientId) {
          // theClient = game.players[i]
          _players10[_i] = _theClient5;
        }
      }

      _game2.players = _players10;
      _game2.playerSlotHTML = _playerSlotHTML3;
      var _payLoad11 = {
        "method": "joinTable",
        "theSlot": theSlot,
        "user": user,
        "game": _game2,
        "players": _players10,
        "spectators": _spectators10,
        "playerSlotHTML": _playerSlotHTML3,
        "theClient": _theClient5
      };

      _spectators10.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad11));
      }); // Send this to the client who pressed join


      var _payLoadClient = {
        "method": "joinTableClient"
      };
    }

    if (result.method === "updateTable") {
      var _playerSlot2 = result.playerSlot; // const payLoad = {
      //   "method": "joinTable",
      //   "theSlot": theSlot,
      //   "user": user,
      //   "game": game,
      //   "players": players,
      //   "spectators": spectators
      // }
      // spectators.forEach(c => {
      //   clients[c.clientId].connection.send(JSON.stringify(payLoad))
      // })
    }

    if (result.method === "updatePlayerCards") {
      var resetCards = result.resetCards;
      var _players11 = result.players;
      var _player3 = result.player;
      var _spectators11 = result.spectators;
      var _payLoad12 = {
        "method": "updatePlayerCards",
        "players": _players11,
        "player": _player3,
        "resetCards": resetCards
      };

      _spectators11.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad12));
      });
    }

    if (result.method === "updateDealerCards") {
      var _players12 = result.players;
      var _spectators12 = result.spectators;
      var _player4 = result.player;
      var _dealer2 = result.dealer;
      var _dealersTurn3 = result.dealersTurn; // const dealerHiddenCardRemoveNext = result.dealerHiddenCardRemoveNext

      var _payLoad13 = {
        "method": "updateDealerCards",
        "player": _player4,
        "dealer": _dealer2,
        "players": _players12,
        "dealersTurn": _dealersTurn3 // "dealerHiddenCardRemoveNext": dealerHiddenCardRemoveNext

      };

      if (_dealersTurn3 === false) {
        _spectators12.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad13));
        });
      }

      if (_dealersTurn3 === true) {
        _players12.pop(_players12.slice(-1)[0]);

        _spectators12.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad13));
        });
      }
    }

    if (result.method === "dealersTurn") {
      var _players13 = result.players;
      var _dealersTurn4 = result.dealersTurn;
      var _spectators13 = result.spectators;
      var _payLoad14 = {
        "method": "dealersTurn",
        "dealersTurn": _dealersTurn4
      };

      _spectators13.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad14));
      });
    }

    if (result.method === "terminate") {
      var _gameId4 = result.gameId;
      var _game3 = games[_gameId4]; // let game = result.game

      var _spectators14 = result.spectators;
      var _players14 = result.players;
      var _theClient6 = result.theClient;
      var _playerSlotHTML4 = result.playerSlotHTML;
      var reload = result.reload;
      var _gameOn3 = result.gameOn;
      var _player5 = result.player;
      var _clientDeal = result.clientDeal;
      var playersCanPlay = result.playersCanPlay;

      var oldPlayerIndex = _spectators14.findIndex(function (spectators) {
        return spectators.clientId === _theClient6.clientId;
      }); // Remove players from player array if the client with the dealscript leaves during 2 card deal phase
      // if(playersCanPlay === false && clientDeal === theClient.clientId) {
      //   players = [];
      // }
      // To prevent error when user disconnects outside a game


      if (_game3 === undefined) {
        _game3 = {
          "spectators": {},
          "players": {},
          "playerSlotHTML": {}
        };
      } // Get what index the player is in so we can later delete him from the table on the client side


      var playerSlotIndex = null; // Append hasLeft to the spectators array

      for (var _i2 = 0; _i2 < _players14.length; _i2++) {
        for (var s = 0; s < _spectators14.length; s++) {
          if (_players14[_i2].hasLeft === true) {
            if (_spectators14[s].clientId === _players14[_i2].clientId) {
              _spectators14[s].hasLeft = true;
            }
          }
        }
      } // Terminate player from playerSlotHTML


      for (var _i3 = 0; _i3 < _playerSlotHTML4.length; _i3++) {
        if (clientId === _playerSlotHTML4[_i3]) {
          playerSlotIndex = _i3;
        }
      } // If spectators.length === 1 and dealers is in PLAYERS array, splice dealer in both in PLAYERS array


      if (_spectators14.length === 1 && _players14.some(function (e) {
        return e.hiddenCard;
      })) {
        _players14.splice(-1)[0];
      }

      if (_gameOn3 === false || _spectators14.length === 1) {
        // if(spectators.length === 1) gameOn = false;
        // If player reloads page, remove him from spectators array
        if (reload === true) {
          // Terminate player from spectators  
          for (var _i4 = 0; _i4 < _spectators14.length; _i4++) {
            if (clientId === _spectators14[_i4].clientId) {
              _spectators14.splice(_i4, 1); // spectators.splice(i, 1)

            }
          }
        } // Terminate player from playerSlotHTML


        for (var _i5 = 0; _i5 < _playerSlotHTML4.length; _i5++) {
          if (clientId === _playerSlotHTML4[_i5]) {
            // playerSlotIndex = i;
            _playerSlotHTML4[_i5] = {};
          }
        } // Terminate player from players array


        for (var _i6 = 0; _i6 < _players14.length; _i6++) {
          if (clientId === _players14[_i6].clientId) {
            _players14.splice(_i6, 1); // players.splice(i, 1)

          }
        }
      } // else if(gameOn === true && players.length === 1) {
      //   players = []
      // }


      _game3.spectators = _spectators14;
      _game3.players = _players14;
      _game3.playerSlotHTML = _playerSlotHTML4; // game.gameOn = gameOn

      var _payLoad15 = {
        "method": "leave",
        "playerSlotIndex": playerSlotIndex,
        "players": _players14,
        "playerSlotHTML": _playerSlotHTML4,
        "spectators": _spectators14,
        "oldPlayerIndex": oldPlayerIndex,
        "game": _game3,
        "gameOn": _gameOn3
      };

      _spectators14.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad15));
      }); // lobbySpectators.forEach(c => {
      //   clients[c.clientId].connection.send(JSON.stringify(payLoad))        
      // });
      // // Send to THE client
      // const con = clients[clientId].connection
      // con.send(JSON.stringify(payLoad));

    }

    if (result.method === "playersLength") {
      var _gameId5 = result.gameId;
      var _game4 = games[_gameId5];
      var _spectators15 = _game4.spectators;
      var playersLength = _game4.spectators.length;
      var payLoadLength = {
        "method": "playersLength",
        "playersLength": playersLength
      };
      connection.send(JSON.stringify(payLoadLength));
    }

    if (result.method === "resetRound") {
      var _spectators16 = result.spectators;
      var _theClient7 = result.theClient;
      var _payLoad16 = {
        "method": "resetRound",
        "theClient": _theClient7
      };

      _spectators16.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad16));
      });
    }

    if (result.method === "playerResult") {
      var _spectators17 = result.spectators;
      var _players15 = result.players;
      var _payLoad17 = {
        "method": "playerResult",
        "players": _players15
      };

      _spectators17.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad17));
      });
    }

    if (result.method === "playerResultNatural") {
      var _spectators18 = result.spectators;
      var _players16 = result.players;
      var playerNaturalIndex = result.playerNaturalIndex;
      var _payLoad18 = {
        "method": "playerResultNatural",
        "players": _players16,
        "playerNaturalIndex": playerNaturalIndex
      };

      _spectators18.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad18));
      });
    }

    if (result.method === "finalCompare") {
      var _spectators19 = result.spectators;
      var _gameId6 = result.gameId;
      var _game5 = games[_gameId6];
      var _players17 = result.players;
      _game5.players = _players17;
      var _payLoad19 = {
        "method": "finalCompare" // "players": players

      };

      _spectators19.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad19));
      });
    }

    if (result.method === "resetGameState") {
      var _spectators20 = result.spectators;
      var _gameId7 = result.gameId;
      var _game6 = games[_gameId7];
      var _players18 = result.players;
      _game6.players = _players18;
      var _payLoad20 = {
        "method": "resetGameState",
        "game": _game6
      };

      _spectators20.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad20));
      });
    }

    if (result.method === "wsDealCards") {
      dealCards();
    }

    if (result.method === "getRoute") {
      var getRouteId = result.getRouteId;
      var isRouteDefined = null;

      for (var _i7 = 3; _i7 < app._router.stack.length; _i7++) {
        if (app._router.stack[_i7].route.path === "/" + getRouteId) {
          isRouteDefined = true;
        } else {
          isRouteDefined = false;
        }
      } // if route is not available, redirect to home page


      var payLoadRoute = {
        "method": "redirect",
        "isRouteDefined": isRouteDefined
      };

      if (isRouteDefined === false) {
        connection.send(JSON.stringify(payLoadRoute));
      }
    }

    if (result.method === "dealersHiddenCard") {
      var _spectators21 = result.spectators;
      var dealersHiddenCard = result.dealersHiddenCard;
      var _payLoad21 = {
        "method": "dealersHiddenCard",
        "dealersHiddenCard": dealersHiddenCard
      };

      _spectators21.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad21));
      });
    }

    if (result.method === "startTimer") {
      var _spectators22 = result.spectators;
      var _payLoad22 = {
        "method": "startTimer"
      };

      _spectators22.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad22));
      });
    }

    if (result.method === "syncGame") {
      var _gameId8 = result.gameId;
      var _game7 = games[_gameId8];
      var _gameOn4 = result.gameOn;
      var _dealer3 = result.dealer;
      var _players19 = result.players;
      var _player6 = result.player;
      var _spectators23 = result.spectators;
      var _playerSlotHTML5 = result.playerSlotHTML;

      if (_game7 === undefined) {
        _game7 = {};
      } // Sync players & spectators arrays


      _game7.gameOn = _gameOn4;
      _game7.dealer = _dealer3;
      _game7.players = _players19;
      _game7.player = _player6;
      _game7.spectators = _spectators23;
      _game7.playerSlotHTML = _playerSlotHTML5;
    }
  }); // The ClientId

  var clientId = guid(); // The Client

  clients[clientId] = {
    "connection": connection
  }; // The client object

  var theClient = {
    "nickname": "",
    "avatar": "",
    "cards": [],
    "bet": 0,
    "balance": 5000,
    "sum": null,
    "hasAce": false,
    "isReady": false,
    "blackjack": false,
    "hasLeft": false
  };
  var player = null; // The players Array

  players[theClient] = {
    "connection": connection
  };
  players[player] = {
    "connection": connection
  }; // The spectator Array

  spectators[theClient] = {
    "connection": connection
  }; // Send this to client

  var payLoad = {
    "method": "connect",
    "clientId": clientId,
    "theClient": theClient
  }; // Send the payLoad to the client

  connection.send(JSON.stringify(payLoad));
}); // Generates unique guid (i.e. unique user ID)

var guid = function guid() {
  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  return "".concat(s4() + s4(), "-").concat(s4(), "-").concat(s4(), "-").concat(s4(), "-").concat(s4() + s4() + s4());
}; // Random Part ID


function partyId() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;

  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
} // console.log(partyId());


app.get('/offline', function (req, res) {
  res.sendFile(__dirname + '/public/offline.html');
});
app.get('/credits', function (req, res) {
  res.sendFile(__dirname + '/public/credits.html');
});
app.get('/:id', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('*', function (req, res) {
  res.redirect('/');
});