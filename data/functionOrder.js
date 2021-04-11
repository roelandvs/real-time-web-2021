const { fetchAPI } = require('./helpers/fetchAPI');
const { turnToJSON } = require('./utils/turnToJSON');

function functionOrder() {
    return fetchAPI()
        .then(turnToJSON)
};

module.exports = { functionOrder };