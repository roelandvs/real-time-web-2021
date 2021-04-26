const { firebase } = require('./firebase');
const db = firebase.database();

function createOrJoinRoom(name, res, roomId) {
    if (roomId) {
        db.ref('rooms').child(roomId).child('players').push({
            username: name,
            leader: false,
            hasHadTurn: false,
            hasFolded: false
        });
        res.redirect(`/${roomId}/${name}`)
    } else {
        const createRoomId = (Math.random()).toString().substring(2);
        db.ref('rooms').child(createRoomId).child('players').push({
            username: name,
            leader: true,
            hasHadTurn: true,
            hasFolded: false
        });
        res.redirect(`/${createRoomId}/${name}/leader`)
    };

    
};

module.exports = { createOrJoinRoom };