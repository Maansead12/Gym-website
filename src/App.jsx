import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDetails from "./pages/MemberDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/programs"
          element={<ProgramsPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/members/:id"
          element={<MemberDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;