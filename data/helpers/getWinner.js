const { getWinningCards } = require('./getWinningCards');
const { formatTenCard } = require('./formatTenCard');
const { getData } = require('./getData');

function getWinner(roomId, riverCards) {
    return getData(roomId, 'cards')
        .then(playerCards => {
            return playerCards.reduce((acc, cur) => {
                //Poker and Carddeck API use different notation for card '10' (0 vs 10)
                //So I need to add '1' to front to make it the same
                const formattedCards = formatTenCard(cur);

                //if a player folded the cards return undefined
                if (formattedCards !== undefined) {
                    const cardString = formattedCards.toString();
                    const ApiUrlNotation = `&pc[]=${cardString}`;
                    return acc.concat(ApiUrlNotation);
                } else {
                    return acc;
                };
            }, '')
        })
        .then(urlCardString => {
            const formattedRiver = formatTenCard(riverCards);
            const urlRiverString = formattedRiver.toString();
            return getWinningCards(urlRiverString, urlCardString);
        })
        .then(async winnerObject => {
            const users = await getData(roomId, 'niks', 'user');
            const winner = users.find((user) => {
                userCardString = user.cards.toString();
                return userCardString === winnerObject.winners[0].cards;
            });
            return [winner, winnerObject];
        })
};

module.exports = { getWinner };