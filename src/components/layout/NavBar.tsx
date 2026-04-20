import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";

const MAIN_NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/learningpool", label: "Pool" },
  { to: "/resources", label: "Resources" },
  { to: "/ai-path", label: "AI" },
  { to: "/plan", label: "Plan" },
  { to: "/about", label: "About" },
  { to: "/updates", label: "Updates" },
];

function isActivePath(prefix: string, pathname: string) {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export function NavBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, isAuthed } = useAuthStore();

  return (
    <header className="border-b border-stone-200 sticky top-0 bg-stone-50/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3">
            <img src="/favicon.png" alt="LearnPathly" className="h-8 w-8" />
            <span className="font-serif text-2xl font-bold tracking-tight">
              Learn<span className="text-blue-400">Pathly</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {MAIN_NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-400 after:origin-left after:transition-transform ${
                  isActivePath(link.to, pathname)
                    ? "after:scale-x-100 text-stone-900"
                    : "after:scale-x-0 hover:after:scale-x-100 text-stone-500 hover:text-stone-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {isAuthed ? (
              <Link
                to="/account"
                className="text-sm font-medium tracking-wide text-stone-600 hover:text-blue-400 transition-colors"
              >
                {user?.username || "Account"}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium tracking-wide text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-400 text-stone-900 px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-blue-300 transition-colors duration-200 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
