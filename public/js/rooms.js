const socket = io();
const buttons = document.querySelectorAll('.submit-button');
const nameInput = document.querySelector('input[id="name"]')

function sendPlayerName() {
    socket.emit('new player', nameInput.value);
};

buttons.forEach(button => {
    button.addEventListener('click', sendPlayerName)
});