const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const { functionOrder } = require('./data/functionOrder');
const { useCardDeck } = require('./data/helpers/useCardDeck');
const { createRoom } = require('./data/helpers/createRoom');
const { checkRoom } = require('./data/helpers/checkRoom');
const { getUsers } = require('./data/helpers/getUsers');
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
        createRoom(req.body.name, res);
    } else {
        checkRoom(req.body.name, res, req.body.roomID);
    }
});

io.on('connection', (socket) => {
    // console.log('user connected');
    
    socket.on('start game', async () => {
        const players = await getUsers(socket.room, 'socketId');
        const deck = await useCardDeck('create');
        const river = await useCardDeck('draw', '5', deck.deck_id);

        players.forEach(async (player) => {
            const draw = await useCardDeck('draw', '2', deck.deck_id);
            io.to(`${player}`).emit('serve cards', draw, river);
        }); 
    });

    socket.on('join room', async (name, room) => {
        addData(room, name, 'socketId', socket.id);
        const names = await getUsers(room, 'username');
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


