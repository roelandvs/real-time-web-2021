const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { functionOrder } = require('./data/functionOrder');

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});