const socket = io();
const startButton = document.querySelector('#start-button');
const endButton = document.querySelector('#end-button');

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
        if (river.cards[i]) {
            card.setAttribute('src', `${river.cards[i].image}`)
        } else {
            card.setAttribute('src', 'https://lh3.googleusercontent.com/proxy/t8xwIPdIq_8cduE0NuFc9Lo38C2yB72_Jz6ASGM9M_mc04agyRSdV3UqevIVQIv9UH7q9vuPCKJi08NL0IIZjdSgk0GIxhY')
        }
    });

    socket.emit('cards to database', cards.cards[0].code, cards.cards[1].code);
    // console.log('cards:', cards)
    // console.log('river:', river)
    startButton.parentElement.removeChild(startButton);
});

socket.on('return winner', (winner, hand) => {
    console.log(`${winner} won the game with a ${hand}!`)
});

function end() {
    socket.emit('get winner');
}

function start() {
    socket.emit('start game', roomId);
};

startButton.addEventListener('click', start);
// endButton.addEventListener('click', end);

