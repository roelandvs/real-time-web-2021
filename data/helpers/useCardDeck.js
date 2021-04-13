const { fetchCardsAPI } = require('./fetchAPI');
const { turnToJSON } = require('../utils/turnToJSON');

function useCardDeck(purpose, number, deckID) {
    return fetchCardsAPI(purpose, number, deckID)
        .then(turnToJSON)
};

module.exports = { useCardDeck };