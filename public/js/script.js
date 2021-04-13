const socket = io();
const button = document.querySelector('#button');

socket.on('serve cards', (cards, river) => {
    const userCardsImg = document.querySelectorAll('.user-card');
    const riverCardsImg = document.querySelectorAll('.river-card');

    userCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${cards.cards[i].image}`)
    });

    riverCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${river.cards[i].image}`)
    });

    console.log('cards:', cards)
    console.log('river:', river)
});

function start() {
    socket.emit('start game');
};

button.addEventListener('click', start);