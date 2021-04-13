const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { functionOrder } = require('./data/functionOrder');
const { useCardDeck } = require('./data/helpers/pickTwoCards');

useCardDeck('create')
    .then((deckID) => {
        app
            .use(express.static(`${__dirname}/public`))
            .set('view engine', 'ejs')
            // .use(express.urlencoded({ extended: true }))
            // .set('views', join(`${__dirname}/views`))

        app.get('/', (req, res) => {
            functionOrder()
                .then(response => {
                    res.render('home')
                });
        });

        io.on('connection', async (socket) => {
            console.log(`user connected`);
            const draw = await useCardDeck('draw', deckID.deck_id, '2');

            //activates client side function
            io.to(socket.id).emit('serve cards', draw);

            socket.on('disconnect', () => {
                console.log('user disconnected')
            });
        });

        http.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });

})


