import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CameraView from "./Views/CameraView";
import Home from "./Views/Home";
import Login from "./Views/Login";
import PhotoUpload from "./Views/PhotoUpload";
import QRCode from "./Views/QRCode";
import Redirect from "./Views/Redirect/redirect";
import SelectFrame from "./Views/SelectFrame";
import Welcome from "./Views/Welcome";
import PrintSuccess from "../src/component/PrintSuccess"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/PhotoUpload" element={<PhotoUpload />} />
        <Route path="/CameraView" element={<CameraView />} />
        <Route path="/QRCode" element={<QRCode />} />
        <Route path="/SelectFrame" element={<SelectFrame />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Redirect" element={<Redirect />} />
        <Route path="/PrintSuccess" element={<PrintSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
