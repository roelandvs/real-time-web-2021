const { firebase } = require('./firebase');
const db = firebase.database();

function addData(roomId, userName, keyName, value) {
    const userRef = db.ref('rooms').child(roomId);

    if (userName === 'none') {
        // console.log('hopi')
        userRef.get().then(snapshot => {
            // console.log(snap.val())
            snapshot.ref
                .update({
                    [keyName]: value
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

    // songsRef.get().then(snap => {
    //     snap.forEach(snapshot => {
    //       if(snapshot.val().songArtist === songArtist && snapshot.val().songName === songName) {
    //         songsRef
    //           .orderByChild('uri')
    //           .equalTo(snapshot.val().uri)
    //           .once("value")
    //           .then(snapshot => {
    //             snapshot.forEach(child => {
    //               child
    //               .ref
    //               .remove()
    //               .then(() => 'Removed song')
    //               .catch(err => console.warn('songErr', err))
    //             })
    //           })
    //           .then(() => 'Removed song')
    //           .catch(err => console.warn('songRefErr', err))
    //       }
    //     })
    //   }).catch(err => console.warn('playlistRefErr', err))
};

module.exports = { addData };