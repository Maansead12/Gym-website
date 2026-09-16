import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import Login from "./pages/Login"; import Signup from "./pages/Signup";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;