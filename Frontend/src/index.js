import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Books from "./pages/Books";
import ShoppingCart from "./pages/ShoppingCart";
import Seller from "./pages/Seller";
import Orders from "./pages/Orders";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Books />} />
      <Route path="/livros" element={<Books />} />
      <Route path="/carrinho-de-compras" element={<ShoppingCart />} />
      <Route path="/vendas" element={<Seller />} />
      <Route path="/pedidos" element={<Orders />} />
    </Routes>
  </BrowserRouter>
);
