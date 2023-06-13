/* exported data */
// api variable
const deck = new XMLHttpRequest();
const cards = new XMLHttpRequest();
let deckId = null;
// hands
const playersHand = null;
const dealersHand = null;

// fetching deck api
deck.open('GET', 'https://deckofcardsapi.com/api/deck/new/');
deck.responseType = 'json';
deck.addEventListener('load', function () {
  deckId = deck.response.deck_id;
});
deck.send();

// drawing from deck
function drawCards(i, whoseHand) {
  cards.open('GET', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${i}`);
  cards.responseType = 'json';
  cards.addEventListener('load', function () {
    whoseHand = cards.response;
  });
  cards.send();
}
