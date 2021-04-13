const { fetchCardsAPI } = require('./fetchAPI');
const { turnToJSON } = require('../utils/turnToJSON');

function useCardDeck(purpose, deckID, cards) {
    return fetchCardsAPI(purpose, deckID, cards)
        .then(turnToJSON)
};

module.exports = { useCardDeck };