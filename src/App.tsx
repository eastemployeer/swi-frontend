import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import SerpPage from "./views/SerpPage";
import NotFoundPage from "./views/NotFoundPage";
import ArticlePage from "./views/ArticlePage";
import Layout from "./layout/Layout";
import "./App.scss";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/search" element={<Layout><SerpPage /></Layout>} />
        <Route path="/article/:id" element={<Layout><ArticlePage /></Layout>} />
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </>
  );
}
