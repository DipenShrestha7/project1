import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId} locale="en">
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </BrowserRouter>,
);
