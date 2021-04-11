const fetch = require('node-fetch');

function fetchAPI(endpoint) {
    return fetch(endpoint)
};

module.exports = { fetchAPI };