const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
// const cookiee = require('cookie-parser');

const cors = require('cors');

app.use(cors())

const login = require('./routes/login');

 
// app.use(cookiee());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', login);

app.get('*', (req, res) => {
    res.send('404-error not found');
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});