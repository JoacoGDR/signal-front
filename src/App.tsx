import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Connections } from "./pages/Connections/Connections";
import { Inbox } from "./pages/Inbox/Inbox";
import { LeadDetail } from "./pages/LeadDetail/LeadDetail";
import { Leads } from "./pages/Leads/Leads";
import { Login } from "./pages/Login/Login";
import { OAuthCallback } from "./pages/OAuthCallback/OAuthCallback";
import { DataDeletion } from "./pages/Legal/DataDeletion";
import { PrivacyPolicy } from "./pages/Legal/PrivacyPolicy";
import { TermsOfService } from "./pages/Legal/TermsOfService";
import { Register } from "./pages/Register/Register";
import { LandingPage } from "./landing/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/app/oauth/callback/:platform"
          element={<OAuthCallback />}
        />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:leadId" element={<LeadDetail />} />
          <Route path="connections" element={<Connections />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
