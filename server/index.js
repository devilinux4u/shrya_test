const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(
    cors()
)

const login = require('./controllers/authControllers/login');
const aReg = require('./controllers/authControllers/adminReg');
const register = require('./controllers/authControllers/register');
const message = require('./controllers/contactusControllers/message');
const wishlist = require('./controllers/vehicleControllers/wishlist');
const sell = require('./controllers/vehicleControllers/sellVechile');
const profile = require('./controllers/profileController/profile');
const lostAndFound = require('./controllers/lostAndFoundControllers/lostAndFound');
const rentalRoute = require('./controllers/rentControllers/rental'); 
const addVehicle = require('./controllers/rentControllers/addVehicles.js');
const vehiclesRouter = require('./controllers/rentControllers/vehicles');
const khaltiVerify = require('./controllers/khaltiVerify');
const transaction = require('./controllers/transaction');
const appointmentsController = require('./controllers/Appointments/Appointments');

app.use('/uploads', express.static(path.join(__dirname, 'controllers/uploads')));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', login, register, message, wishlist, sell, profile, aReg, khaltiVerify, transaction);
app.use('/', login, register, message, wishlist, sell);
app.use('/api/lost-and-found', lostAndFound);
app.use('/api/rentals', rentalRoute);
app.use('/api/add-vehicle', addVehicle);
app.use('/api/vehicles', vehiclesRouter);

const rentVehiclesController = require('./controllers/rentControllers/rentVehiclesController');
app.use('/rent', rentVehiclesController);

app.post('/api/appointments', appointmentsController.createAppointment);
app.get('/api/appointments', appointmentsController.getAppointments);

app.get('*', (req, res) => {
    res.send('404-error not found');
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});