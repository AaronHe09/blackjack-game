const $chipImageWrapper = document.querySelectorAll('.chip-image-wrapper');
const $money = document.querySelector('.money');
const $bet = document.querySelector('.bet');
const $dealButton = document.querySelector('.deal-button');
const $startingScreenContainer = document.querySelector('.starting-screen-container');
const $header = document.querySelector('header');
// game elements
const $gameContainer = document.querySelector('.game-container');
const $gameMoney = document.querySelector('.game-money');
const $gameBet = document.querySelector('.game-bet');
const $playersCard = document.querySelectorAll('.players-card');
const $dealersCard = document.querySelectorAll('.dealers-card');
const $dealersHandValue = document.querySelector('.dealers-hand-value');
const $playersHandValue = document.querySelector('.players-hand-value');
// api variable
const deck = new XMLHttpRequest();
const cards = new XMLHttpRequest();
let deckId = null;
// money variables
let money = 1000;
let bet = 0;
// players hand values
let playersHandValue = 0;
let dealersHandValue = 0;
// dealers hand
const dealersHand = [];

// fetching deck api
deck.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
deck.responseType = 'json';
deck.addEventListener('load', function () {
  deckId = deck.response.deck_id;
});
deck.send();

// drawing first 4 cardsfrom deck
function renderFourCards() {
  cards.open('GET', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
  cards.responseType = 'json';
  cards.addEventListener('load', function () {
    $playersCard[0].src = cards.response.cards[0].image;
    $playersCard[1].src = cards.response.cards[1].image;
    $dealersCard[1].src = cards.response.cards[3].image;
    dealersHand.push(cards.response.cards[2]);
    dealersHand.push(cards.response.cards[3]);

    // calculate total value of cards for player
    calculateHandValue(0, 2, playersHandValue, addToPlayersHandValue);
    $playersHandValue.textContent = playersHandValue;

    // calculate value of the second card for dealer
    calculateHandValue(3, 4, dealersHandValue, addToDealersHandValue);
    $dealersHandValue.textContent = dealersHandValue;
  });
  cards.send();
}

function calculateHandValue(int, lessthan, hand, callback) {
  for (let i = int; i < lessthan; i++) {
    const value = cards.response.cards[i].value;

    if (value === 'ACE') {
      if (hand + 11 <= 21) {
        callback(value, 11);
      } else {
        callback(value, 1);
      }
    } else if (parseInt(value) > 1 && parseInt(value) < 11) {
      callback(parseInt(value));
    } else if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
      callback(value, 10);
    }
  }
}

function addToPlayersHandValue(nul, value) {
  playersHandValue += value;
}

function addToDealersHandValue(nul, value) {
  dealersHandValue += value;
}

// eventLisenter for chip images
$chipImageWrapper.forEach(function (chip) {
  chip.addEventListener('click', function (e) {
    if (e.target.nodeName === 'IMG') {
      const chipValue = e.target.getAttribute('data-chip-value');
      const toInt = parseInt(chipValue);

      if (money - toInt < 0) {
        $money.textContent = 'Money: $0';

        if (money !== 0) {
          bet += money;
        }

        money = 0;
      } else {
        money -= toInt;
        bet += toInt;
        $money.textContent = `Money: $${money}`;
      }

      $bet.textContent = `Bet: $${bet}`;
    }
  });
});

// eventListener for deal button
$dealButton.addEventListener('click', function () {
  $startingScreenContainer.classList.add('hidden');
  $header.classList.add('hidden');
  $gameContainer.classList.remove('hidden');

  // render money and bet amount
  $gameMoney.textContent = `Money: $${money}`;
  $gameBet.textContent = `Bet: $${bet}`;

  // draws 4 cards for each player and assign them
  renderFourCards();
});
