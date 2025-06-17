import "./App.css";
import { Link, Outlet } from "@tanstack/react-router";

export function App() {
  return (
    <>
      <h1>Hello World</h1>
      <Outlet />
      <footer className="mt-5">
        <Link to="/" className="mr-10">Home</Link>
        <Link to="/users/$username" params={{ username: "messi" }}>User Profile</Link>
      </footer>
    </>
  );
}
