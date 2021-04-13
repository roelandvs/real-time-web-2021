const { 
    fetchPokerAPI,
    fetchCardsAPI,
} = require('./helpers/fetchAPI');
const { turnToJSON } = require('./utils/turnToJSON');
const baseURL = 'https://api.pokerapi.dev/v1/winner/texas_holdem';
const tableCards = 'AC,KD,KH,JS,7C';
const playerCards = '&pc[]=10S,8C&pc[]=3S,2C&pc[]=QS,JH'

function functionOrder() {
    return fetchPokerAPI(baseURL, tableCards, playerCards)
        .then(turnToJSON)
        // .then(console.log)
};

module.exports = { functionOrder };