const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");

const cors = require('cors');

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
)

const login = require('./controllers/authControllers/login');
const register = require('./controllers/authControllers/register');
const message = require('./controllers/contactusControllers/message');
const wishlist = require('./controllers/vehicleControllers/wishlist');
const sell = require('./controllers/vehicleControllers/sellVechile');


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', login, register, message, wishlist, sell);

app.get('*', (req, res) => {
    res.send('404-error not found');
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});