const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const { functionOrder } = require('./data/functionOrder');
const { createOrJoinRoom } = require('./data/helpers/createOrJoinRoom');
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
    res.render('staging', { room: req.params.roomId, name: req.params.name })
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
        const players = await getData(socket.room, 'socketId');
        const deck = await useCardDeck('create');
        const river = await useCardDeck('draw', '5', deck.deck_id);
        const riverArray = [];

        players.forEach(async (player) => {
            const draw = await useCardDeck('draw', '2', deck.deck_id);
            io.to(`${player}`).emit('serve cards', draw, river);
        }); 

        river.cards.forEach(card => {
            riverArray.push(card.code)
        });

        socket.deck = deck.deck_id;
        socket.river = riverArray;
        // addData(socket.room, 'none', 'deckId', deck.deck_id);
        // addData(socket.room, 'none', 'riverCards', riverArray);
    });

    socket.on('end game', async () => {
    });

    socket.on('join room', async (name, room) => {
        addData(room, name, 'socketId', socket.id);
        const names = await getData(room, 'username');
        socket.name = name;
        socket.room = room;
        socket.join(room);
        io.to(room).emit('add player', names);
    })

    socket.on('cards to database', (cardOne, cardTwo) => {
        addData(socket.room, socket.name, 'cards', [cardOne, cardTwo]);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


