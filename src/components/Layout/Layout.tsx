import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import "./Layout.css";

export function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}
