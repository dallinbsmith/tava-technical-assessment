import { Link, Outlet } from "react-router-dom";
import tavaLogo from "../assets/tava-logo.svg";

const Layout = () => (
  <div className="min-h-screen bg-base">
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={tavaLogo} className="h-8 w-auto" alt="Tava Health" />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-2 text-primary">
              <span className="font-semibold">Employee Management</span>
            </div>
          </Link>
          <a
            href="https://tavahealth.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted hover:text-sky-400 transition-colors"
          >
            tavahealth.com
          </a>
        </div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
  </div>
);

export default Layout;
