import "./App.css";
import Account from "./components/Accounts";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Status from "./components/Status";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Confirm from "./components/Confirm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Listings from "./components/Listings";
import MyListings from "./components/MyListings";
import AddPost from "./components/AddPost";
import Navbar from "./components/Navbar"
import Requests from "./components/Requests";
import ChangePassword from "./components/ChangePassword";

function App() {
  return (
    <div>
      <Account>
        <BrowserRouter>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/profile" element={<Status />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/my-listings" element={<MyListings/>}/>
            <Route path="/addPost" element={<AddPost/>}/>
            <Route path="/requests" element={<Requests/>}/>
            <Route path="/account" element={<ChangePassword/>}/>
          </Routes>
        </BrowserRouter>
      </Account>
      <ToastContainer />
    </div>
  );
}

export default App;
