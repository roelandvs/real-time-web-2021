const { fetchPokerAPI } = require('./fetchAPI');
const { turnToJSON } = require('../utils/turnToJSON');
const baseURL = 'https://api.pokerapi.dev/v1/winner/texas_holdem';

function getWinningCards(tableCards, playerCards) {
    return fetchPokerAPI(baseURL, tableCards, playerCards)
        .then(turnToJSON)
};

module.exports = { getWinningCards };