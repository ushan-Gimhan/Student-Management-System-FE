import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentsPage from "./pages/StudentsPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;