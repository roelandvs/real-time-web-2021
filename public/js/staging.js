const socket = io();
const button = document.querySelector('#button');

socket.emit('join room', name, roomId);

socket.on('add player', (playerNames) => {
    const nameList = document.querySelector('#players');
    nameList.innerHTML = '';
    
    playerNames.forEach(name => {
        const nameBlock = document.createElement('li');
        nameBlock.innerText = name;
        nameList.appendChild(nameBlock);  
    });
});

socket.on('serve cards', (cards, river) => {
    const userCardsImg = document.querySelectorAll('.user-card');
    const riverCardsImg = document.querySelectorAll('.river-card');

    userCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${cards.cards[i].image}`)
    });

    riverCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${river.cards[i].image}`)
    });

    socket.emit('cards to database', cards.cards[0].code, cards.cards[1].code);
    console.log('cards:', cards)
    console.log('river:', river)
});

function start() {
    socket.emit('start game', roomId);
};

button.addEventListener('click', start);

