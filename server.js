const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { createOrJoinRoom } = require('./data/helpers/createOrJoinRoom');
const { useCardDeck } = require('./data/helpers/useCardDeck');
const { getWinner } = require('./data/helpers/getWinner');
const { checkRoom } = require('./data/helpers/checkRoom');
const { getData } = require('./data/helpers/getData');
const { addData } = require('./data/helpers/addData');

app
    .use(express.static(`${__dirname}/public`))
    .set('view engine', 'ejs')
    .use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('rooms')
});

app.get('/:roomId/:name', (req, res) => {
    res.render('poker', { room: req.params.roomId, name: req.params.name, leader: false })
});

app.get('/:roomId/:name/leader', (req, res) => {
    res.render('poker', { room: req.params.roomId, name: req.params.name, leader: true })
});

app.post('/', (req, res) => {
    if (req.body.create) {
        createOrJoinRoom(req.body.name, res);
    } else {
        checkRoom(req.body.name, res, req.body.roomID);
    }
});

io.on('connection', (socket) => {
    // console.log('user connected');
    
    socket.on('start game', async () => {
        const playerIds = await getData(socket.room, 'socketId');
        const deck = await useCardDeck('create');
        const river = await useCardDeck('draw', '3', deck.deck_id);
        let riverArray = [];

        playerIds.forEach((player, i) => {
            setTimeout(async () => {
                const draw = await useCardDeck('draw', '2', deck.deck_id);
                io.to(`${player}`).emit('serve cards', draw, river);
            }, i * 500)
        });

        river.cards.forEach(card => {
            riverArray.push(card.code)
        });

        io.to(socket.room).emit('status update', socket.name, 'started game');
        io.to(socket.id).emit('active turn');
        addData(socket.room, 'none', 'deckId', deck.deck_id);
        addData(socket.room, 'none', 'riverCards', riverArray);
    });

    socket.on('join room', async (name, room) => {
        addData(room, name, 'socketId', socket.id);
        const names = await getData(room, 'username');
        socket.name = name;
        socket.room = room;
        socket.round = 1;
        socket.join(room);
        io.to(room).emit('add player', names);
    })

    socket.on('cards to database', async (cardOne, cardTwo) => {
        addData(socket.room, socket.name, 'cards', [cardOne, cardTwo]);
        socket.river = await getData(socket.room, 'riverCards', 'room');
        socket.deck = await getData(socket.room, 'deckId', 'room');
        socket.playerIds = await getData(socket.room, 'socketId');
    })

    socket.on('fold', async () => {
        io.to(socket.room).emit('status update', socket.name, 'folds');
        addData(socket.room, socket.name, 'hasFolded', true);
        const players = await getData(socket.room, 'niks', 'user');
        const nextPlayer = players.find((player) => {
            return player.hasHadTurn === false && player.hasFolded === false;
        });
        const noFoldPlayers = players.filter((player) => {
            if (player.hasFolded === false) {
                return player;
            };
        });

        //if next player is undefined new round starts or ends game
        if (nextPlayer === undefined) {
            //new round starts
            if (socket.round < 3) {
                const flop = await useCardDeck('draw', '1', socket.deck);
                socket.river.push(flop.cards[0].code);
                io.to(socket.room).emit('flop', socket.round, flop);
                io.to(noFoldPlayers[0].socketId).emit('active turn');
                socket.round += 1;
                addData(socket.room, 'everyone', 'hasHadTurn', false);
                addData(socket.room, noFoldPlayers[0].username, 'hasHadTurn', true);
                addData(socket.room, 'room', 'riverCards', socket.river);
            } else {
                //game ends
                getWinner(socket.room, socket.river)
                    .then(winnerArray => {
                        // const winningValue = winnerArray[1].winners[0].result;
                        io.to(socket.room).emit('status update', winnerArray[0].username, 'wins!');
        
                        // socket.playerIds.forEach(playerId => {
                        //     if (winnerArray[0].socketId === playerId) {
                        //         io.to(`${playerId}`).emit('return winner', 'you', winningValue);
                        //     } else {
                        //         io.to(`${playerId}`).emit('return winner', winnerArray[0].username, winningValue);
                        //     }
                        // })
                    })
            }
        } else {
            io.to(nextPlayer.socketId).emit('active turn');
            addData(socket.room, nextPlayer.username, 'hasHadTurn', true);
        };

        addData(socket.room, socket.name, 'cards', ['', '']);
    })

    socket.on('check', async () => {
        io.to(socket.room).emit('status update', socket.name, 'checks');
        const players = await getData(socket.room, 'niks', 'user');
        const nextPlayer = players.find((player) => {
            return player.hasHadTurn === false && player.hasFolded === false;
        });
        const noFoldPlayers = players.filter((player) => {
            if (player.hasFolded === false) {
                return player;
            };
        });

        //if next player is undefined new round starts or ends game
        if (nextPlayer === undefined) {
            //new round starts
            if (socket.round < 3) {
                const flop = await useCardDeck('draw', '1', socket.deck);
                socket.river.push(flop.cards[0].code);
                io.to(socket.room).emit('flop', socket.round, flop);
                io.to(noFoldPlayers[0].socketId).emit('active turn');
                socket.round += 1;
                addData(socket.room, 'everyone', 'hasHadTurn', false);
                addData(socket.room, noFoldPlayers[0].username, 'hasHadTurn', true);
                addData(socket.room, 'none', 'riverCards', socket.river);
            } else {
                //game ends
                getWinner(socket.room, socket.river)
                    .then(winnerArray => {
                        // const winningValue = winnerArray[1].winners[0].result;
                        io.to(socket.room).emit('status update', winnerArray[0].username, 'wins!');
        
                        // socket.playerIds.forEach(playerId => {
                        //     if (winnerArray[0].socketId === playerId) {
                        //         io.to(`${playerId}`).emit('return winner', 'you', winningValue);
                        //     } else {
                        //         io.to(`${playerId}`).emit('return winner', winnerArray[0].username, winningValue);
                        //     }
                        // })
                    })
            }
        } else {
            io.to(nextPlayer.socketId).emit('active turn');
            addData(socket.room, nextPlayer.username, 'hasHadTurn', true);
        };
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


