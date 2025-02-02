const fetch = require('node-fetch');

function fetchPokerAPI(url, tableCards, playerCards) {
    return fetch(`${url}?cc=${tableCards}${playerCards}`)
};

function fetchCardsAPI(purpose, number, deckID) {
    const baseURL = 'https://deckofcardsapi.com/api/deck';

    if (purpose === 'create') {
        return fetch(`${baseURL}/new/shuffle/?deck_count=1`)
    } else if (purpose === 'draw') {
        return fetch(`${baseURL}/${deckID}/draw/?count=${number}`)
    };
};

module.exports = { 
    fetchPokerAPI,
    fetchCardsAPI
};