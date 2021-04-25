function formatTenCard(cards) {
    return cards.reduce((acc, cur) => {
        if (cur.startsWith('0')) {
            const newTenCard = '1' + cur;
            acc.push(newTenCard);
        } else if (cur === '') {
        } else {
            acc.push(cur);
        };

        return acc;
    }, []);
};

module.exports = { formatTenCard };