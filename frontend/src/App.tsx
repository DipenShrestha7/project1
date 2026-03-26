import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.tsx";
import Admin from "./pages/Admin.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/adminnimda" element={<Admin />} />
    </Routes>
  );
}

export default App;
