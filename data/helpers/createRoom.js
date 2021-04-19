const { firebase } = require('./firebase');
const db = firebase.database();

function createRoom(name, res, roomId) {
    if (roomId) {
        db.ref('rooms').child(roomId).child('players').push({
            username: name,
            money: 0
        })
    } else {
        const createRoomId = (Math.random()).toString().substring(2);
        db.ref('rooms').child(createRoomId).child('players').push({
            username: name,
            money: 0
        });
    };

    res.redirect(`/${roomId}`)
};

module.exports = { createRoom };