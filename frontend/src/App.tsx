import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthPageWrapper } from "./components/auth/AuthPageWrapper";
import { ProtectedRoutes } from "./components/auth/ProtectedRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPageWrapper />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
