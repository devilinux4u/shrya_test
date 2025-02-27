// import './index.css';
// import { Routes, Route } from 'react-router-dom';
// import NavMenu from './Components/NavMenu';
// import Login from './Pages/Login';
// import Register from './Pages/Register';
// import Footer from './Components/Footer';
// import Home from './Pages/Home';
// import RentalVehicles from './Pages/RentalVehicles';
// import RentalVehicleDesc from './Pages/RentalVehicleDesc';
// import BuyVehicles from './Pages/BuyVehicles';
// import VehicleListing from './Pages/VehicleListing';
// import SellVehicle from './Pages/SellVehicle';
// import UserSalesList from './Pages/UserSalesList';
// import LostAndFound from './Pages/LostAndFound';
// import ReportItem from './Pages/ReportItem';
// import Wishlist from './Pages/Wishlist';
// import YourList from './Pages/YourList';
// import BuyVehiclesDesc from './Pages/BuyVehiclesDesc';


// function App() {
//   return (
//     <>
//       <NavMenu /> {/* Navigation Menu */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/RentalVehicles" element={<RentalVehicles />} />
//         <Route path="/Login" element={<Login />} />
//         <Route path="/Register" element={<Register />} />
//         <Route path="/RentalVehicleDesc" element={<RentalVehicleDesc />} />
//         <Route path="/BuyVehicles" element={<BuyVehicles />} />
//         <Route path="/VehicleListing" element={<VehicleListing />} />
//         <Route path="/SellVehicle" element={<SellVehicle />} />
//         <Route path="/UserSalesList" element={<UserSalesList />} />
//         <Route path="/LostAndFound" element={<LostAndFound />} />
//         <Route path="/ReportItem" element={<ReportItem />} />
//         <Route path="/Wishlist" element={<Wishlist />} />
//         <Route path="/YourList" element={<YourList />} />
//         <Route path="/BuyVehiclesDesc" element={<BuyVehiclesDesc />} />

//       </Routes>
//       <Footer />
//     </>
//   );
// }

import { Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Sidebar from "./Admin/Sidebar";
import Vehicles from "./Admin/Vehicle Management/Vehicles";
import AddNewVehicle from "./Admin/Vehicle Management/AddNewVehicle";
import Orders from "./Admin/Sales/Orders";
import Transactions from "./Admin/Sales/Transactions";
import ActiveRentals from "./Admin/Rentals/ActiveRentals";
import RentalHistory from "./Admin/Rentals/RentalHistory";
import Users from "./Admin/User/Users";
import LostAndFound from "./Admin/LostAndFound/LostAndFound";
import Wishlist from "./Admin/Wishlist/Wishlist";
import Reports from "./Admin/Reports/Reports";
import Settings from "./Admin/Settings/Settings";

function App() {
  return (
    <>
      <Sidebar /> {/* Navigation Menu */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/vehicles" element={<Vehicles />} />
        <Route path="/admin/addnewvehicles" element={<AddNewVehicle />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/activerentals" element={<ActiveRentals />} />
        <Route path="/admin/rentalhistory" element={<RentalHistory />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/lostandfound" element={<LostAndFound />} />
        <Route path="/admin/wishlist" element={<Wishlist />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        
      </Routes>
    </>
  );
}

export default App;


