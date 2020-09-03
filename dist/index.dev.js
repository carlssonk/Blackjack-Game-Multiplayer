"use strict";

// Websocket server
var http = require("http");

var express = require("express");

var _require = require("websocket"),
    client = _require.client;

var _require2 = require("path"),
    join = _require2.join;

var app = express(); // Serve all the static files, (ex. index.html app.js style.css)

app.use(express["static"]("public/"));
app.listen(8081, function () {
  return console.log("Listening on http port 8081");
});

var websocketServer = require("websocket").server;

var httpServer = http.createServer();
httpServer.listen(8080, function () {
  return console.log("Listening... on 8080");
}); // hashmap clients

var clients = {};
var games = {};
var players = {};
var spectators = {};
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
    console.log("closed"); // console.log(clients)
  });
  connection.on("message", function (message) {
    var result = JSON.parse(message.utf8Data); // a user want to create a new game

    if (result.method === "create") {
      var _clientId = result.clientId;
      var _theClient = result.theClient;
      var playerSlot = result.playerSlot;
      var _playerSlotHTML = result.playerSlotHTML;
      var roomId = partyId();
      var gameId = "http://localhost:8081/" + roomId;
      app.get('/' + roomId, function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
      });
      games[gameId] = {
        "id": gameId,
        "clients": [],
        "players": [],
        "dealer": dealer,
        "gameOn": gameOn,
        "player": player,
        "spectators": [],
        "playerSlot": playerSlot,
        "playerSlotHTML": [// 7 objectes because the playerSlot has a length of 7
        {}, {}, {}, {}, {}, {}, {}]
      };
      var _payLoad = {
        "method": "create",
        "game": games[gameId],
        "roomId": roomId
      };
      var con = clients[_clientId].connection;
      con.send(JSON.stringify(_payLoad));
    } // a client want to join


    if (result.method === "join") {
      var nickname = result.nickname;
      var _gameId = result.gameId;
      var _roomId = result.roomId;
      var _theClient2 = result.theClient;
      var _clientId2 = result.clientId; // const gameId = result.gameId;

      var game = games[_gameId];
      console.log("#####");
      console.log(game);
      console.log("------");
      var _players = game.players; // console.log(players)

      var _spectators = game.spectators;
      var _playerSlot = game.playerSlot;
      var _playerSlotHTML2 = game.playerSlotHTML; // const partyId = result.partyId;

      console.log("DIN TATTARE");
      console.log(game.players);
      _theClient2.nickname = nickname;

      if (game.spectators.length >= 7) {
        // Max players reached
        return;
      } // Push unique Id to the client


      _theClient2.clientId = _clientId2; // Push client to players array
      // game.players.push(theClient)

      game.spectators.push(_theClient2); // Assign theClient to game.spectators[i]

      for (var i = 0; i < game.spectators.length; i++) {
        if (game.spectators[i].clientId === _clientId2) {
          _theClient2 = game.spectators[i];
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

      game.spectators.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad2));
      }); // }

      var payLoadClient = {
        "method": "joinClient",
        "theClient": _theClient2,
        // "players": players,
        // "spectators": spectators,
        // "playerSlotHTML": playerSlotHTML,
        "game": game // "gameOn": gameOn

      }; // Send theClient to THE CLIENT

      clients[_clientId2].connection.send(JSON.stringify(payLoadClient)); // Important to send this payLoad last, because it needs to know the the theClient.clientId


      var payLoadClientArray = {
        "method": "updateClientArray",
        "players": _players,
        "spectators": _spectators,
        "playerSlot": _playerSlot,
        "playerSlotHTML": _playerSlotHTML2
      }; // if(game.players.length === 0) {

      game.spectators.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(payLoadClientArray));
      }); // }
      // If a player joins mid-game

      var payLoadMidGame = {
        "method": "joinMidGame",
        "theClient": _theClient2,
        "game": game
      };

      clients[_clientId2].connection.send(JSON.stringify(payLoadMidGame));
    } // bets


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
      var _gameOn = result.gameOn;
      var _payLoad4 = {
        "method": "deck",
        "deck": deck,
        "gameOn": _gameOn
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

    if (result.method === "currentPlayer") {
      var _players5 = result.players;
      var _player = result.player;
      var dealersTurn = result.dealersTurn;
      var _spectators5 = result.spectators;
      console.log(_player);
      var _payLoad6 = {
        "method": "currentPlayer",
        "player": _player
      };

      if (dealersTurn === false) {
        _spectators5.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad6));
        });
      }

      if (dealersTurn === true) {
        _players5.pop(_players5.slice(-1)[0]);

        _spectators5.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad6));
        });
      }
    }

    if (result.method === "update") {
      var _players6 = result.players;
      var _dealer = result.dealer;
      var _deck = result.deck;
      var _spectators6 = result.spectators;
      var _gameOn2 = result.gameOn;
      var _payLoad7 = {
        "method": "update",
        "players": _players6,
        "dealer": _dealer,
        "deck": _deck,
        "gameOn": _gameOn2
      };

      _spectators6.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad7));
      });
    }

    if (result.method === "thePlay") {
      var _players7 = result.players;
      var _player2 = result.player;
      var _dealersTurn = result.dealersTurn;
      var currentPlayer = result.currentPlayer;
      var _spectators7 = result.spectators;
      var _payLoad8 = {
        "method": "thePlay",
        "player": _player2,
        "currentPlayer": currentPlayer
      }; // players[currentPlayer].clientId.connection.send(JSON.stringify(payLoad))

      if (_dealersTurn === false) {
        _spectators7.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad8));
        });
      }
    }

    if (result.method === "joinTable") {
      var _theClient4 = result.theClient;
      var user = result.theClient;
      var theSlot = result.theSlot;
      var _gameId2 = result.gameId;
      var _game = games[_gameId2];
      var _spectators8 = _game.spectators;
      var _players8 = _game.players;
      var _playerSlotHTML3 = _game.playerSlotHTML; // Update all palyerSlots
      // for(let i = 0; i < playerSlot.length; i++) {
      //   if(playerSlot[i].innerHTML === theClient.clientId) {
      //     playerSlotHMTL
      //   }
      // }
      // Push client to players array

      _game.players.push(_theClient4); // Push client Id to playerSlotHTML array


      _game.playerSlotHTML[theSlot] = _theClient4.clientId;
      console.log(_playerSlotHTML3); // Assign theClient to game.players[i]

      for (var _i = 0; _i < _game.players.length; _i++) {
        if (_game.players[_i].clientId === clientId) {
          _theClient4 = _game.players[_i];
        }
      }

      var _payLoad9 = {
        "method": "joinTable",
        "theSlot": theSlot,
        "user": user,
        "game": _game,
        "players": _players8,
        "spectators": _spectators8,
        "playerSlotHTML": _playerSlotHTML3,
        "theClient": _theClient4
      };

      _spectators8.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad9));
      }); // Send this to the client who pressed join


      var _payLoadClient = {
        "method": "joinTableClient"
      };
    }

    if (result.method === "updateTable") {
      var _playerSlot2 = result.playerSlot;
      console.log(_playerSlot2); // const payLoad = {
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
      var _players9 = result.players;
      var _player3 = result.player;
      var _spectators9 = result.spectators;
      var _payLoad10 = {
        "method": "updatePlayerCards",
        "players": _players9,
        "player": _player3,
        "resetCards": resetCards
      };

      _spectators9.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad10));
      });
    }

    if (result.method === "updateDealerCards") {
      var _players10 = result.players;
      var _spectators10 = result.spectators;
      var _player4 = result.player;
      var _dealer2 = result.dealer;
      var _dealersTurn2 = result.dealersTurn;
      var dealerHiddenCardRemoveNext = result.dealerHiddenCardRemoveNext;
      var _payLoad11 = {
        "method": "updateDealerCards",
        "player": _player4,
        "dealer": _dealer2,
        "players": _players10,
        "dealersTurn": _dealersTurn2,
        "dealerHiddenCardRemoveNext": dealerHiddenCardRemoveNext
      };

      if (_dealersTurn2 === false) {
        _spectators10.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad11));
        });
      }

      if (_dealersTurn2 === true) {
        _players10.pop(_players10.slice(-1)[0]);

        _spectators10.forEach(function (c) {
          clients[c.clientId].connection.send(JSON.stringify(_payLoad11));
        });
      }
    }

    if (result.method === "dealersTurn") {
      var _players11 = result.players;
      var _dealersTurn3 = result.dealersTurn;
      var _spectators11 = result.spectators;
      var _payLoad12 = {
        "method": "dealersTurn",
        "dealersTurn": _dealersTurn3
      };

      _spectators11.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad12));
      });
    }

    if (result.method === "terminate") {
      console.log("terminate player");
      var _gameId3 = result.gameId;
      var _game2 = games[_gameId3];
      var _spectators12 = result.spectators;
      var _theClient5 = result.theClient; // const playerSlotHTML = result.playerSlotHTML;
      // let players = result.players;

      var reload = result.reload; // To prevent error when user disconnects outside a game

      if (_game2 === undefined) {
        _game2 = {
          "spectators": {},
          "players": {},
          "playerSlotHTML": {}
        };
      }

      console.log(_game2);
      console.log(_spectators12);
      console.log(_game2.spectators); // Get what index the player is in so we can later delete him from the table on the client side

      var playerSlotIndex = null; // If player reloads page, remove him from spectators array

      if (reload === true) {
        // Terminate player from spectators  
        for (var _i2 = 0; _i2 < _game2.spectators.length; _i2++) {
          if (_theClient5.clientId === _game2.spectators[_i2].clientId) {
            _game2.spectators.splice(_i2, 1);
          }
        }
      } // Terminate player from playerSlotHTML


      for (var _i3 = 0; _i3 < _game2.playerSlotHTML.length; _i3++) {
        if (_theClient5.clientId === _game2.playerSlotHTML[_i3]) {
          playerSlotIndex = _i3;
          _game2.playerSlotHTML[_i3] = {};
        }
      } // Terminate player from players array


      for (var _i4 = 0; _i4 < _game2.players.length; _i4++) {
        if (_theClient5.clientId === _game2.players[_i4].clientId) {
          _game2.players.splice(_i4, 1);
        }
      }

      console.log(123456789);
      var _payLoad13 = {
        "method": "leave",
        // "spectators": game.spectators,
        "playerSlotIndex": playerSlotIndex,
        // "players": players,
        "game": _game2
      };

      _spectators12.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad13));
      }); // // Send to THE client
      // const con = clients[clientId].connection
      // con.send(JSON.stringify(payLoad));

    }

    if (result.method === "playersLength") {
      var _gameId4 = result.gameId;
      var _game3 = games[_gameId4];
      var _spectators13 = _game3.spectators;
      var playersLength = _game3.spectators.length;
      console.log(playersLength);
      var payLoadLength = {
        "method": "playersLength",
        "playersLength": playersLength
      };
      console.log("tattare");
      console.log(_game3); // const con = clients[clientId].connection
      // con.send(JSON.stringify(payLoadLength));
      // spectators.forEach(c => {
      //   clients[c.clientId].connection.send(JSON.stringify(payLoadLength))
      // })

      connection.send(JSON.stringify(payLoadLength));
    }

    if (result.method === "resetRound") {
      var _spectators14 = result.spectators;
      var _payLoad14 = {
        "method": "resetRound"
      };

      _spectators14.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad14));
      });
    }

    if (result.method === "playerResult") {
      var _spectators15 = result.spectators;
      var _players12 = result.players;
      var _payLoad15 = {
        "method": "playerResult",
        "players": _players12
      };

      _spectators15.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad15));
      });
    }

    if (result.method === "playerResultNatural") {
      var _spectators16 = result.spectators;
      var _players13 = result.players;
      var playerNaturalIndex = result.playerNaturalIndex;
      var _payLoad16 = {
        "method": "playerResultNatural",
        "players": _players13,
        "playerNaturalIndex": playerNaturalIndex
      };

      _spectators16.forEach(function (c) {
        clients[c.clientId].connection.send(JSON.stringify(_payLoad16));
      });
    }

    if (result.method === "syncGame") {
      var _gameId5 = result.gameId;
      var _game4 = games[_gameId5];
      var _gameOn3 = result.gameOn;
      var _dealer3 = result.dealer;
      var _players14 = result.players;
      var _player5 = result.player;
      var _spectators17 = result.spectators; // Sync players & spectators arrays

      _game4.gameOn = _gameOn3;
      _game4.dealer = _dealer3;
      _game4.players = _players14;
      _game4.player = _player5;
      _game4.spectators = _spectators17; // console.log(game)
    }
  }); // The ClientId

  var clientId = guid(); // The Client

  clients[clientId] = {
    "connection": connection
  }; // The client object

  var theClient = {
    "nickname": "",
    "cards": [],
    "bet": 0,
    "balance": 100000,
    "sum": null,
    "hasAce": false,
    "isReady": false
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
}

console.log(partyId());