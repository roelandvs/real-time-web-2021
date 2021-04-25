const express = require('express');
const app = express();
const port = process.env.PORT || 420;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { createOrJoinRoom } = require('./data/helpers/createOrJoinRoom');
const { getWinningCards } = require('./data/helpers/getWinningCards');
const { formatTenCard } = require('./data/helpers/formatTenCard');
const { useCardDeck } = require('./data/helpers/useCardDeck');
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
        const river = await useCardDeck('draw', '5', deck.deck_id);
        const riverArray = [];

        playerIds.forEach(async (player) => {
            const draw = await useCardDeck('draw', '2', deck.deck_id);
            io.to(`${player}`).emit('serve cards', draw, river);
        });

        river.cards.forEach(card => {
            riverArray.push(card.code)
        });

        // socket.deck = deck.deck_id;
        // socket.river = riverArray;
        addData(socket.room, 'none', 'deckId', deck.deck_id);
        addData(socket.room, 'none', 'riverCards', riverArray);
    });

    socket.on('join room', async (name, room) => {
        addData(room, name, 'socketId', socket.id);
        const names = await getData(room, 'username');
        socket.name = name;
        socket.room = room;
        socket.join(room);
        io.to(room).emit('add player', names);
    })

    socket.on('cards to database', async (cardOne, cardTwo) => {
        addData(socket.room, socket.name, 'cards', [cardOne, cardTwo]);
        socket.river = await getData(socket.room, 'riverCards', 'room');
        socket.playerIds = await getData(socket.room, 'socketId');
    })

    socket.on('get winner', () => {
        getData(socket.room, 'cards')
            .then(playerCards => {
                return playerCards.reduce((acc, cur) => {
                    //Poker and Carddeck API use different notation for card '10' (0 vs 10)
                    //So I need to add '1' to front to make it the same
                    const formattedCards = formatTenCard(cur);
                    const cardString = formattedCards.toString();
                    const ApiUrlNotation = `&pc[]=${cardString}`;
                    return acc.concat(ApiUrlNotation);
                }, '')
            })
            .then(urlCardString => {
                const formattedRiver = formatTenCard(socket.river);
                const urlRiverString = formattedRiver.toString();
                return getWinningCards(urlRiverString, urlCardString);
            })
            .then(async winnerObject => {
                const users = await getData(socket.room, 'niks', 'user');
                const winner = users.find((user) => {
                    userCardString = user.cards.toString();
                    return userCardString === winnerObject.winners[0].cards;
                });
                return [winner, winnerObject];
            })
            .then(winnerArray => {
                const winningValue = winnerArray[1].winners[0].result;
                console.log(winnerArray[0])

                socket.playerIds.forEach(playerId => {
                    if (winnerArray[0].socketId === playerId) {
                        io.to(`${playerId}`).emit('return winner', 'you', winningValue);
                    } else {
                        io.to(`${playerId}`).emit('return winner', winnerArray[0].username, winningValue);
                    }
                })
            })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


