const socket = io();
const startButton = document.querySelector('#start-button');
const endButton = document.querySelector('#end-button');
const foldButton = document.createElement('button');
const checkButton = document.createElement('button');
const statusList = document.querySelector('#status-list');
const optionContainer = document.querySelector('#options');
const riverCardsImg = document.querySelectorAll('.river-card');

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
    startButton.parentElement.removeChild(startButton);
});

socket.on('active turn', () => {
    foldButton.setAttribute('type', 'button');
    checkButton.setAttribute('type', 'button');
    foldButton.innerText = 'Fold';
    checkButton.innerText = 'Check';
    optionContainer.appendChild(foldButton);
    optionContainer.appendChild(checkButton);
    foldButton.addEventListener('click', fold);
    checkButton.addEventListener('click', check);
});

socket.on('return winner', (winner, hand) => {
    console.log(`${winner} won the game with a ${hand}!`)
});

socket.on('status update', (player, update) => {
    const updateItem = document.createElement('li');
    updateItem.innerText = `${player}: ${update}`;
    statusList.appendChild(updateItem);
});

socket.on('flop', (flopNumber, flopCard) => {
    console.log(flopCard)
    riverCardsImg[2 + flopNumber].setAttribute('src', `${flopCard.cards[0].image}`)
});

function start() {
    socket.emit('start game', roomId);
};

function end() {
    socket.emit('get winner');
};

function check() {
    socket.emit('check');
    optionContainer.innerHTML = '';
};

function fold() {
    socket.emit('fold');
    optionContainer.innerHTML = '';
};

startButton.addEventListener('click', start);
endButton.addEventListener('click', end);

