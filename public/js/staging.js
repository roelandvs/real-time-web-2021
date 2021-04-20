const socket = io();
socket.emit('join room', name, roomId);

const nameList = document.querySelector('#players')
const nameBlock = document.createElement('li');
nameBlock.innerText = 'hoi';

nameList.appendChild(nameBlock);
