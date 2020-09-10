"use strict";

// Blackjack Game
// #############################
// const { response } = require("express");
// HTML
var play = document.querySelector("#play");
var betButtons = document.querySelectorAll(".betButtons");
var ready = document.querySelector(".ready");
var standBtn = document.querySelector("#stand");
var hitBtn = document.querySelector("#hit");
var doubleDownBtn = document.querySelector("#doubleDown");
var userAction = document.querySelectorAll(".user-action");
var countAce = document.querySelectorAll(".countAce");
playerSlot = document.querySelectorAll(".players");
dealerSlot = document.querySelector("#dealer");
playerCards = document.querySelectorAll(".player-cards");
dealerCards = document.querySelectorAll(".dealer-cards"); // Basic utilities to navigate through the game

var startedGame = false;
var currentPlayer = 0;
var playersReady = 0;
var sum = null;
var dealersTurn = false;
var gameOn = false;
var bool;
var showSum = false;
var chipIndex = null; // resetCards = false;
// Cards (suit)

var suit = ["Heart", "Diamond", "Spade", "Club"]; // Cards (values)

var values = [{
  "card": "A",
  "value": [1, 11],
  "hasAce": true
}, {
  "card": "2",
  "value": 2
}, {
  "card": "3",
  "value": 3
}, {
  "card": "4",
  "value": 4
}, {
  "card": "5",
  "value": 5
}, {
  "card": "6",
  "value": 6
}, {
  "card": "7",
  "value": 7
}, {
  "card": "8",
  "value": 8
}, {
  "card": "9",
  "value": 9
}, {
  "card": "10",
  "value": 10
}, {
  "card": "J",
  "value": 10
}, {
  "card": "Q",
  "value": 10
}, {
  "card": "K",
  "value": 10
}];
var deckImg = ["Heart2", "Heart3", "Heart4", "Heart5", "Heart6", "Heart7", "Heart8", "Heart9", "Heart10", "HeartJ", "HeartQ", "HeartK", "HeartA", "Diamond2", "Diamond3", "Diamond4", "Diamond5", "Diamond6", "Diamond7", "Diamond8", "Diamond9", "Diamond10", "DiamondJ", "DiamondQ", "DiamondK", "DiamondA", "Spade2", "Spade3", "Spade4", "Spade5", "Spade6", "Spade7", "Spade8", "Spade9", "Spade10", "SpadeJ", "SpadeQ", "SpadeK", "SpadeA", "Club2", "Club3", "Club4", "Club5", "Club6", "Club7", "Club8", "Club9", "Club10", "ClubJ", "ClubQ", "ClubK", "ClubA"];
var chipImg = ["White", "Red", "Blue", "Green", "Gray", "Orange", "Purple", "Brown", "Black"]; // Actual deck (suit & values combined)

var deck = []; // theDeal is false when the deal is done

var theDeal = false; // thePlay is true when the deal is done

var ThePlay = false; // let player = null;
// let currentPlayer =
// Dealer

var dealer = {
  "cards": [],
  "hiddenCard": [],
  "sum": null,
  "hasAce": false
}; // Players

var players = [];
var spectators = []; // NOTE: player means current player

var player = players[currentPlayer]; // SORTING FUNCTION FOR SORTING PLAYER TABLE SLOT (SO DEALER DEALS CARD FROM RIGHT TO LEFT)

function mapOrder(array, order, key) {
  array.sort(function (a, b) {
    var A = a[key],
        B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });
  return array.reverse();
}

; // INIT

Init();

function Init() {
  playerBets(); // placeBet() // = player Ready
} // Get deck


function getDeck() {
  // Loop through suite AND values
  for (var s = 0; s < suit.length; s++) {
    for (var v = 0; v < values.length; v++) {
      var _card = {
        suit: suit[s],
        value: values[v]
      };
      deck.push(_card);
    }
  }

  shuffle(deck);
} // Shuffle Deck


function shuffle(deck) {
  // Shuffle by 2 random locations 1000 times
  for (var i = 0; i < 1000; i++) {
    var location1 = Math.floor(Math.random() * deck.length);
    var location2 = Math.floor(Math.random() * deck.length);
    var tmp = deck[location1];
    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
} // Easy accessing of deck


var card = deck.map(function (obj) {
  return obj.value.card;
});
var value = deck.map(function (obj) {
  return obj.value.value;
}); // Play Game

play.addEventListener("click", function () {
  startedGame = true;
}); // Place Bets

function playerBets() {
  var _loop = function _loop(b) {
    var betAmount = parseInt(betButtons[b].value);
    betButtons[b].addEventListener("click", function () {
      if (betAmount <= theClient.balance) {
        // Add to bet & remove from balance
        theClient.bet = theClient.bet + betAmount;
        theClient.balance = theClient.balance - betAmount;
      } else {
        alert("Need more balance");
      }

      console.log("sendPlayerBets");
    });
  };

  for (var b = 0; b < betButtons.length; b++) {
    _loop(b);
  }
}

$(document).on("click", ".ready", function () {
  sendPlayerBets();
  $(".ready").addClass("hide-element");
  player = players[currentPlayer];
  updateCurrentPlayer();
  theClient.isReady = true;
  clientIsReady(); // Check if all players is ready

  if (players.every(function (player) {
    return player.isReady;
  })) {
    gameOn = true;
    getDeck();
    sendPlayerDeck();
    setTimeout(dealCards, 1000);
  }
}); // ***************INITIALIZE ROUND / ROUND START*******************

function dealCards() {
  // Set current player
  player = players[currentPlayer];
  updateCurrentPlayer(); // Give each player 1 card

  var _loop2 = function _loop2(i) {
    setTimeout(function () {
      console.log(deck[0]);
      player.cards.push(deck[0]);
      deck.shift();
      updatePlayerCards();
      nextPlayerInitial(); // Deal dealer cards when all players have 1 card

      if (i + 1 === players.length) dealDealerCards();
    }, i * 500);
  };

  for (var i = 0; i < players.length; i++) {
    _loop2(i);
  }
}

function dealDealerCards() {
  setTimeout(function () {
    console.log(deck[0]);

    if (dealer.cards.length === 1) {
      // If dealer has 1 card, push next card to hidden card
      dealer.hiddenCard.push(deck[0]);
      deck.shift();
      updateDealerCards();
      updatePlayers(); // Check if natural and Enable the First player to take an action

      setTimeout(function () {
        naturals();
        console.log("SEND THE PLAY");
        sendPlayerThePlay();
        sendShowSum();
      }, 500);
    } else {
      // If deal has NOT 1 card, push to default card array
      dealer.cards.push(deck[0]);
      deck.shift();
      updateDealerCards();
      updatePlayers(); // Deal cards again

      setTimeout(function () {
        dealCards();
      }, 500);
    }
  }, 500);
} // Naturals


function naturals() {
  for (var i = 0; i < players.length; i++) {
    // Below is all the scenarios (combinations) the player can get on the first 2 cards
    if (Array.isArray(players[i].cards[0].value.value) || Array.isArray(players[i].cards[1].value.value)) {
      // Checks if player has a card with an ACE (the ace is an array)
      if (players[i].cards[0].value.value === 10 || players[i].cards[1].value.value === 10) {
        // Checks if player has a TEN
        console.log("A ten & and ace");
        naturalBlackjack(i);
        players[i].hasAce = true; // Send player index to webSocket

        for (var x = 0; x < playerSlotHTML.length; x++) {
          if (players[i].clientId === playerSlotHTML[x]) {
            playerNaturalIndex = x;
            playerResultNatural();
          }
        }
      } else if (players[i].cards[0].value.card === "A" && players[i].cards[1].value.card === "A") {
        // Checks if player has TWO aces
        console.log("TWO aces");
        naturalBlackjack(i);
        players[i].hasAce = true; // Send player index to webSocket

        for (var _x = 0; _x < playerSlotHTML.length; _x++) {
          if (players[i].clientId === playerSlotHTML[_x]) {
            playerNaturalIndex = _x;
            playerResultNatural();
          }
        }
      } else {
        // Checks all cards except for ACE and TEN
        console.log("an ace with a defualt card");
        naturalPlayerAceSum(i);
        players[i].hasAce = true;
      }
    } else {
      // All cards except for ACE
      console.log("defualt cards");
      players[i].sum = players[i].cards[0].value.value + players[i].cards[1].value.value;
    }
  } // Initialize dealers values


  dealer.sum = dealer.cards[0].value.value;
  if (dealer.cards[0].value.card === "A") dealer.hasAce = true;
  updatePlayers();
  showSum = true;
}

function naturalBlackjack(i) {
  players[i].blackjack = true;
  players[i].sum = 21; // players[i].cards = [];
  // Multiply player bet by 1.5 (this is the 3:2 ratio)

  players[i].balance = players[i].balance + (1.5 * players[i].bet + players[i].bet); // players[i].bet = 0;
}

function naturalPlayerAceSum(i) {
  // This adds .sum[0] to always be the lowest and .sum[1] to always be the highest
  if (players[i].cards[0].value.card === "A") {
    players[i].sum = [players[i].cards[1].value.value + 1, players[i].cards[1].value.value + 11];
  } else {
    players[i].sum = [players[i].cards[0].value.value + 1, players[i].cards[0].value.value + 11];
  }
} // ****************************************************************
// *******************PLAYER MAKES HIS MOVE*********************


function thePlay() {
  $(".user-action-container").removeClass("hide-element"); // Alert current player
  // player.alert.....

  for (var i = 0; i < userAction.length; i++) {
    userAction[i].addEventListener("click", function () {
      if (this === userAction[0] && clicked === false) {
        clicked = true;
        doubleDown = false;
        $(".user-action-container").addClass("hide-element");
        $(".user-action-box").last().addClass("noclick");
        sendPlayerNext(); // updatePlayers()
      } else if (this === userAction[1] && clicked === false) {
        clicked = true;
        doubleDown = false;
        $(".user-action-container").addClass("hide-element");
        $(".user-action-box").last().addClass("noclick");
        playerHit(); // updatePlayers();
      } else if (this === userAction[2] && theClient.balance >= theClient.bet && clicked === false) {
        clicked = true;
        doubleDown = true;
        $(".user-action-container").addClass("hide-element");
        playerDoubleDown(); // updatePlayers();
      }
    }, {
      once: true
    });
  }
} // *************************************************************
// **********************PLAYER ACTIONS*************************


function playerHit() {
  if (player.hasAce === true || deck[0].value.hasAce === true) {
    compareSumAce(); // <--- compare sum if an ACE is included in the hit
  }

  if (player.hasAce === false && deck[0].value.hasAce === undefined) {
    compareSum(); // <--- compare sum if ACE is not included in the hit 
  }
}

function sendPlayerNext() {
  console.log("player next");
  $(".user-action-box").removeClass("noclick"); // if player sum.length === 2. Fix players sum before going to next player

  if (player.sum.length === 2 && player.sum[1] <= 21) {
    player.sum.shift();
    player.sum = player.sum[0];
  } else if (player.sum.length === 2 && player.sum[1] > 21) {
    player.sum.pop();
    player.sum = player.sum[0];
  }

  if (dealersTurn === false) nextPlayer();

  if (currentPlayer + 1 > players.length) {
    // PUSH DEALER TO PLAYER ARRAY
    // players.push(dealer);
    dealersTurn = true;
    sendDealersTurn();
    setTimeout(dealerPlay, 500);
  } else {
    console.log("SEND THE PLAY");
    sendPlayerThePlay();
  }

  updatePlayers();
}

function playerDoubleDown() {
  player.balance = player.balance - player.bet;
  player.bet = player.bet * 2;
  $("#total-bet").text(theClient.bet);
  playerHit();
} // *************************************************************
// *************************DEALER PLAY*************************


function dealerPlay() {
  console.log("DealerPlay");
  console.log("DealerPlay");
  console.log("DealerPlay"); // sendDealersTurn();
  // // PUSH DEALER TO PLAYER ARRAY

  players.push(dealer); //PUSH DEALERS HIDDEN CARD TO DECK[0]

  deck.unshift(dealer.hiddenCard[0]); // Push dealers hidden card to deck[0] REMOVE
  // dealer.cards.push(dealer.hiddenCard[0]); REMOVE

  dealer.hiddenCard = [];
  player = players[currentPlayer];
  updateCurrentPlayer();

  if (player.hasAce === true || deck[0].value.hasAce === true) {
    compareSumAce();
  } else {
    compareSum();
  } // deck.shift()
  // if(dealer.sum > 16 || dealer.sum[1] > 16) {
  //   finalCompareGo();
  // } 
  //   playerHit()
  // } else {
  //   finalCompareGo()
  // }

} // If dealer.sum is less than 17, he must keep hitting until he gets 17
// function dealerSum() {
// if(dealer.sum < 17) {
//   playerHit()
// } else {
//   finalCompareGo()
// }
// }
// *************************************************************
// ***********************FINAL COMPARE*************************


function finalCompareGo() {
  // This should fire up for all players
  // if dealer sum.length === 2. Fix dealer sum before proceeding (I know this block of code is repetetive, will fix later)
  if (dealer.sum.length === 2 && dealer.sum[1] <= 21) {
    dealer.sum.shift();
    dealer.sum = dealer.sum[0];
  } else if (dealer.sum.length === 2 && dealer.sum[1] > 21) {
    dealer.sum.pop();
    dealer.sum = dealer.sum[0];
  }

  if (players.some(function (e) {
    return e.clientId === clientId;
  })) $("#player-result-big").removeClass("hide-element");

  if (theClient.sum > 21) {
    $("#player-result-big-answer").text("YOU BUSTED");
    $("#player-result-big-sum").text(theClient.bet);
    $("#player-result-big-plus-minus").text("-");
    $("#player-result-sum-box").addClass("color-red");
  } else if (theClient.blackjack === true) {
    $("#player-result-big-answer").text("BLACKJACK");
    $("#player-result-big-sum").text(1.5 * theClient.bet + theClient.bet);
    $("#player-result-big-plus-minus").text("+");
    $("#player-result-sum-box").addClass("color-green");
  } else if (dealer.sum > 21) {
    $("#player-result-big-answer").text("YOU WIN");
    $("#player-result-big-sum").text(theClient.bet * 2);
    $("#player-result-big-plus-minus").text("+");
    $("#player-result-sum-box").addClass("color-green");
  } else if (dealer.sum < theClient.sum) {
    $("#player-result-big-answer").text("YOU WIN");
    $("#player-result-big-sum").text(theClient.bet * 2);
    $("#player-result-big-plus-minus").text("+");
    $("#player-result-sum-box").addClass("color-green");
  } else if (dealer.sum === theClient.sum) {
    $("#player-result-big-answer").text("DRAW"); // $("#player-result-big-sum").text(theClient.bet)
    // $("#player-result-big-plus-minus").text("+")
  } else {
    $("#player-result-big-answer").text("DEALER WINS");
    $("#player-result-big-sum").text(theClient.bet);
    $("#player-result-big-plus-minus").text("-");
    $("#player-result-sum-box").addClass("color-red");
  } // Function for display win/lose/draw/bj coins as well as payout


  winLoseComponents(); // Function for RESET GAME
  // setTimeout(function() {
  // resetGame();
  // }, 4000);
}

function winLoseComponents() {
  // if dealer sum.length === 2. Fix dealer sum before proceeding
  // if(dealer.sum.length === 2 && dealer.sum[1] <= 21) {
  //   dealer.sum.shift()
  //   dealer.sum = dealer.sum[0]
  // } else if(dealer.sum.length === 2 && dealer.sum[1] > 21) {
  //   dealer.sum.pop()
  //   dealer.sum = dealer.sum[0]
  // }
  dealerSlot.firstElementChild.nextElementSibling.innerHTML = dealer.sum; // // remove dealer from player
  // players.splice(-1)[0]
  // sendPlayerBets() // <--- this only updates players array
  // For all players That have NOT busted, compare sum to dealer

  for (var i = 0; i < players.length; i++) {
    // exclude all players that already have blackjack
    if (players[i].blackjack === false) {
      if (players[i].cards.length > 0) {
        // Also check if dealer has bust
        if (dealer.sum > 21) {
          playerWin(i);
          console.log("DEALER BUST");

          for (var x = 0; x < playerSlotHTML.length; x++) {
            if (players[i].clientId === playerSlotHTML[x]) {
              $(".player-result:eq(" + x + ")").removeClass("hide-element");
              $(".player-result:eq(" + x + ")").addClass("result-win");
              $(".player-result:eq(" + x + ")").text("WIN");
            }
          }
        } else if (dealer.sum < players[i].sum) {
          playerWin(i);
          console.log("player win");

          for (var _x2 = 0; _x2 < playerSlotHTML.length; _x2++) {
            if (players[i].clientId === playerSlotHTML[_x2]) {
              $(".player-result:eq(" + _x2 + ")").removeClass("hide-element");
              $(".player-result:eq(" + _x2 + ")").addClass("result-win");
              $(".player-result:eq(" + _x2 + ")").text("WIN");
            }
          }
        } else if (dealer.sum === players[i].sum) {
          playerDraw(i);
          console.log("Draw!");

          for (var _x3 = 0; _x3 < playerSlotHTML.length; _x3++) {
            if (players[i].clientId === playerSlotHTML[_x3]) {
              $(".player-result:eq(" + _x3 + ")").removeClass("hide-element");
              $(".player-result:eq(" + _x3 + ")").addClass("result-draw");
              $(".player-result:eq(" + _x3 + ")").text("DRAW");
            }
          }
        } else {
          dealerWin(i);

          for (var _x4 = 0; _x4 < playerSlotHTML.length; _x4++) {
            if (players[i].clientId === playerSlotHTML[_x4]) {
              $(".player-result:eq(" + _x4 + ")").removeClass("hide-element");
              $(".player-result:eq(" + _x4 + ")").addClass("result-lose");
              $(".player-result:eq(" + _x4 + ")").text("LOSE");
            }
          }
        } // If player busted, make him Bust!

      } else {
        dealerWin(i);
      } // If player has blackjack, make him win!

    } else {
      playerWin(i);
    }
  }
}

function playerWin(i) {
  // The blackjack payout has already been dealt. (in naturalBlackjack(i))
  if (players[i].blackjack === false) players[i].balance = players[i].balance + players[i].bet * 2;
  players[i].bet = 0;
}

function playerDraw(i) {
  if (players[i].blackjack === false) players[i].balance = players[i].balance + players[i].bet;
  players[i].bet = 0;
}

function dealerWin(i) {
  players[i].bet = 0;
}

function resetGame() {
  // Reset Players 
  $(".player-bet").text(""); // $(".player-coin").text("")

  for (var i = 0; i < players.length; i++) {
    players[i].cards = [];
    players[i].hasAce = false;
    players[i].sum = null;
    players[i].isReady = false;
    players[i].blackjack = false;
    players[i].bet = 0;
  } // Reset Dealer


  dealer.cards = [];
  dealer.hasAce = false;
  dealer.sum = null; // Reset Deck

  deck = []; // getDeck()

  $("#dealerSum").removeClass("current-player-highlight");
  $(".dealer-cards").html("<div class=\"visibleCards\"></div>"); // IF DEALER IS IN THE PLAYERS ARRAY, REMOVE HIM

  if (players.some(function (e) {
    return e.hiddenCard;
  })) players.splice(players.findIndex(function (e) {
    return e.hiddenCard;
  }), 1); // Utilities

  currentPlayer = 0;
  playersReady = 0;
  resetCards = true;
  dealersTurn = false;
  startedGame = false;
  doubleDown = false;
  gameOn = false;
  $(".user-action-box").removeClass("noclick");
  $("#total-bet").text("");
  $("#player-result-big").addClass("hide-element");
  $("#player-result-sum-box").removeClass("color-green color-red");
  $("#player-result-big-answer").text("");
  $("#player-result-big-sum").text("");
  $("#player-result-big-plus-minus").text("");
  $(".players .player-coin").css("background", "");
  $(".players .player-coin").css("opacity", "");

  for (var _i = 0; _i < players.length; _i++) {
    if (players[_i].clientId === clientId) {
      $("#bets-container").removeClass("noclick");
    }
  }

  if (!players.some(function (e) {
    return e.clientId === clientId;
  })) $(".empty-slot").removeClass("noclick");
  $(".player-result").addClass("hide-element");
  $(".player-result").removeClass("result-lose result-draw result-win result-blackjack");
  $(".player-sum").css({
    "opacity": "",
    "transform": ""
  });
  $("#dealerSum").css({
    "opacity": "",
    "transform": ""
  }); // Send to all players

  if (resetCards === true) {
    for (var s = 0; s < playerSlot.length; s++) {
      playerSlot[s].lastElementChild.innerHTML = "";
    }

    dealerSlot.lastElementChild.lastElementChild.innerHTML = "";
    resetCards = false;
  } // updateCurrentPlayer();
  // updatePlayers();


  console.log("resetGameState1");
} // *************************************************************
// ******************PLAYER ACTION ANSWERS**********************


function bust() {
  player.cards = []; // player.bet = 0;
  // updatePlayerCards()
  // updatePlayers();

  sendPlayerNext();
}

function finalResult() {} // *************************************************************
// ****************PLAYER CARDS FILTER SYSTEM*******************
// If player has Ace && deck[0] has Ace


function playerAceDeckAce() {
  if (player.hasAce && deck[0].value.hasAce) {
    player.sum[0] = player.sum[0] + 1; // add sum

    player.sum[1] = player.sum[1] + 1; // add sum

    player.hasAce = true;
    givePlayerCard(); // give player card
    // outputCardSumAce() // compare sum
  } else if (!player.hasAce && deck[0].value.hasAce) {
    player.sum = [player.sum + 1, player.sum + 11]; // add sum

    player.hasAce = true;
    givePlayerCard(); // give player card
    // outputCardSumAce() // compare & output sum
  } else if (player.hasAce && !deck[0].value.hasAce) {
    player.sum[0] = player.sum[0] + deck[0].value.value; // add sum

    player.sum[1] = player.sum[1] + deck[0].value.value; // add sum

    player.hasAce = true;
    givePlayerCard(); // give player card
    // outputCardSumAce() // compare & output sum
  }
} // // If player has Ace No && deck[0] has Ace
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
  if (!player.hasAce && !deck[0].value.hasAce) {
    player.sum = player.sum + deck[0].value.value; // add sum

    player.hasAce = false;
    givePlayerCard(); // give player card
    // if(dealer.cards[1] === dealer.cards[2]) dealer.cards.splice(1, 1)

    if (dealersTurn === true) {
      setTimeout(outputCardSumDealer, 1000); // compare & output sum for dealer
    } else {
      setTimeout(outputCardSum, 500); // compare & output sum
    }
  }
} // container for the 3 ace filters


function compareSumAce() {
  playerAceDeckAce(); // <--- Check if player has a ACE && next card has ACE
  // playerNoAceDeckAce() // <--- Check if player has NOT ACE && next card has ACE
  // playerAceDeckNoAce() // <--- Check if Player has ACE && next card has NO ACE

  if (dealersTurn === true) {
    setTimeout(outputCardSumAceDealer, 1000); // compare & output sum for dealer
  } else {
    setTimeout(outputCardSumAce, 500); // compare & output sum
  }
} // *************************************************************
// ******************PLAYER ACTION OUTPUTS**********************
// compare && output sum for no aces


function outputCardSum() {
  player.hasAce = false;

  if (dealersTurn === false) {
    if (player.sum === 21) {
      sendPlayerNext();
    } else if (player.sum < 21 && doubleDown === false) {
      console.log("SEND THE PLAY");
      sendPlayerThePlay();
    } else if (player.sum < 21 && doubleDown === true) {
      sendPlayerNext();
    } else if (player.sum > 21) {
      bust();
    }
  }
} // compare && output sum for no aces


function outputCardSumAce() {
  // Check if the higher value is over 21
  if (player.sum[1] > 21) {
    // Remove the high value from the sum & remove array from sum
    player.sum.pop();
    player.sum = player.sum[0];
    player.hasAce = false; // Take the current value and do the following...

    if (dealersTurn === false) {
      if (player.sum === 21) {
        sendPlayerNext();
      } else if (player.sum < 21 && doubleDown === false) {
        console.log("SEND THE PLAY");
        sendPlayerThePlay();
      } else {
        sendPlayerNext();
      }
    }
  } else {
    player.hasAce = true; // If higher value not over 21, do the following...

    if (dealersTurn === false) {
      if (player.sum[1] === 21) {
        player.sum.shift();
        player.sum = player.sum[0];
        sendPlayerNext();
      }

      if (player.sum[1] < 21 && doubleDown === false) {
        console.log("SEND THE PLAY");
        sendPlayerThePlay();
      } else {
        sendPlayerNext();
      }
    }
  }
}

function outputCardSumAceDealer() {
  if (player.sum[1] > 21) {
    player.sum.pop();
    player.sum = player.sum[0];
    player.hasAce = false;

    if (dealersTurn === true) {
      if (player.sum < 17) {
        playerHit();
      } else {
        console.log("FINAL COMPARE"); // Remove dealer from players array, then compare

        setTimeout(function () {
          resetGameState();
          console.log("SYNCTHEGAME2");
        }, 4050);
        players.splice(-1)[0];
        finalCompare();
      }
    }
  } else {
    player.hasAce = true;

    if (dealersTurn === true) {
      if (player.sum[1] < 17) {
        playerHit();
      } else {
        console.log("FINAL COMPARE"); // Remove dealer from players array, then compare

        setTimeout(function () {
          resetGameState();
          console.log("SYNCTHEGAME2");
        }, 4050);
        players.splice(-1)[0];
        finalCompare();
      }
    }
  }
}

function outputCardSumDealer() {
  player.hasAce = false;

  if (dealersTurn === true) {
    if (player.sum < 17) {
      playerHit();
    } else {
      console.log("FINAL COMPARE"); // Remove dealer from players array, then compare

      setTimeout(function () {
        resetGameState();
        console.log("SYNCTHEGAME2");
      }, 4050);
      players.splice(-1)[0];
      finalCompare();
    }
  }
} // *************************************************************
// *******************UTILITIES************************


function givePlayerCard() {
  player.cards.push(deck[0]);
  deck.shift();

  if (dealersTurn === true) {
    console.log("updateDealerCards");
    updateDealerCards();
  }

  if (dealersTurn === false) updatePlayerCards();
}

function nextPlayerInitial() {
  currentPlayer = (currentPlayer + 1) % players.length;
  player = players[currentPlayer];
}

function nextPlayer() {
  currentPlayer = currentPlayer + 1;
  player = players[currentPlayer]; // clicked = false;
  // if(currentPlayer+1 > players.length) dealerPlay();
} // currentPlayer = (currentPlayer+1)%(players.length); <--- cycle through players
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


if (window.location.href.length > 22) {
  $("#btnCreate").addClass("hide-element");
  $("#btnJoin").removeClass("hide-element");
}

$("#about").click(function () {
  bool = !bool;

  if (bool === true) {
    $("#about-box").css("top", "504px");
  } else {
    $("#about-box").css("top", "");
  }
});
$("#how-to-play").click(function () {
  bool = !bool;

  if (bool === true) {
    $("#info-rules").css("right", "14px");
  } else {
    $("#info-rules").css("right", "");
  }
}); // UPDATE CSS BET AND BALANCE

$(".update-balance-bet").click(function () {
  $("#total-bet").text(theClient.bet);
  $("#balance").text(theClient.balance);

  if (theClient.bet > 0) {
    for (var i = 0; i < playerSlotHTML.length; i++) {
      if (playerSlotHTML[i] === clientId) {
        $(".ready:eq(" + i + ")").removeClass("hide-element");
      }
    }
  } else if (theClient.bet === 0) {
    $(".ready").addClass("hide-element");
  }
}); // CLEAR AND MAX BOTH ACTUAL UPDATE AND CSS UPDATE

$(".max-clear").click(function () {
  console.log(this.innerText);

  for (var i = 0; i < playerSlotHTML.length; i++) {
    if (playerSlotHTML[i] === clientId) {
      if (this.innerText === "CLEAR") {
        $(".ready").addClass("hide-element");

        if (parseInt($(".players:eq(" + i + ") .player-bet").text()) > 1) {
          // 
          theClient.balance = theClient.balance + theClient.bet - parseInt($(".players:eq(" + i + ") .player-bet").text());
          theClient.bet = parseInt($(".players:eq(" + i + ") .player-bet").text());
          $("#total-bet").text(theClient.bet);
          $("#balance").text(theClient.balance); // 
        } else {
          // 
          theClient.balance = theClient.balance + theClient.bet;
          theClient.bet = 0;
          $("#total-bet").text(theClient.bet);
          $("#balance").text(theClient.balance); // 
        }
      } else if (this.innerText === "MAX") {
        theClient.bet = theClient.bet + theClient.balance;
        theClient.balance = 0;
        $("#total-bet").text(theClient.bet);
        $("#balance").text(theClient.balance);

        for (var _i2 = 0; _i2 < playerSlotHTML.length; _i2++) {
          if (playerSlotHTML[_i2] === clientId) {
            $(".ready:eq(" + _i2 + ")").removeClass("hide-element");
          }
        }
      }
    }
  }
}); // ########## DOM MANIPULATION ##########