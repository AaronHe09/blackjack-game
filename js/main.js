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
// money variables
let money = 1000;
let bet = 0;

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
});
