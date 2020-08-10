// Websocket server
const http = require("http");
const express = require("express");
const { client } = require("websocket");
const { join } = require("path");
const app = express();
// Serve all the static files, (ex. index.html app.js style.css)
app.use(express.static("public/"));
// app.get("/", (req,res) => {
//   res.sendFile(__dirname + "/index.html")
//   res.sendFile(__dirname + "/js/app.js")
// });
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

const wsServer = new websocketServer({
  "httpServer": httpServer
});
wsServer.on("request", request => {
  // Someone trying to connect
  const connection = request.accept(null, request.origin);
  connection.on("open", () => console.log("opened"))
  connection.on("close", () => console.log("closed!"))
  connection.on("message", message => {
    const result = JSON.parse(message.utf8Data)

    // a user want to create a new game
    if (result.method === "create") {
      const clientId = result.clientId;
      const theClient = result.theClient;
      const playerSlot = result.playerSlot
      const playerSlotHTML = result.playerSlotHTML
      const gameId = guid();
      games[gameId] = {
        "id": gameId,
        "clients": [],
        "players": [],
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
        "game": games[gameId]
      }

      const con = clients[clientId].connection
      con.send(JSON.stringify(payLoad));
      }

    // a client want to join
    if (result.method === "join") {
      let theClient = result.theClient;
      const clientId = result.clientId;
      const gameId = result.gameId;
      const game = games[gameId];
      const players = game.players;
      const spectators = game.spectators;
      const playerSlot = game.playerSlot;
      const playerSlotHTML = game.playerSlotHTML


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
        "playerSlotHTML": playerSlotHTML
      }

      // loop through all clients and tell them that people has joined
      game.spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      });

      const payLoadClient = {
        "method": "joinClient",
        "theClient": theClient
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

      game.spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoadClientArray))
      });

    }

    // bets
    if (result.method === "bet") {
      const players = result.players

      const payLoad = {
        "method": "bet",
        "players": players
      }

      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "deck") {
      const players = result.players
      const deck = result.deck

      const payLoad = {
        "method": "deck",
        "deck": deck
      }

      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "isReady") {
      const theClient = result.theClient
      const playerBet = theClient
      const players = result.players
     

      const payLoad = {
        "method": "isReady",
        "players": players,
        "theClient": theClient
      }

      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })

    }

    if (result.method === "currentPlayer") {
      const players = result.players
      const player = result.player
      const dealersTurn = result.dealersTurn
      console.log(player)

      const payLoad = {
        "method": "currentPlayer",
        "player": player
      }

      if(dealersTurn === false) {
      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

      if(dealersTurn === true) {
        console.log(2)
        players.pop(players.slice(-1)[0])
        players.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }
    }    

    if (result.method === "update") {
      const players = result.players
      const dealer = result.dealer
      const deck = result.deck

      const payLoad = {
        "method": "update",
        "players": players,
        "dealer": dealer,
        "deck": deck
      }

      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if (result.method === "thePlay") {
      const players = result.players
      const player = result.player
      const currentPlayer = result.currentPlayer

      const payLoad = {
        "method": "thePlay",
        "player": player,
        "currentPlayer": currentPlayer
      }

      // players[currentPlayer].clientId.connection.send(JSON.stringify(payLoad))
      players.forEach(c => {
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
        "playerSlotHTML": playerSlotHTML
      }

      spectators.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
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
      const players = result.players
      const player = result.player
      const payLoad = {
        "method": "updatePlayerCards",
        "players": players,
        "player": player

      }
      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    }

    if(result.method === "updateDealerCards") {
      const players = result.players
      const dealer = result.dealer
      const dealersTurn = result.dealersTurn
      const payLoad = {
        "method": "updateDealerCards",
        "player": player,
        "dealer": dealer

      }
      if(dealersTurn === false) {
        console.log(1)
        players.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }

      if(dealersTurn === true) {
        console.log(2)
        players.pop(players.slice(-1)[0])
        players.forEach(c => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }
    }

    if(result.method === "dealersTurn") {
      const players = result.players
      const dealersTurn = result.dealersTurn
      const payLoad = {
        "method": "dealersTurn",
        "dealersTurn": dealersTurn

      }
      players.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
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
        "cards": [],
        "bet": 0,
        "balance": 1000,
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



