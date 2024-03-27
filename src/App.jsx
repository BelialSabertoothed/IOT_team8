import { Routes, Route, Outlet, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Pilltaker from "./pages/Pilltaker";
import Register from "./pages/Register"
import Intriuduction from "./pages/Intriuduction";

import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <Routes>
          <Route path="/" element={<Intriuduction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pilltaker" element={<Pilltaker />} />
      </Routes>
    </div>
  );
}

export default App;
