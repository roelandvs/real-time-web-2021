const fetch = require('node-fetch');

function fetchAPI(url, tableCards, playerCards) {
    return fetch(`${url}?cc=${tableCards}${playerCards}`)
};

module.exports = { fetchAPI };