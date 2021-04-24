const { firebase } = require('./firebase');
const db = firebase.database();

function getData(roomId, property, roomOrUser) {
    const userRef = db.ref('rooms').child(roomId);

    //I made this function so that you can get data from users, or from the room
    //But I currently only get user data, but it's still usefull code
    if (roomOrUser === 'room') {
        return userRef.get()
            .then(snapshot => {
                return snapshot.val()[property];
            })
            .catch(err => {
                console.log(err)
            });
    } else if (roomOrUser === 'user') {
        return userRef.child('players').get()
        .then(snapshot => {
                playerValues = [];
                snapshot.forEach(player => {
                    playerValues.push(player.val());
                })
                return playerValues;
        })
        .catch(err => {
            console.log(err)
        });
    } else {
        return userRef.child('players').get()
            .then(snapshot => {
                    playerValues = [];
                    snapshot.forEach(player => {
                        playerValues.push(player.val()[property]);
                    })
                    return playerValues;
            })
            .catch(err => {
                console.log(err)
            });
    };
};

module.exports = { getData };