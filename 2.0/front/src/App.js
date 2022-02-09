import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from "axios";
import "./App.css";
import Home from "./Home";
import Comeback from './Comeback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/auth" >
            <Route index element={<Home />} />
            <Route path="comeback" element={<Comeback />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}