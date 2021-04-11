const { fetchAPI } = require('./helpers/fetchAPI');
const { turnToJSON } = require('./utils/turnToJSON');
const url = 'https://api.pokerapi.dev/v1/winner/texas_holdem?cc=AC,KD,QH,JS,7C&pc[]=10S,8C&pc[]=3S,2C&pc[]=QS,JH';

function functionOrder() {
    return fetchAPI(url)
        .then(turnToJSON)
        .then(console.log)
};

module.exports = { functionOrder };