import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import getFromServer from "./utils/GetFromServer";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Pilltaker from "./pages/Pilltaker";
import Register from "./pages/Register"
import Introduction from "./pages/Intriuduction";

import NavBar from "./components/NavBar/NavBar";

// Contexts
import { UserContext } from "./helpers/UserContext";

function App() {
  const [user, setUser] = useState(null);

  // Získání dat o přihlášeném uživateli z API
  useEffect(() => {
    getFromServer("/user/current", null, null, null).then((res) => {
      setUser(res);
    }).catch((err) => {
      console.log(err);
      setUser(null);
    });
  }, []);

  return (
    <MantineProvider>
    <Notifications position="bottom-right" />
      <UserContext.Provider value={{ user, setUser }}>
        <NavBar></NavBar>
        <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/pilltaker" element={<Pilltaker />} />
        </Routes>
      </UserContext.Provider>
    </MantineProvider>
  );
}

export default App;
