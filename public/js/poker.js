const socket = io();
const startButton = document.querySelector('#start-button');
const foldButton = document.createElement('button');
const checkButton = document.createElement('button');
const statusList = document.querySelector('#status-list');
const roomIdString = document.querySelector('h1 + p');
const controlContainer = document.querySelector('.controls');
const riverCardsImg = document.querySelectorAll('.river-card');
const userCardsImg = document.querySelectorAll('.user-card');

function addCardBackground() {
    riverCardsImg.forEach(card => {
        card.setAttribute('src', 'https://i.pinimg.com/originals/6c/a0/16/6ca016115a894f69dea75cc80f95ad92.jpg');
    });

    userCardsImg.forEach(card => {
        card.setAttribute('src', 'https://i.pinimg.com/originals/6c/a0/16/6ca016115a894f69dea75cc80f95ad92.jpg');
    });
};

addCardBackground();

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
    userCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${cards.cards[i].image}`)
    });

    riverCardsImg.forEach((card, i) => {
        if (river.cards[i]) {
            card.setAttribute('src', `${river.cards[i].image}`)
        } else {
            
        }
    });

    socket.emit('cards to database', cards.cards[0].code, cards.cards[1].code);
});

socket.on('active turn', () => {
    foldButton.setAttribute('type', 'button');
    checkButton.setAttribute('type', 'button');
    foldButton.innerText = 'Fold';
    checkButton.innerText = 'Check';
    controlContainer.appendChild(foldButton);
    controlContainer.appendChild(checkButton);
    foldButton.addEventListener('click', fold);
    checkButton.addEventListener('click', check);
});

socket.on('return winner', (winner, hand) => {
    console.log(`${winner} won the game with a ${hand}!`)
});

socket.on('status update', (player, update) => {
    const updateItem = document.createElement('li');
    const nameSpan = document.createElement('span');
    const messageSpan = document.createElement('span');

    nameSpan.innerText = `${player}: `;
    messageSpan.innerText = update;

    updateItem.appendChild(nameSpan);
    updateItem.appendChild(messageSpan);
    statusList.appendChild(updateItem);
});

socket.on('flop', (flopNumber, flopCard) => {
    riverCardsImg[2 + flopNumber].setAttribute('src', `${flopCard.cards[0].image}`)
});

function start() {
    socket.emit('start game', roomId);
    startButton.parentElement.removeChild(startButton);
};

function end() {
    socket.emit('get winner');
};

function check() {
    socket.emit('check');
    controlContainer.innerHTML = '';
};

function fold() {
    socket.emit('fold');
    controlContainer.innerHTML = '';
};

function copyRoomId() {
    navigator.clipboard.writeText(roomId)
};

if (leader === 'true') {
    startButton.addEventListener('click', start);
};

roomIdString.addEventListener('click', copyRoomId);