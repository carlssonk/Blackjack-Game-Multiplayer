# Blackjack-Game-Multiplayer

![Game Screenshot](https://i.ibb.co/S3vjPCX/blackjack-background.jpg)

## Description
[Blackjack-Game-Multiplayer](https://blackjack-multiplayer.herokuapp.com) is a free online multiplayer casino game. It's an online version of the traditional blackjack played at real casinos. You can choose to play alone or play in a private room with your friends. The goal of the game is to beat the dealer and win as much money as possible.

## Installation
If you want to download and use this project locally:
1. First clone the project to your prefered text editor
2. Go to your terminal and install all the modules with **npm install**
3. When all the modules have been installed, start the server by typing **node index.js** in the terminal
4. Open Google and type in **localhost:3000**

## Technologies
* JavaScript
* SCSS
* Node.js
* Express
* WebSocket

## How To Play

### Object Of The Game

Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going above 21.

### Card Values/Scoring

Usually it's up to each individual player if an ace is worth 1 or 11. However in this game if a player stands with an ace, it will always count the ace as 11 if your total sum doesn't exceed 21. Face cards are 10 and any other card is its original value.

### Betting

Before the dealer begins dealing out cards, each player must place a bet.

### The Deal

The round starts with the dealer giving out 2 cards to each player. He also gives himself one card facing up & one card facing down.

### Naturals

If a player gets a count to 21 on the first 2 cards, the player gets Blackjack. Blakjack pays out 3:2 directly to the player and he will wait until next round to play again.

### The Play

Now its time for the first player to make his move. The player can Hit, Stand, Or Double Down.

Hit = Ask for another card in attempt to get closer to 21.
Stand = Don't ask for any cards, moves on to the next player
Double Down = Double the bet and ask for another card. (You can only double down once per round & can't draw any more cards after double'd down).

### The Dealer's Play

Dealer starts with flipping his card facing down. Dealer will draw until he reaches 17, when dealer's sum is 17 or above, he stops taking cards.

### Payout

If the player busts, he will lose his bet, even if the dealer also busts.
If player has higher value cards than the dealer, the player wins.
If dealer has higher value cards than the player, the dealer wins.

