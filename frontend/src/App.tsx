import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.tsx";
import Admin from "./pages/Admin.tsx";

function App() {
  return (
    <Routes>
      <Route path="/ghumphir/login" element={<Login />} />
      <Route path="/ghumphir/dashboard" element={<Dashboard />} />
      <Route path="/ghumphir/adminnimda" element={<Admin />} />
    </Routes>
  );
}

export default App;
