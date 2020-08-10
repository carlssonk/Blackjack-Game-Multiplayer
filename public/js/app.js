// Blackjack Game
// #############################

// const { response } = require("express");

// HTML
let play = document.querySelector("#play");
let betButtons = document.querySelectorAll(".betButtons");
let ready = document.querySelector("#ready");
const standBtn = document.querySelector("#stand");
const hitBtn = document.querySelector("#hit");
const doubleDownBtn = document.querySelector("#doubleDown");
const userAction = document.querySelectorAll(".userAction");
const countAce = document.querySelectorAll(".countAce")

// Basic utilities to navigate through the game
let startedGame = false;
let currentPlayer = 0;
let sum = null;
let dealersTurn = false;

// Cards (suit)
const suit = ["Heart", "Diamond", "Spade", "Club"]
// Cards (values)
const values = [
  {
    "card": "A",
    "value": [1, 11],
    "hasAce": true
  },
  {
    "card": "2",
    "value": 2
  },
  {
    "card": "3",
    "value": 3
  },
  {
    "card": "4",
    "value": 4
  },
  {
    "card": "5",
    "value": 5
  },
  {
    "card": "6",
    "value": 6
  },
  {
    "card": "7",
    "value": 7
  },
  {
    "card": "8",
    "value": 8
  },
  {
    "card": "9",
    "value": 9
  },
  {
    "card": "10",
    "value": 10
  },
  {
    "card": "J",
    "value": 10
  },
  {
    "card": "Q",
    "value": 10
  },
  {
    "card": "K",
    "value": 10
  }
]

// Actual deck (suit & values combined)
let deck = []
// theDeal is false when the deal is done
const theDeal = false;
// thePlay is true when the deal is done
const ThePlay = false;

// let player = null;
// let currentPlayer =

// Dealer
let dealer = {
  "cards": [],
  "hiddenCard": [],
  "sum": null,
  "hasAce": false
}
// Players
let players = []
let spectators = []


// NOTE: player means current player
let player = players[currentPlayer];

// let lastPlayer = players.slice(-1)[0];

// Player cards (DELETE THIS OBJECT LATER)
// const player = {
//   "cards": [],
//   "bet": 0,
//   "balance": 1000,
//   "sum": null,
//   "hasAce": false
// }

// INIT
Init()

function Init() {
  // getPlayers
  playerBets()
}

// Get deck
function getDeck() {
  // Loop through suite AND values
  for(let s = 0; s < suit.length; s++) {
    for(let v = 0; v < values.length; v++) {
      let card = {suit: suit[s], value: values[v]}
      deck.push(card);
    }
  }
  shuffle(deck)
}
// Shuffle Deck
function shuffle(deck) {
  // Shuffle by 2 random locations 1000 times
  for(let i = 0; i < 1000; i++) {
    let location1 = Math.floor((Math.random() * deck.length));
    let location2 = Math.floor((Math.random() * deck.length));
    let tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;

  }
}

// Easy accessing of deck
let card = deck.map(obj => (obj.value.card))
let value = deck.map(obj => (obj.value.value))


// Play Game
play.addEventListener("click", () => {
  startedGame = true;
});

// Place Bets
function playerBets() {
    for(let b = 0; b < betButtons.length; b++) {

      let betAmount = parseInt(betButtons[b].value)
      betButtons[b].addEventListener("click", () => {

        if (betAmount <= theClient.balance) {
          // Add to bet & remove from balance
          theClient.bet = theClient.bet + betAmount
          theClient.balance = theClient.balance - betAmount
        } else {
          alert("Need more balance")
        }
        sendPlayerBets()
      });
    }
}
// function sendPlayerBets() {
//   const payLoad = {
//     "method": "bet",
//     "gameId": gameId,
//     "theClient": theClient,
//     "players": game.players
//   }
//   ws.send(JSON.stringify(payLoad));
// }
// When all bets placed, fire up Deal the cards
  // Loop through all players to check if they'r ready
ready.addEventListener("click", () => {
  player = players[currentPlayer];
  updateCurrentPlayer()
  let playersReady = 0;
  clientIsReady()

  // Loop through all players and check if they'r READY
  for(let i = 0; i < players.length; i++) {
    if (players[i].isReady === true) playersReady++;
  }

  if(playersReady === players.length) {
    getDeck();
    sendPlayerDeck();
    setTimeout(dealCards, 500);
  }
});






// ***************INITIALIZE ROUND / ROUND START*******************

function dealCards() {
  // Set current player
  player = players[currentPlayer];
  updateCurrentPlayer()
  // Give each player 1 card
  for(let i = 0; i < players.length; i++) {
    setTimeout(function(){
      console.log(deck[0])
      player.cards.push(deck[0])
      deck.shift()
      updatePlayerCards()
      nextPlayerInitial()
      // Deal dealer cards when all players have 1 card
      if (i+1 === players.length) dealDealerCards();
    }, i*500)

  }    

}

function dealDealerCards() {
  setTimeout(function () {
    console.log(deck[0])
    if(dealer.cards.length === 1) {
      // If dealer has 1 card, push next card to hidden card
      dealer.hiddenCard.push(deck[0])
      deck.shift()
      updateDealerCards();
      updatePlayers()
      // Check if natural and Enable the First player to take an action
      setTimeout(function() {
        naturals();
        sendPlayerThePlay();
      }, 1000)
    } else {
      // If deal has NOT 1 card, push to default card array
      dealer.cards.push(deck[0])
      deck.shift()
      updateDealerCards();
      updatePlayers()
      // Deal cards again
      setTimeout(function() {
        dealCards()
      }, 500)
    }
  }, 500)
}

// Naturals
function naturals() {
  for(let i = 0; i < players.length; i++) {
    // Below is all the scenarios (combinations) the player can get on the first 2 cards
    if (Array.isArray(players[i].cards[0].value.value) || Array.isArray(players[i].cards[1].value.value)) { // Checks if player has a card with an ACE (the ace is an array)

      if (players[i].cards[0].value.value === 10 || players[i].cards[1].value.value === 10) {               // Checks if player has a TEN
        console.log("A ten & and ace")
        naturalBlackjack(i)
        players[i].hasAce = true;
      } else if(players[i].cards[0].value.card === "A" && players[i].cards[1].value.card === "A") {         // Checks if player has TWO aces
        console.log("TWO aces")
        naturalBlackjack(i)
        players[i].hasAce = true;
      } else {                                                                                              // Checks all cards except for ACE and TEN
        console.log("an ace with a defualt card");
        naturalPlayerAceSum(i)
        players[i].hasAce = true;
      }
    } else {                                                                                                // All cards except for ACE
      console.log("defualt cards");
      players[i].sum = players[i].cards[0].value.value + players[i].cards[1].value.value;
    }
  }
  // Initialize dealers values
  dealer.sum = dealer.cards[0].value.value;
  if(dealer.cards[0].value.card === "A") dealer.hasAce = true;
  updatePlayers()
}
function naturalBlackjack(i) {
  players[i].sum = 21;
  players[i].cards = [];
  // Multiply player bet by 1.5 (this is the 3:2 ratio)
  players[i].balance = players[i].balance + (1.5 * players[i].bet + players[i].bet)
  players[i].bet = 0;
}
function naturalPlayerAceSum(i) {   
  // This adds .sum[0] to always be the lowest and .sum[1] to always be the highest
  if (players[i].cards[0].value.card === "A") {
    players[i].sum = [players[i].cards[1].value.value + 1, players[i].cards[1].value.value + 11]
  } else {
    players[i].sum = [players[i].cards[0].value.value + 1, players[i].cards[0].value.value + 11]
  }
}

// ****************************************************************

// *******************PLAYER MAKES HIS MOVE*********************



function thePlay() {
  // Alert current player
  // player.alert.....
  for(let i = 0; i < userAction.length; i++) {
    userAction[i].addEventListener("click", function() {

      if(this === userAction[0] && clicked === false) {
        clicked = true;
        doubleDown = false;

        console.log("stand")
        sendPlayerNext();


      } else if(this === userAction[1] && clicked === false) {
        clicked = true;
        doubleDown = false;
              
        console.log("Hit")
        playerHit();
        // updatePlayers();

      } else if(this === userAction[2] && player.balance >= player.bet && clicked === false) {
        clicked = true;
        doubleDown = true;

        console.log("Double Dowm")
        playerDoubleDown();
        // updatePlayers();

      }
  }, {once: true});
  }
}

// *************************************************************

// **********************PLAYER ACTIONS*************************

function playerHit() {
  if(player.hasAce === true || deck[0].value.hasAce === true) {
    console.log("ACE")
    compareSumAce(); // <--- compare sum if an ACE is included in the hit
  }

  if(player.hasAce === false && deck[0].value.hasAce === undefined) {
    console.log("only rafael 2")
    // console.log(dealersTurn)
    compareSum(); // <--- compare sum if ACE is not included in the hit 
  }



}

function sendPlayerNext() {
  console.log("sendPlayerNext")

  if(player.sum.length === 2) {
    player.sum.shift()
    player.sum = player.sum[0]
  }

  if(dealersTurn === false) nextPlayer();
  
  if(currentPlayer+1 > players.length) {
    dealerPlay();
  } else {
    sendPlayerThePlay();
  }
}

function playerDoubleDown() {
  player.balance = player.balance - player.bet;
  player.bet = player.bet * 2;  
  playerHit()
}

// *************************************************************

// *************************DEALER PLAY*************************

function dealerPlay() {
  console.log("DealerPlay")
  dealersTurn = true;
  // sendDealersTurn();
  // PUSH DEALER TO PLAYER ARRAY
  players.push(dealer);
  console.log("should be 2 above this")
  //PUSH DEALERS HIDDEN CARD TO DECK[0]
  deck.unshift(dealer.hiddenCard[0])
  // Push dealers hidden card to deck[0] REMOVE
  // dealer.cards.push(dealer.hiddenCard[0]); REMOVE
  dealer.hiddenCard = [];
  player = players[currentPlayer];
  updateCurrentPlayer()
  if(player.hasAce === true || deck[0].value.hasAce === true) {
    compareSumAce()
  } else {
    compareSum()
  }
  // deck.shift()
  
  // if(dealer.sum > 16 || dealer.sum[1] > 16) {
  //   console.log("!!!!!!!!!!")
  //   finalCompare();
  // } 
  //   console.log("hit once")
  //   playerHit()
  // } else {
  //   console.log("final compare 1")
  //   finalCompare()
  // }
}
// If dealer.sum is less than 17, he must keep hitting until he gets 17
// function dealerSum() {
//   console.log("DealerSum")
//   console.log(players)
  // if(dealer.sum < 17) {
  //   playerHit()
  // } else {
  //   finalCompare()
  // }
// }

// *************************************************************

// ***********************FINAL COMPARE*************************

function finalCompare() {
  // If dealer has 2 sums (i.e. an ace), count the highest only
  if(player.sum.length === 2) {
    player.sum.shift()
    player.sum = player.sum[0]
  }
  // remove dealer from player
  players.pop(players.slice(-1)[0])
  console.log(players)
  console.log("should not be 0 above this")
  // For all players That have NOT busted, compare sum to dealer
  for(let i = 0; i < players.length; i++) {
    if(players[i].cards.length > 0) {
      // Also check if dealer has bust
      if(dealer.sum > 21) {
        playerWin(i)
        console.log("DEALER BUST")
        return;
      } else if(dealer.sum < players[i].sum) {
        playerWin(i)
        console.log("player win")
        return;
      } else if(dealer.sum === players[i].sum) {
        console.log("Draw!")
        return;
      } else {
        console.log("dealer wins")
        return;
      }





    }
  }
}

function playerWin(i) {
  players[i].balance = players[i].balance + (players[i].bet * 2)
  players[i].bet = 0;
}

// *************************************************************


// ******************PLAYER ACTION ANSWERS**********************

// function blackjack() {
//   nextPlayer()
//   console.log("BLACKJACK")

// }

function bust() {
  console.log("BUST")
  player.cards = [];
  player.bet = 0;
  // updatePlayerCards()
  // updatePlayers();
  sendPlayerNext();
}

function finalResult() {
  
}

// *************************************************************

// ****************PLAYER CARDS FILTER SYSTEM*******************

// If player has Ace && deck[0] has Ace
function playerAceDeckAce() {
  console.log("only rafael 1")
  if(player.hasAce && deck[0].value.hasAce) {
    player.sum[0] = player.sum[0] + 1 // add sum
    player.sum[1] = player.sum[1] + 1 // add sum
    player.hasAce = true;
    givePlayerCard() // give player card
    // outputCardSumAce() // compare sum
    } else if(!player.hasAce && deck[0].value.hasAce) {
      player.sum = [player.sum +1, player.sum +11] // add sum
      player.hasAce = true;
      givePlayerCard() // give player card
      // outputCardSumAce() // compare & output sum
    } else if(player.hasAce && !deck[0].value.hasAce) {
      player.sum[0] = player.sum[0] + deck[0].value.value // add sum
      player.sum[1] = player.sum[1] + deck[0].value.value // add sum
      player.hasAce = true;
      givePlayerCard() // give player card
      // outputCardSumAce() // compare & output sum
    }
  }
  
// // If player has Ace No && deck[0] has Ace
// function playerNoAceDeckAce() {
// if(!player.hasAce && deck[0].value.hasAce) {
//   player.sum = [player.sum +1, player.sum +11] // add sum
//   player.hasAce = true;
//   givePlayerCard() // give player card
//   // outputCardSumAce() // compare & output sum
//   }
// }
  
// // If player has Ace && deck[0] has NO Ace
// function playerAceDeckNoAce() {
//   if(player.hasAce && !deck[0].value.hasAce) {
//     player.sum[0] = player.sum[0] + deck[0].value.value // add sum
//     player.sum[1] = player.sum[1] + deck[0].value.value // add sum
//     player.hasAce = true;
//     givePlayerCard() // give player card
//     // outputCardSumAce() // compare & output sum
//   }
// }
  
// If no Ace is included
function compareSum() {
  // console.log("only rafael 2")
  if(!player.hasAce && !deck[0].value.hasAce) {
    player.sum = player.sum + deck[0].value.value // add sum
    player.hasAce = false;
    givePlayerCard() // give player card
    // if(dealer.cards[1] === dealer.cards[2]) dealer.cards.splice(1, 1)
    // console.log("slice")
    // console.log(dealer.cards.slice(-1)[0])
    // console.log(dealer.cards.length)

    if(dealersTurn === true) {
      console.log(dealer.sum)
      console.log("111111111111111111111111111111111111")
      setTimeout(outputCardSumDealer, 2000) // compare & output sum for dealer
    } 
    if(dealersTurn === false) setTimeout(outputCardSum, 2000) // compare & output sum
  }  
}

// container for the 3 ace filters
function compareSumAce() {
  playerAceDeckAce() // <--- Check if player has a ACE && next card has ACE
  // playerNoAceDeckAce() // <--- Check if player has NOT ACE && next card has ACE
  // playerAceDeckNoAce() // <--- Check if Player has ACE && next card has NO ACE
  
  if(dealersTurn === true) {
    console.log("222222222222222222222222222222222222222")
    setTimeout(outputCardSumAceDealer, 2000) // compare & output sum for dealer
  } 
  if(dealersTurn === false) setTimeout(outputCardSumAce, 2000) // compare & output sum
}

// *************************************************************

// ******************PLAYER ACTION OUTPUTS**********************

// compare && output sum for no aces
function outputCardSum() {
  player.hasAce = false;
  if(dealersTurn === false) {
    if(player.sum === 21) sendPlayerNext();
    if(player.sum < 21 && doubleDown === false) {
      console.log("sendPlayerThePlay")
      sendPlayerThePlay();
    } else if(player.sum < 21 && doubleDown === true) {
      sendPlayerNext();
    }
    if(player.sum > 21) {
      console.log("play bust")
      bust();
    } 
  }
}

// compare && output sum for no aces
function outputCardSumAce() {
  console.log("COMPARE ACE IN")
  // Check if the higher value is over 21
  if(player.sum[1] > 21) {
    // Remove the high value from the sum & remove array from sum
    player.sum.pop()
    player.sum = player.sum[0]
    player.hasAce = false;
    // Take the current value and do the following...
    if(dealersTurn === false) {
      if(player.sum === 21) sendPlayerNext();  
      if(player.sum < 21 && doubleDown === false) {
        console.log("thePlay")
        sendPlayerThePlay();
      } else {
        console.log(doubleDown)
        console.log("NEXT1")
        sendPlayerNext();
      }
    }  
  } else {
    player.hasAce = true;
    // If higher value not over 21, do the following...
    if(dealersTurn === false) {
      if(player.sum[1] === 21) {
        player.sum.shift()
        player.sum = player.sum[0]
        console.log(doubleDown)
        console.log("NEXT2")
        sendPlayerNext();
      } 
      if(player.sum[1] < 21 && doubleDown === false) {
        console.log("thePlay")
        sendPlayerThePlay();
      } else {
        console.log(doubleDown)
        console.log("NEXT3")
        sendPlayerNext();
      }
    }
  }
}


function outputCardSumAceDealer() {
  console.log(dealer.cards.slice(-1)[0])
  if(player.sum[1] > 21) {

    player.sum.pop()
    player.sum = player.sum[0]
    player.hasAce = false;

    if(dealersTurn === true) {
      if(dealer.sum < 17) {
        console.log(dealer.cards[2])
        // updateDealerCards();
        // updatePlayers()
        playerHit()
      } else {
        console.log(dealer.cards[2])
        // updateDealerCards();
        // updatePlayers()
        finalCompare()
      }
    }
  } else {
    player.hasAce = true;

    if(dealersTurn === true) {
      if(dealer.sum[1] < 17) {
        console.log(dealer.cards[2])
        // updateDealerCards();
        // updatePlayers()
        playerHit()
      } else {
        console.log(dealer.cards[2])
        // updateDealerCards();
        // updatePlayers()
        finalCompare()
      }
    }
  }
}

function outputCardSumDealer() {
  console.log(dealer.cards.slice(-1)[0])
  console.log("do Stuffy")
  player.hasAce = false;
  if(dealersTurn === true) {
    console.log("1 mother fucker")
    if(dealer.sum < 17) {
      console.log("DealerHIT")
      console.log(dealer.cards[2])
      // updateDealerCards();
      // updatePlayers()
      playerHit()
    } else {
      console.log("final compare 2")
      console.log(dealer.cards[2])
      // updateDealerCards();
      // updatePlayers()
      finalCompare()
  }
}
}

// *************************************************************


// *******************UTILITIES************************

function givePlayerCard() {
    if(dealersTurn === true) updateDealerCards();

    player.cards.push(deck[0])
    deck.shift()

    if(dealersTurn === false) updatePlayerCards()


}

function nextPlayerInitial() {
  currentPlayer = (currentPlayer+1)%(players.length);
  player = players[currentPlayer];
}

function nextPlayer() {
  currentPlayer = currentPlayer+1;
  player = players[currentPlayer];
  // clicked = false;
  // if(currentPlayer+1 > players.length) dealerPlay();
}

// currentPlayer = (currentPlayer+1)%(players.length); <--- cycle through players

// ****************************************************








// if player Blackjack Bust or Stay, go to next player

// Compare the sums of the cards between D & P
// If P card sum is greater than 21 = Bust
// If P card sum is less than 21 = Option Hit or Stand
// If P option is stay, compare sum of D & P
// If P sum < 21 && > D sum then P wins
// IF P sum < D sum then P loses
// #############################


// Sorts defualt cards
// players[i].cards.sort(
//   function(a, b) {
//      return a.value.value > b.value.value ? 1 : -1;
//   });

// Skicka denna loggen tilla alla clients som har joinat en lobby och tryckt på "ready"
function alerting() {
  // dealCards();
}



// MULTIPLAYER WIRING EVENTS

