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
const aReg = require('./controllers/authControllers/adminReg');
const register = require('./controllers/authControllers/register');
const message = require('./controllers/contactusControllers/message');
const wishlist = require('./controllers/vehicleControllers/wishlist');
const sell = require('./controllers/vehicleControllers/sellVechile');
const profile = require('./controllers/profileController/profile');
const lostAndFound = require('./controllers/lostAndFoundControllers/lostAndFound');

app.use('/uploads', express.static(path.join(__dirname, 'controllers/uploads')));


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', login, register, message, wishlist, sell, profile, aReg);
app.use('/', login, register, message, wishlist, sell);
app.use('/api/lost-and-found', lostAndFound);

app.get('*', (req, res) => {
    res.send('404-error not found');
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});