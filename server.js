const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { functionOrder } = require('./data/functionOrder');
const { useCardDeck } = require('./data/helpers/useCardDeck');

app
    .use(express.static(`${__dirname}/public`))
    .set('view engine', 'ejs')

app.get('/', (req, res) => {
    functionOrder()
        .then(response => {
            res.render('home')
        });
});

let players = [];

io.on('connection', async (socket) => {
    console.log('user connected');
    
    socket.join('room1');
    players.push(socket.id);
    
    socket.on('start game', async () => {
        const deck = await useCardDeck('create');
        const river = await useCardDeck('draw', '5', deck.deck_id);

        players.forEach(async (user) => {
            const draw = await useCardDeck('draw', '2', deck.deck_id);
            io.to(`${user}`).emit('serve cards', draw, river);
        }); 
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


