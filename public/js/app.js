// Blackjack Game
// #############################

// const { response } = require("express");

// HTML
let play = document.querySelector("#play");
let betButtons = document.querySelectorAll(".betButtons");
let ready = document.querySelector(".ready");
const standBtn = document.querySelector("#stand");
const hitBtn = document.querySelector("#hit");
const doubleDownBtn = document.querySelector("#doubleDown");
const userAction = document.querySelectorAll(".userAction");
const countAce = document.querySelectorAll(".countAce")

playerSlot = document.querySelectorAll(".players");
dealerSlot = document.querySelector("#dealer");
playerCards = document.querySelectorAll(".player-cards");
dealerCards = document.querySelectorAll(".dealer-cards");

// Basic utilities to navigate through the game
let startedGame = false;
let currentPlayer = 0;
let playersReady = 0;
let sum = null;
let dealersTurn = false;
let gameOn = false;
let bool;
let showSum = false;
let chipIndex = null;
// resetCards = false;

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

const deckImg = [
  "Heart2",
  "Heart3",
  "Heart4",
  "Heart5",
  "Heart6",
  "Heart7",
  "Heart8",
  "Heart9",
  "Heart10",
  "HeartJ",
  "HeartQ",
  "HeartK",
  "HeartA",
  "Diamond2",
  "Diamond3",
  "Diamond4",
  "Diamond5",
  "Diamond6",
  "Diamond7",
  "Diamond8",
  "Diamond9",
  "Diamond10",
  "DiamondJ",
  "DiamondQ",
  "DiamondK",
  "DiamondA",
  "Spade2",
  "Spade3",
  "Spade4",
  "Spade5",
  "Spade6",
  "Spade7",
  "Spade8",
  "Spade9",
  "Spade10",
  "SpadeJ",
  "SpadeQ",
  "SpadeK",
  "SpadeA",
  "Club2",
  "Club3",
  "Club4",
  "Club5",
  "Club6",
  "Club7",
  "Club8",
  "Club9",
  "Club10",
  "ClubJ",
  "ClubQ",
  "ClubK",
  "ClubA"
]

const chipImg = [
  "White",
  "Red",
  "Blue",
  "Green",
  "Gray",
  "Orange",
  "Purple",
  "Brown",
  "Black"
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
  playerBets()
  // placeBet() // = player Ready
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
        console.log("sendPlayerBets")
        // sendPlayerBets()
      });
    }
}

// CLEAR AND MAX
$(".max-clear").click(function() {
  console.log(this.innerText)
  if(this.innerText === "CLEAR") {
    theClient.balance = theClient.balance + theClient.bet;
    theClient.bet = 0;
    $(".player-bet").text(theClient.bet)
  } else if(this.innerText === "MAX") {
    theClient.bet = theClient.balance;
    theClient.balance = 0;
    $(".player-bet").text(theClient.bet)
  }
});

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
// function placeBet() {
  $(document).on("click", ".ready", function() {
    console.log("halloooooo")
    console.log("halloooooo")
    console.log("halloooooo")
    console.log("halloooooo")
    console.log("halloooooo")
    console.log("halloooooo")
    $(".ready").addClass("hide-element")
    player = players[currentPlayer];
    updateCurrentPlayer()
    // let playersReady = 0;
    clientIsReady()

    // Loop through all players and check if they'r READY
    for(let i = 0; i < players.length; i++) {
      if (players[i].isReady === true) playersReady++;
    }

    if(playersReady === players.length) {
      gameOn = true;
      getDeck();
      sendPlayerDeck();
      setTimeout(dealCards, 1000);
    }
  });
// }







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
      }, 500)
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
        // Send player index to webSocket
        for(let x = 0; x < playerSlotHTML.length; x++) {
          if(players[i].clientId === playerSlotHTML[x]) {
            playerNaturalIndex = x;
            playerResultNatural();
          }
        }
      } else if(players[i].cards[0].value.card === "A" && players[i].cards[1].value.card === "A") {         // Checks if player has TWO aces
        console.log("TWO aces")
        naturalBlackjack(i)
        players[i].hasAce = true;
        // Send player index to webSocket
        for(let x = 0; x < playerSlotHTML.length; x++) {
          if(players[i].clientId === playerSlotHTML[x]) {
            playerNaturalIndex = x;
            playerResultNatural();
          }
        }
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
  showSum = true;
}
function naturalBlackjack(i) {
  players[i].blackjack = true;
  players[i].sum = 21;
  // players[i].cards = [];
  // Multiply player bet by 1.5 (this is the 3:2 ratio)
  players[i].balance = players[i].balance + (1.5 * players[i].bet + players[i].bet)
  // players[i].bet = 0;
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

        sendPlayerNext();
        // updatePlayers()


      } else if(this === userAction[1] && clicked === false) {
        clicked = true;
        doubleDown = false;
              
        playerHit() 
        // updatePlayers();

      } else if(this === userAction[2] && player.balance >= player.bet && clicked === false) {
        clicked = true;
        doubleDown = true;

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
    compareSumAce(); // <--- compare sum if an ACE is included in the hit
  }

  if(player.hasAce === false && deck[0].value.hasAce === undefined) {
    compareSum(); // <--- compare sum if ACE is not included in the hit 
  }



}

function sendPlayerNext() {

  // if player sum.length === 2. Fix players sum before going to next player
  if(player.sum.length === 2 && player.sum[1] <= 21) {
    player.sum.shift()
    player.sum = player.sum[0]
  } else if(player.sum.length === 2 && player.sum[1] > 21) {
    player.sum.pop()
    player.sum = player.sum[0]
  }


  if(dealersTurn === false) nextPlayer();
  
  if(currentPlayer+1 > players.length) {
    setTimeout(dealerPlay, 500)
  } else {
    sendPlayerThePlay();
  }
  updatePlayers()
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
  //   finalCompareGo();
  // } 
  //   playerHit()
  // } else {
  //   finalCompareGo()
  // }
}
// If dealer.sum is less than 17, he must keep hitting until he gets 17
// function dealerSum() {
  // if(dealer.sum < 17) {
  //   playerHit()
  // } else {
  //   finalCompareGo()
  // }
// }

// *************************************************************

// ***********************FINAL COMPARE*************************

function finalCompareGo() { // This should fire up for all players
  playerResult();
  // if dealer sum.length === 2. Fix dealer sum before proceeding (I know this block of code is repetetive, will fix later)
  if(dealer.sum.length === 2 && dealer.sum[1] <= 21) {
    dealer.sum.shift()
    dealer.sum = dealer.sum[0]
  } else if(dealer.sum.length === 2 && dealer.sum[1] > 21) {
    dealer.sum.pop()
    dealer.sum = dealer.sum[0]
  }

  $("#player-result-big").removeClass("hide-element")
  if(theClient.sum > 21) {
    $("#player-result-big-answer").text("YOU BUSTED")
    $("#player-result-big-sum").text(theClient.bet)
    $("#player-result-big-plus-minus").text("-")
    $("#player-result-sum-box").addClass("color-red")
  } else if(theClient.blackjack === true) {
      $("#player-result-big-answer").text("BLACKJACK")
      $("#player-result-big-sum").text(1.5 * theClient.bet + theClient.bet)
      $("#player-result-big-plus-minus").text("+")
      $("#player-result-sum-box").addClass("color-green")
    } else if(dealer.sum > 21) {
        $("#player-result-big-answer").text("YOU WIN")
        $("#player-result-big-sum").text(theClient.bet*2)
        $("#player-result-big-plus-minus").text("+")
        $("#player-result-sum-box").addClass("color-green")
      } else if(dealer.sum < theClient.sum) {
          $("#player-result-big-answer").text("YOU WIN")
          $("#player-result-big-sum").text(theClient.bet*2)
          $("#player-result-big-plus-minus").text("+")
          $("#player-result-sum-box").addClass("color-green")
        } else if(dealer.sum === theClient.sum) {
            $("#player-result-big-answer").text("DRAW")
            // $("#player-result-big-sum").text(theClient.bet)
            // $("#player-result-big-plus-minus").text("+")
          } else {
              $("#player-result-big-answer").text("DEALER WINS")
              $("#player-result-big-sum").text(theClient.bet)
              $("#player-result-big-plus-minus").text("-")
              $("#player-result-sum-box").addClass("color-red")
          }

  // Function for RESET GAME
  setTimeout(function() {
    resetRound();
  }, 4000);
}

function playerWin(i) {
  // The blackjack payout has already been dealt. (in naturalBlackjack(i))
  if(players[i].blackjack === false) players[i].balance = players[i].balance + (players[i].bet * 2);
  players[i].bet = 0;
}

function playerDraw(i) {
  if(players[i].blackjack === false) players[i].balance = players[i].balance + players[i].bet;  
  players[i].bet = 0;
}

function dealerWin(i) {
  players[i].bet = 0;
}

function resetGame() {
  // Reset Players
  for(let i = 0; i < players.length; i++) {
    players[i].cards = [];
    players[i].hasAce = false;
    players[i].sum = null;
    players[i].isReady = false;
    players[i].blackjack = false;
    players[i].bet = 0;
  }
  // Reset Dealer
  dealer.cards = [];
  dealer.hasAce = false;
  dealer.sum = null;
  // Reset Deck
  deck = [];
  // getDeck()

  // IF DEALER IS IN THE PLAYERS ARRAY, REMOVE HIM


  // Utilities
  currentPlayer = 0;
  playersReady = 0;
  resetCards = true;
  dealersTurn = false;
  startedGame = false;
  doubleDown = false;
  gameOn = false;
  $("#total-bet").text("")
  $("#player-result-big").addClass("hide-element")
  $("#player-result-sum-box").removeClass("color-green color-red")
  $("#player-result-big-answer").text("")
  $("#player-result-big-sum").text("")
  $("#player-result-big-plus-minus").text("")

  $(".players .player-bet").css("background", "")
  $(".players .player-bet").css("opacity", "")
  $("#bets-container").removeClass("noclick");

  $(".player-result").addClass("hide-element")
  $(".player-result").removeClass("result-lose result-draw result-win result-blackjack")
  $(".player-sum").css({"opacity": "", "transform": ""});
  $("#dealerSum").css({"opacity": "", "transform": ""});

  // Send to all players
  // updatePlayerCards();
  if(resetCards === true) {
    for(let s = 0; s < playerSlot.length; s++) {
      playerSlot[s].lastElementChild.innerHTML = ""
    }
    dealerSlot.lastElementChild.lastElementChild.innerHTML = "";
    resetCards = false;
  }
  console.log(players)
  console.log(players)
  console.log(players)
  updateCurrentPlayer();  
  updatePlayers();

  

}

// *************************************************************


// ******************PLAYER ACTION ANSWERS**********************

// function blackjack() {
//   nextPlayer()


// }

function bust() {
  player.cards = [];
  // player.bet = 0;
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
  console.log(player)
  console.log(player)
  console.log(player)

  if(!player.hasAce && !deck[0].value.hasAce) {
    player.sum = player.sum + deck[0].value.value // add sum
    player.hasAce = false;
    givePlayerCard() // give player card
    // if(dealer.cards[1] === dealer.cards[2]) dealer.cards.splice(1, 1)


    if(dealersTurn === true) {
      console.log(player)
      console.log(player)
      console.log(player)
      setTimeout(outputCardSumDealer, 1000) // compare & output sum for dealer
    } else {
      console.log(player)
      console.log(player)
      console.log(player)
      setTimeout(outputCardSum, 500) // compare & output sum
    }
    
  }  
}

// container for the 3 ace filters
function compareSumAce() {
  playerAceDeckAce() // <--- Check if player has a ACE && next card has ACE
  // playerNoAceDeckAce() // <--- Check if player has NOT ACE && next card has ACE
  // playerAceDeckNoAce() // <--- Check if Player has ACE && next card has NO ACE
  
  if(dealersTurn === true) {
    console.log(player)
    console.log(player)
    console.log(player)
    setTimeout(outputCardSumAceDealer, 1000) // compare & output sum for dealer
  } else {
    console.log(player)
    console.log(player)
    console.log(player)
    setTimeout(outputCardSumAce, 500) // compare & output sum
  }
  
}

// *************************************************************

// ******************PLAYER ACTION OUTPUTS**********************

// compare && output sum for no aces
function outputCardSum() {
  console.log(player.sum)
  player.hasAce = false;
  if(dealersTurn === false) {
    if(player.sum === 21) {
      sendPlayerNext() 
    } else if(player.sum < 21 && doubleDown === false) {
      sendPlayerThePlay();
    } else if(player.sum < 21 && doubleDown === true) {
      sendPlayerNext();
    } else if(player.sum > 21) {
      bust();
    }
  }
}

// compare && output sum for no aces
function outputCardSumAce() {
  console.log(player.sum)
  // Check if the higher value is over 21
  if(player.sum[1] > 21) {
    // Remove the high value from the sum & remove array from sum
    player.sum.pop()
    player.sum = player.sum[0]
    player.hasAce = false;
    // Take the current value and do the following...
    if(dealersTurn === false) {
      if(player.sum === 21) {
        sendPlayerNext() 
      } else if(player.sum < 21 && doubleDown === false) {
        sendPlayerThePlay();
      } else {
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

        sendPlayerNext();
      } 
      if(player.sum[1] < 21 && doubleDown === false) {
        sendPlayerThePlay();
      } else {
        sendPlayerNext();
      }
    }
  }
}


function outputCardSumAceDealer() {
  if(player.sum[1] > 21) {

    player.sum.pop();
    player.sum = player.sum[0];
    player.hasAce = false;

    console.log("---------")
    console.log(dealer.sum)
    console.log(player.sum)

    if(dealersTurn === true) {
      if(player.sum < 17) {
        playerHit()
      } else {
        console.log("FINAL COMPARE")
        finalCompare();
      }
    }
  } else {
    player.hasAce = true;

    if(dealersTurn === true) {
      if(player.sum[1] < 17) {
        playerHit()
      } else {
        console.log("FINAL COMPARE")
        finalCompare();
      }
    }
  }
}

function outputCardSumDealer() {
  player.hasAce = false;
  if(dealersTurn === true) {
    if(player.sum < 17) {
      playerHit()
    } else {
      console.log("FINAL COMPARE")
      finalCompare();
  }
}
}

// *************************************************************


// *******************UTILITIES************************

function givePlayerCard() {

    
    player.cards.push(deck[0])
    deck.shift()

    if(dealersTurn === true) {
     console.log("updateDealerCards") 
      updateDealerCards()
    }
    
    if(dealersTurn === false) updatePlayerCards();

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


// MULTIPLAYER WIRING EVENTS




// ########## DOM MANIPULATION ##########
// Note: this section uses jQuery
// When a player joins with invite link, He can click the button "Join Room"
if(window.location.href.length > 22) {
  $("#btnCreate").addClass("hide-element")
  $("#btnJoin").removeClass("hide-element")
}

$("#about").click(function() {
  bool = !bool;
  if(bool === true) {
    $("#about-box").css("top", "504px")
  } else {
    $("#about-box").css("top", "")
  }
})

$("#how-to-play").click(function() {
  bool = !bool;
  if(bool === true) {
    $("#info-rules").css("right", "14px")
  } else {
    $("#info-rules").css("right", "")
  }
})

// $("#total-bet")

$(".update-balance-bet").click(function() {
  $("#total-bet").text(theClient.bet)
  $("#balance").text(theClient.balance)
  if(theClient.bet > 0) {
    for(let i = 0; i < playerSlotHTML.length; i++) {
      if(playerSlotHTML[i] === theClient.clientId) {
        $(".ready:eq("+i+")").removeClass("hide-element")
      }
    }
  } else if(theClient.bet === 0) {
    $(".ready").addClass("hide-element")
  }
})







// ########## DOM MANIPULATION ##########

