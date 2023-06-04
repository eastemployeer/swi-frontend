import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import SerpPage from "./views/SerpPage";
import NotFoundPage from "./views/NotFoundPage";
import "./App.scss";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SerpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
