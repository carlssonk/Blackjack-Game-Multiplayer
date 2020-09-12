// Websocket server
const http = require("http");
const express = require("express");
const { client } = require("websocket");
const { join } = require("path");
const app = express();
// Serve all the static files, (ex. index.html app.js style.css)
app.use(express.static("public/"));
app.listen(8081, ()=>console.log("Listening on http port 8081"))
const websocketServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(8080, () => console.log("Listening... on 8080"));
// hashmap clients
const clients = {};
const games = {};
const players = {};
const spectators = {};
// const lobbySpectators = {};
const playerSlotHTML = {};

let dealer = null;
let gameOn = null;
let player = null;


const wsServer = new websocketServer({
  "httpServer": httpServer
});


wsServer.on("request", request => {
  // Someone trying to connect
  const connection = request.accept(null, request.origin);
  connection.on("open", () => console.log("opened"))
  connection.on("close", () => {
    console.log("closed")
    // console.log(clients)
  });

  connection.on("message", message => {
    const result = JSON.parse(message.utf8Data)

    // a user want to create a new game
    if (result.method === "create") {
      const clientId = result.clientId;
      const theClient = result.theClient;
      const playerSlot = result.playerSlot
      const playerSlotHTML = result.playerSlotHTML
      const roomId = partyId();
      const gameId = "http://localhost:8081/" + roomId;
      app.get('/' + roomId, (req,res) => {
        res.sendFile(__dirname +'/public/index.html');
      });
      console.log(app._router.stack.slice(-1, 1))
      console.log(app._router.stack.length)
      setTimeout(function() {
      console.log(app._router.stack.length)
      }, 5000)
      // .route.path
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
        "playerSlotHTML": [
          // 7 objectes because the playerSlot has a length of 7
          {},
          {},
          {},
          {},
          {},
          {},
          {}
        ]
      }

      const payLoad = {
        "method": "create",
        "game": games[gameId],
        "roomId": roomId
      }

      const con = clients[clientId].connection
      con.send(JSON.stringify(payLoad));
      }

    // a client want to join
    if (result.method === "join") {
      const nickname = result.nickname
      const gameId = result.gameId;
      const roomId = result.roomId;
      let theClient = result.theClient;
      const clientId = result.clientId;
      // const gameId = result.gameId;
      const game = games[gameId];
      let players = game.players;
      // console.log(players)
      const spectators = game.spectators;
      const playerSlot = game.playerSlot;
      const playerSlotHTML = game.playerSlotHTML
      // const partyId = result.partyId;

      theClient.nickname = nickname

      if (game.spectators.length >= 7) {
        // Max players reached
        return;
      }

      // Push unique Id to the client
      theClient.clientId = clientId
      // Push client to players array
      // game.players.push(theClient)
      game.spectators.push(theClient)

      // Assign theClient to game.spectators[i]
      for(let i = 0; i < game.spectators.length; i++) {
        if(game.spectators[i].clientId === clientId) {
          // theClient = game.spectators[i]
          game.spectators[i] = theClient
        }
      }
 
      const payLoad = {
        "method": "join",
        "game": game,
        "players": players,
        "spectators": spectators,
        "playerSlotHTML": playerSlotHTML,
        "roomId": roomId
      }


      // loop through all clients and tell them that people has joined
      // if(game.players.length === 0) {
      if(!game.gameOn === true) {
        game.spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        });
      }

      // }

      
      const payLoadClient = {
        "method": "joinClient",
        "theClient": theClient,
        // "players": players,
        // "spectators": spectators,
        // "playerSlotHTML": playerSlotHTML,
        "game": game,
        // "gameOn": gameOn
      }
      // Send theClient to THE CLIENT
      if(!game.gameOn === true) {
        clients[clientId].connection.send(JSON.stringify(payLoadClient))
      }
      // Important to send this payLoad last, because it needs to know the the clientId
      const payLoadClientArray = {
        "method": "updateClientArray",
        "players": players,
        "spectators": spectators,
        "playerSlot": playerSlot,
        "playerSlotHTML": playerSlotHTML
      }

      // if(game.players.length === 0) {
        if(!game.gameOn === true) { 
          game.spectators.forEach(c => {
            clients[c.clientId].connection.send(JSON.stringify(payLoadClientArray))
          });
        }
      // }


    
      // If a player joins mid-game
      const payLoadMidGame = {
        "method": "joinMidGame",
        "theClient": theClient,
        "game": game
      }

      if(game.gameOn === true) {
        clients[clientId].connection.send(JSON.stringify(payLoadMidGame))
      }

      // Send this to ALL clients, to let them know that a new spectator joined
      const payLoadMidGameUpdate = {
        "method": "joinMidGameUpdate",
        "spectators": spectators
      }
      if(game.gameOn === true) {
        game.spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoadMidGameUpdate))
        });
      }


    }


    if(result.method === "joinLobby") {
    //   const gameId = result.gameId;
    //   const roomId = result.roomId;
    //   const game = games[gameId];
    //   const spectators = game.spectators;
    //   const lobbySpectators = game.lobbySpectators
    //   let theClient = result.theClient;
    //   const clientId = result.clientId;


    //   theClient.clientId = clientId
    //   game.lobbySpectators.push(theClient)

    //   for(let i = 0; i < game.lobbySpectators.length; i++) {
    //     if(game.lobbySpectators[i].clientId === clientId) {
    //       // theClient = game.spectators[i]
    //       game.lobbySpectators[i] = theClient
    //     }
    //   }

    //   console.log(game.lobbySpectators)
    //   console.log(game.lobbySpectators)
    //   console.log(game.lobbySpectators)


    //   const payLoad = {
    //     "method": "joinLobby",
    //     "game": game,
    //     "spectators": spectators,
    //     "lobbySpectators": lobbySpectators,
    //     "roomId": roomId
    //   }

    //   // Send to All clients that are in room
    //   game.spectators.forEach(c => {
    //     clients[c.clientId].connection.send(JSON.stringify(payLoad))
    //   });
    //   // Send to the lobby client
    //   connection.send(JSON.stringify(payLoad))


    }

    if(result.method === "terminateRoom") {
      // let roomId = result.roomId

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
    }

    // bets
    if (result.method === "bet") {
      const players = result.players
      const spectators = result.spectators

      const payLoad = {
        "method": "bet",
        "players": players,
        // "spectators": spectators
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "deck") {
      const players = result.players
      const spectators = result.spectators
      const deck = result.deck
      const gameOn = result.gameOn

      const payLoad = {
        "method": "deck",
        "deck": deck,
        "gameOn": gameOn
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "isReady") {
      const theClient = result.theClient
      const playerBet = theClient
      const players = result.players
      const spectators = result.spectators
     

      const payLoad = {
        "method": "isReady",
        "players": players,
        "theClient": theClient
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })

    }

    if (result.method === "hasLeft") {
      const theClient = result.theClient
      const players = result.players
      const spectators = result.spectators
     
      console.log(theClient.hasLeft)
      console.log(players)

      const payLoad = {
        "method": "hasLeft",
        "players": players,
        "theClient": theClient
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })

    }

    if (result.method === "currentPlayer") {
      const players = result.players
      const player = result.player
      const dealersTurn = result.dealersTurn
      const spectators = result.spectators

      const payLoad = {
        "method": "currentPlayer",
        "player": player
      }

      if(dealersTurn === false) {
      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

      if(dealersTurn === true) {
        players.pop(players.slice(-1)[0])
        spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }
    }    

    if (result.method === "update") {
      const players = result.players
      const dealer = result.dealer
      const deck = result.deck
      const spectators = result.spectators
      const gameOn = result.gameOn
      const dealersTurn = result.dealersTurn

      const payLoad = {
        "method": "update",
        "players": players,
        "dealer": dealer,
        "deck": deck,
        "gameOn": gameOn,
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "thePlay") {
      const players = result.players
      const gameId = result.gameId;
      const game = games[gameId];
      const player = result.player
      const dealersTurn = result.dealersTurn
      const currentPlayer = result.currentPlayer
      const spectators = result.spectators
      console.log("thePlay")
      console.log(player)
      console.log(player)
      console.log(player)
      console.log("thePlay")


      const payLoad = {
        "method": "thePlay",
        "player": player,
        "currentPlayer": currentPlayer,
        "players": player,
        // "theClient": theClient
      }

      // players[currentPlayer].clientId.connection.send(JSON.stringify(payLoad))
      if (dealersTurn === false) {
        game.players.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })        
      }

    }

    if (result.method === "showSum") {
      const players = result.players
      const spectators = result.spectators

      const payLoad = {
        "method": "showSum",
        "players": players
      }

        spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })        
    }

    if (result.method === "joinTable") {
      let theClient = result.theClient
      const user = result.theClient
      const theSlot = result.theSlot
      const gameId = result.gameId;
      const game = games[gameId];
      const spectators = game.spectators
      const players = game.players
      const playerSlotHTML = game.playerSlotHTML

      // Update all palyerSlots
      // for(let i = 0; i < playerSlot.length; i++) {
      //   if(playerSlot[i].innerHTML === clientId) {
      //     playerSlotHMTL
      //   }
      // }

      // Push client to players array
      game.players.push(theClient)
      // Push client Id to playerSlotHTML array
      game.playerSlotHTML[theSlot] = (clientId)

      // Assign theClient to game.players[i]
      for(let i = 0; i < game.players.length; i++) {
        if(game.players[i].clientId === clientId) {
          // theClient = game.players[i]
          game.players[i] = theClient
        }
      }

      const payLoad = {
        "method": "joinTable",
        "theSlot": theSlot,
        "user": user,
        "game": game,
        "players": players,
        "spectators": spectators,
        "playerSlotHTML": playerSlotHTML,
        "theClient": theClient
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })

      // Send this to the client who pressed join
      const payLoadClient = {
        "method": "joinTableClient"
      }
    }

    if (result.method === "updateTable") {
      const playerSlot = result.playerSlot

      // const payLoad = {
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

    if(result.method === "updatePlayerCards") {
      const resetCards = result.resetCards
      const players = result.players
      const player = result.player
      const spectators = result.spectators
    
      const payLoad = {
        "method": "updatePlayerCards",
        "players": players,
        "player": player,
        "resetCards": resetCards

      }
      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "updateDealerCards") {
      const players = result.players
      const spectators = result.spectators
      const player = result.player
      const dealer = result.dealer
      const dealersTurn = result.dealersTurn
      const dealerHiddenCardRemoveNext = result.dealerHiddenCardRemoveNext
      const payLoad = {
        "method": "updateDealerCards",
        "player": player,
        "dealer": dealer,
        "players": players,
        "dealersTurn": dealersTurn,
        "dealerHiddenCardRemoveNext": dealerHiddenCardRemoveNext

      }
      if(dealersTurn === false) {
        spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }

      if(dealersTurn === true) {
        players.pop(players.slice(-1)[0])
        spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }
    }

    if(result.method === "dealersTurn") {
      const players = result.players
      const dealersTurn = result.dealersTurn
      const spectators = result.spectators
      const payLoad = {
        "method": "dealersTurn",
        "dealersTurn": dealersTurn

      }
      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "terminate") {
      console.log("terminate player")
      let game = result.game
      let spectators = result.spectators;
      let players = result.players;
      const theClient = result.theClient;
      const reload = result.reload;
      const gameOn = result.gameOn;

      // To prevent error when user disconnects outside a game
      if(game === undefined) {
        game = {
          "spectators": {},
          "players": {},
          "playerSlotHTML": {}
        }
      }

      // Get what index the player is in so we can later delete him from the table on the client side
      let playerSlotIndex = null;


      if(gameOn === false) {

        // If player reloads page, remove him from spectators array
        if(reload === true) {
        // Terminate player from spectators  
          for(let i = 0; i < game.spectators.length; i++) {
            if(clientId === game.spectators[i].clientId) {
              game.spectators.splice(i, 1)
            }
          }
        }

        // Terminate player from playerSlotHTML
        for(let i = 0; i < game.playerSlotHTML.length; i++) {
          if(clientId === game.playerSlotHTML[i]) {
            playerSlotIndex = i;
            game.playerSlotHTML[i] = {}
          }
        }
        // Terminate player from players array
        for(let i = 0; i < game.players.length; i++) {
          if(clientId === game.players[i].clientId) {
            game.players.splice(i, 1)
            // players.splice(i, 1)
          }
        }

      }

      // Terminate player from playerSlotHTML
      for(let i = 0; i < game.playerSlotHTML.length; i++) {
        if(clientId === game.playerSlotHTML[i]) {
          playerSlotIndex = i;
        }
      }
      
      const payLoad = {
        "method": "leave",
        // "spectators": game.spectators,
        "playerSlotIndex": playerSlotIndex,
        "players": players,
        "game": game,
        "gameOn": gameOn
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })



      // lobbySpectators.forEach(c => {
      //   clients[c.clientId].connection.send(JSON.stringify(payLoad))        
      // });
     
      // // Send to THE client
      // const con = clients[clientId].connection
      // con.send(JSON.stringify(payLoad));
      
    }

    if(result.method === "playersLength") {
      const gameId = result.gameId;
      const game = games[gameId]
      const spectators = game.spectators
      const playersLength = game.spectators.length

      const payLoadLength = {
        "method": "playersLength",
        "playersLength": playersLength
      }

      connection.send(JSON.stringify(payLoadLength))
    }

    if(result.method === "resetRound") {
      const spectators = result.spectators
      const theClient = result.theClient

      const payLoad = {
        "method": "resetRound",
        "theClient": theClient
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "playerResult") {
      const spectators = result.spectators
      const players = result.players

      const payLoad = {
        "method": "playerResult",
        "players": players
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "playerResultNatural") {
      const spectators = result.spectators
      const players = result.players
      const playerNaturalIndex = result.playerNaturalIndex

      const payLoad = {
        "method": "playerResultNatural",
        "players": players,
        "playerNaturalIndex": playerNaturalIndex
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "finalCompare") {
      const spectators = result.spectators
      const gameId = result.gameId;
      const game = games[gameId];
      const players = result.players
      game.players = players

      const payLoad = {
        "method": "finalCompare",
        // "players": players
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "resetGameState") {
      const spectators = result.spectators
      const gameId = result.gameId;
      const game = games[gameId];
      const players = result.players
      game.players = players

      const payLoad = {
        "method": "resetGameState",
        "game": game
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }


    if(result.method === "getRoute") {
      const getRouteId = result.getRouteId
      let isRouteDefined = null;

      console.log(app._router.stack.length)
      for(let i = 3; i < app._router.stack.length; i++) {
        if(app._router.stack[i].route.path === "/" + getRouteId) {
          isRouteDefined = true;
        } else {
          isRouteDefined = false;
        }
      }
      console.log("-----KUK---")
      console.log(getRouteId)
      console.log(isRouteDefined)
      console.log("-----KUK---")
      // if route is not available, redirect to home page
      const payLoadRoute = {
        "method": "redirect",
        "isRouteDefined": isRouteDefined
      }
      
      if(isRouteDefined === false) {
        connection.send(JSON.stringify(payLoadRoute))
      }

    }


    if(result.method === "syncGame") {
      const gameId = result.gameId;
      let game = games[gameId];
      const gameOn = result.gameOn
      const dealer = result.dealer
      const players = result.players;
      const player = result.player;
      const spectators = result.spectators;

      if(game === undefined) {
        game = {}
      }
      // Sync players & spectators arrays
      game.gameOn = gameOn;
      game.dealer = dealer;
      game.players = players;
      game.player = player;
      game.spectators = spectators;
      
    }


    


  });
      // The ClientId
      const clientId = guid();
      // The Client
      clients[clientId] = {
        "connection": connection
      }

      // The client object
      let theClient = {
        "nickname": "",
        "cards": [],
        "bet": 0,
        "balance": 100000,
        "sum": null,
        "hasAce": false,
        "isReady": false,
        "blackjack": false,
        "hasLeft": false
      }
      let player = null;
      // The players Array
      players[theClient] = {
        "connection": connection
      }
      players[player] = {
        "connection": connection
      }
      // The spectator Array
      spectators[theClient] = {
        "connection": connection
      }

      

      // Send this to client
      const payLoad = {
        "method": "connect",
        "clientId": clientId,
        "theClient": theClient
      }

      // Send the payLoad to the client
      connection.send(JSON.stringify(payLoad))



});






 
// Generates unique guid (i.e. unique user ID)
const guid=()=> {
  const s4=()=> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);     
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

// Random Part ID
function partyId() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

console.log(partyId());




app.get('/:id', (req,res) => {
  res.sendFile(__dirname +'/public/index.html');
});

app.get('*', function(req, res) {
  res.redirect('/');
});