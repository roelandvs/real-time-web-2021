const { firebase } = require('./firebase');
const db = firebase.database();

function createOrJoinRoom(name, res, roomId) {
    if (roomId) {
        db.ref('rooms').child(roomId).child('players').push({
            username: name
        });
        res.redirect(`/${roomId}/${name}`)
    } else {
        const createRoomId = (Math.random()).toString().substring(2);
        db.ref('rooms').child(createRoomId).child('players').push({
            username: name
        });
        res.redirect(`/${createRoomId}/${name}`)
    };

    
};

module.exports = { createOrJoinRoom };