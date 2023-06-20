const $chipImageWrapper = document.querySelectorAll('.chip-image-wrapper');
const $money = document.querySelector('.money');
const $bet = document.querySelector('.bet');
const $dealButton = document.querySelector('.deal-button');
const $hitButton = document.querySelector('.hit-button');
const $standButton = document.querySelector('.stand-button');
const $graphButton = document.querySelector('.graph-button');
const $startingScreenContainer = document.querySelector('.starting-screen-container');
const $header = document.querySelector('header');
const $results = document.querySelector('.results');
const $resultsOverlay = document.querySelector('.results-overlay');
const $graphOverlay = document.querySelector('.graph-overlay');
// game elements
const $gameContainer = document.querySelector('.game-container');
const $gameMoney = document.querySelector('.game-money');
const $gameBet = document.querySelector('.game-bet');
const $playersCard = document.querySelectorAll('.players-card');
const $dealersCard = document.querySelectorAll('.dealers-card');
const $dealersHandValue = document.querySelector('.dealers-hand-value');
const $playersHandValue = document.querySelector('.players-hand-value');
const $playersHand = document.querySelector('.players-hand');
const $dealersHand = document.querySelector('.dealers-hand');
// api variable
const deck = new XMLHttpRequest();
const cards = new XMLHttpRequest();
const card = new XMLHttpRequest();
const dealerCards = new XMLHttpRequest();
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

// draw one card for player
function drawPlayerCard() {
  card.open('GET', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
  card.responseType = 'json';
  card.addEventListener('load', renderCardAndValue);
  card.send();
}

// draw cards for dealer
function drawDealerCard() {
  dealerCards.open('GET', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`);
  dealerCards.responseType = 'json';
  dealerCards.addEventListener('load', function () {
    for (let i = 0; i < dealerCards.response.cards.length; i++) {
      const image = document.createElement('img');
      const value = dealerCards.response.cards[i].value;

      if (dealersHandValue <= playersHandValue) {
        image.src = dealerCards.response.cards[i].image;
        image.alt = dealerCards.response.cards[i].value;
        $dealersHand.prepend(image);

        if (value === 'ACE') {
          if (dealersHandValue + 11 <= 21) {
            dealersHandValue += 11;
          } else {
            dealersHandValue += 1;
          }
        } else if (parseInt(value) > 1 && parseInt(value) < 11) {
          dealersHandValue += parseInt(value);
        } else if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
          dealersHandValue += 10;
        }

        $dealersHandValue.textContent = dealersHandValue;

        // shows results
        if ((dealersHandValue === 19 && playersHandValue === 19) || (dealersHandValue === 20 && playersHandValue === 20) || (dealersHandValue === 21 && playersHandValue === 21)) {
          $results.textContent = 'Push';
          break;
        } else if (dealersHandValue > playersHandValue && dealersHandValue <= 21) {
          $results.textContent = 'You Lose';
          break;
        } else if (dealersHandValue > playersHandValue && dealersHandValue > 21) {
          $results.textContent = 'You Win';
          break;
        }
      }
    }
  });
  dealerCards.send();
}

// render card and value
function renderCardAndValue() {
  const image = document.createElement('img');

  // renders cards image
  image.classList.add('players-card');
  image.src = card.response.cards[0].image;
  image.alt = card.response.cards[0].value;
  $playersHand.appendChild(image);

  // adds card value
  const value = card.response.cards[0].value;
  if (value === 'ACE') {
    if (playersHandValue + 11 <= 21) {
      playersHandValue += 11;
    } else {
      playersHandValue += 1;
    }
  } else if (parseInt(value) > 1 && parseInt(value) < 11) {
    playersHandValue += parseInt(value);
  } else if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
    playersHandValue += 10;
  }
  $playersHandValue.textContent = playersHandValue;
}

// drawing first 4 cardsfrom deck
function renderFourCards() {
  cards.open('GET', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
  cards.responseType = 'json';
  cards.addEventListener('load', function () {

    $playersCard[0].src = cards.response.cards[0].image;
    $playersCard[1].src = cards.response.cards[1].image;
    $dealersCard[1].src = cards.response.cards[3].image;
    $playersCard[0].alt = cards.response.cards[0].value;
    $playersCard[1].alt = cards.response.cards[1].value;
    $dealersCard[1].alt = cards.response.cards[3].value;
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

// calculate the value of someones hand

function calculateHandValue(int, lessthan, hand, callback) {
  const eleven = 11;
  const one = 1;
  const ten = 10;

  for (let i = int; i < lessthan; i++) {
    const value = cards.response.cards[i].value;

    if (value === 'ACE') {
      if (hand + 11 <= 21) {
        callback(eleven);
      } else {
        callback(one);
      }
    } else if (parseInt(value) > 1 && parseInt(value) < 11) {
      callback(parseInt(value));
    } else if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
      callback(ten);
    }
  }
}

function addToPlayersHandValue(value) {
  playersHandValue += value;
}

function addToDealersHandValue(value) {
  dealersHandValue += value;
}

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

// eventListener for hit button

$hitButton.addEventListener('click', function () {
  if (playersHandValue < 21) {
    drawPlayerCard();
    card.removeEventListener('ended', renderCardAndValue);
  }
});

// eventListner for stand button

$standButton.addEventListener('click', function () {
// reveal dealers first card
  $dealersCard[0].src = dealersHand[0].image;

  // add value of card to total value
  const value = dealersHand[0].value;
  if (value === 'ACE') {
    if (playersHandValue + 11 <= 21) {
      dealersHandValue += 11;
    } else {
      dealersHandValue += 1;
    }
  } else if (parseInt(value) > 1 && parseInt(value) < 11) {
    dealersHandValue += parseInt(value);
  } else if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
    dealersHandValue += 10;
  }

  $dealersHandValue.textContent = dealersHandValue;

  // disables the hit button
  $hitButton.disabled = true;
  $standButton.disabled = true;

  // decides if dealer draws or not
  if ((playersHandValue > 21) || (dealersHandValue > playersHandValue && dealersHandValue <= 21)) {
    $results.textContent = 'You Lose';
  } else if ((dealersHandValue === 21 && playersHandValue === 21) || (dealersHandValue === 20 && playersHandValue === 20) || (dealersHandValue === 19 && playersHandValue === 19)) {
    $results.textContent = 'Push';
  } else if (dealersHandValue <= playersHandValue && dealersHandValue < 21) {
    drawDealerCard();
  }

  setTimeout(function () {
    $resultsOverlay.classList.remove('hidden');
  }, 1500);

});

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

// eventListener for graph button
$graphButton.addEventListener('click', () => {
  $graphOverlay.classList.remove('hidden');
});

// eventListener for graph overlay
$graphOverlay.addEventListener('click', () => {
  $graphOverlay.classList.add('hidden');
});
