const { fetchCardsAPI } = require('./fetchAPI');
const { turnToJSON } = require('../utils/turnToJSON');

function useCardDeck(purpose, number, deckID) {
    return fetchCardsAPI(purpose, number, deckID)
        .then(turnToJSON)
        .catch(err => {
            console.log(err)
        })
};

module.exports = { useCardDeck };