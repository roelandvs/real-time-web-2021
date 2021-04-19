const { firebase } = require('./firebase');
const db = firebase.database();

function createRoom(name, res, roomId) {
    if (roomId) {
        console.log('joinRoom')
        db.ref('rooms').child(roomId).child('players').push({
            username: name,
            money: 0
        })
    } else {
        console.log('createRoom')

        const createRoomId = (Math.random()).toString().substring(2);
        db.ref('rooms').child(createRoomId).child('players').push({
            username: name,
            money: 0
        });
    };

    
};

module.exports = { createRoom };