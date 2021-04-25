const { firebase } = require('./firebase');
const db = firebase.database();

function addData(roomId, userName, keyName, value) {
    const userRef = db.ref('rooms').child(roomId);

    if (userName === 'none') {
        userRef.get().then(snapshot => {
            snapshot.ref
                .update({
                    [keyName]: value
                })
        });
    } else if (userName === 'everyone') {
        userRef.child('players').get().then(snap => {
            snap.forEach(snapshot => {
                snapshot.ref
                .update({
                    [keyName]: value
                })
                .catch(err => {
                    console.log(err)
                })
            })
        });
    } else {
        userRef.child('players').get().then(snap => {
            snap.forEach(snapshot => {
                if (snapshot.val().username === userName) {
                    snapshot.ref
                    .update({
                        [keyName]: value
                    })
                    .catch(err => {
                        console.log(err)
                    })
                };
            })
        });
    };
};

module.exports = { addData };