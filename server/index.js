const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(
    cors()
)

const login = require('./Routes/AuthRoute/Login.js');
const aReg = require('./Routes/AuthRoute/AdminReg.js');
const register = require('./Routes/AuthRoute/Register.js');
const message = require('./Routes/ContactUsRoute/Message.js');
const wishlist = require('./Routes/VehicleRoute/Wishlist.js');
const sell = require('./Routes/VehicleRoute/SellVechile.js');
const profile = require('./Routes/ProfileRoute/Profile.js');
const lostAndFound = require('./Routes/LostAndFoundRoute/LostAndFound.js');
const rentalRoute = require('./Routes/RentRoute/AddToRental.js'); 
const addVehicle = require('./Routes/RentRoute/AddVehicles.js');
const vehiclesRouter = require('./Routes/RentRoute/GetRentalVehicles_admin.js');
const khaltiVerify = require('./Routes/KhaltiVerify.js');
const transaction = require('./Routes/Transaction.js');
const appointment = require('./Routes/AppointmentRoute/Appointments.js');
const dashboard = require('./Routes/DashboardRoute/Dashboard.js');

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', login, register, message, wishlist, sell, profile, aReg, khaltiVerify, transaction, dashboard);
app.use('/', login, register, message, wishlist, sell);
app.use('/api/lost-and-found', lostAndFound);
app.use('/api/rentals', rentalRoute);
app.use('/api/add-vehicle', addVehicle);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/appointments', appointment);


const rentVehiclesController = require('./Routes/RentRoute/GetRentVehicles_user.js');
app.use('/rent', rentVehiclesController);

app.get('*', (req, res) => {
    res.send('404-error not found');
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});