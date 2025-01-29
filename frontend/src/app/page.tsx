"use client";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Result from "./components/form/Result";
import Step1 from "./components/form/Step1";
import "./state/store";

export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step1 />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
