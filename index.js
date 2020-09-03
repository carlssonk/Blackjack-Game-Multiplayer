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
      games[gameId] = {
        "id": gameId,
        "clients": [],
        "players": [],
        "dealer": dealer,
        "gameOn": gameOn,
        "player": player,
        "spectators": [],
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
      console.log("#####")
      console.log(game)
      console.log("------")
      let players = game.players;
      // console.log(players)
      const spectators = game.spectators;
      const playerSlot = game.playerSlot;
      const playerSlotHTML = game.playerSlotHTML
      // const partyId = result.partyId;
      console.log("DIN TATTARE")
      console.log(game.players)

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
          theClient = game.spectators[i]
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
        game.spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        });
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
        clients[clientId].connection.send(JSON.stringify(payLoadClient))

      // Important to send this payLoad last, because it needs to know the the theClient.clientId
      const payLoadClientArray = {
        "method": "updateClientArray",
        "players": players,
        "spectators": spectators,
        "playerSlot": playerSlot,
        "playerSlotHTML": playerSlotHTML
      }

      // if(game.players.length === 0) {
        game.spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoadClientArray))
        });
      // }




      // If a player joins mid-game
      const payLoadMidGame = {
        "method": "joinMidGame",
        "theClient": theClient,
        "game": game
      }

      clients[clientId].connection.send(JSON.stringify(payLoadMidGame))

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

    if (result.method === "currentPlayer") {
      const players = result.players
      const player = result.player
      const dealersTurn = result.dealersTurn
      const spectators = result.spectators
      console.log(player)

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

      const payLoad = {
        "method": "update",
        "players": players,
        "dealer": dealer,
        "deck": deck,
        "gameOn": gameOn
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "thePlay") {
      const players = result.players
      const player = result.player
      const dealersTurn = result.dealersTurn
      const currentPlayer = result.currentPlayer
      const spectators = result.spectators


      const payLoad = {
        "method": "thePlay",
        "player": player,
        "currentPlayer": currentPlayer
      }

      // players[currentPlayer].clientId.connection.send(JSON.stringify(payLoad))
      if (dealersTurn === false) {
        spectators.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })        
      }

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
      //   if(playerSlot[i].innerHTML === theClient.clientId) {
      //     playerSlotHMTL
      //   }
      // }

      // Push client to players array
      game.players.push(theClient)
      // Push client Id to playerSlotHTML array
      game.playerSlotHTML[theSlot] = (theClient.clientId)
      console.log(playerSlotHTML)

      // Assign theClient to game.players[i]
      for(let i = 0; i < game.players.length; i++) {
        if(game.players[i].clientId === clientId) {
          theClient = game.players[i]
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
      console.log(playerSlot)

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
      let gameId = result.gameId;
      let game = games[gameId];
      let spectators = result.spectators;
      const theClient = result.theClient;
      // const playerSlotHTML = result.playerSlotHTML;
      // let players = result.players;
      const reload = result.reload;

      // To prevent error when user disconnects outside a game
      if(game === undefined) {
        game = {
          "spectators": {},
          "players": {},
          "playerSlotHTML": {}
        }
      } 
      
      console.log(game)
      console.log(spectators)
      console.log(game.spectators)

      // Get what index the player is in so we can later delete him from the table on the client side
      let playerSlotIndex = null;

      // If player reloads page, remove him from spectators array
      if(reload === true) {
      // Terminate player from spectators  
        for(let i = 0; i < game.spectators.length; i++) {
          if(theClient.clientId === game.spectators[i].clientId) {
            game.spectators.splice(i, 1)
          }
        }        
      }

      // Terminate player from playerSlotHTML
      for(let i = 0; i < game.playerSlotHTML.length; i++) {
        if(theClient.clientId === game.playerSlotHTML[i]) {
          playerSlotIndex = i;
          game.playerSlotHTML[i] = {}
        }
      }
      // Terminate player from players array
      for(let i = 0; i < game.players.length; i++) {
        if(theClient.clientId === game.players[i].clientId) {
          game.players.splice(i, 1)
        }
      }

      console.log(123456789)
      
      const payLoad = {
        "method": "leave",
        // "spectators": game.spectators,
        "playerSlotIndex": playerSlotIndex,
        // "players": players,
        "game": game
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })

      // // Send to THE client
      // const con = clients[clientId].connection
      // con.send(JSON.stringify(payLoad));
      
    }

    if(result.method === "playersLength") {
      const gameId = result.gameId;
      const game = games[gameId]
      const spectators = game.spectators
      const playersLength = game.spectators.length
      console.log(playersLength)

      const payLoadLength = {
        "method": "playersLength",
        "playersLength": playersLength
      }
      console.log("tattare")
      console.log(game)
      // const con = clients[clientId].connection
      // con.send(JSON.stringify(payLoadLength));
      // spectators.forEach(c => {
      //   clients[c.clientId].connection.send(JSON.stringify(payLoadLength))
      // })
      connection.send(JSON.stringify(payLoadLength))
    }

    if(result.method === "resetRound") {
      const spectators = result.spectators

      const payLoad = {
        "method": "resetRound"
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


    if(result.method === "syncGame") {
      const gameId = result.gameId;
      const game = games[gameId];
      const gameOn = result.gameOn
      const dealer = result.dealer
      const players = result.players;
      const player = result.player;
      const spectators = result.spectators;
      // Sync players & spectators arrays
      game.gameOn = gameOn;
      game.dealer = dealer;
      game.players = players;
      game.player = player;
      game.spectators = spectators;
      // console.log(game)
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
        "isReady": false
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



