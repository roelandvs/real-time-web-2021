const socket = io();
const button = document.querySelector('#button');

socket.on('serve cards', (cards, river) => {
    const userCardsImg = document.querySelectorAll('.user-card');

    userCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${cards.cards[i].image}`)
    })
    console.log('cards:', cards)
    console.log('river:', river)
});

function start() {
    socket.emit('start game');
};

button.addEventListener('click', start);