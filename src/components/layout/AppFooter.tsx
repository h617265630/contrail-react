import { Link } from "react-router-dom";

export function AppFooter() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-stone-200 bg-stone-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/home" className="flex items-center gap-2">
          <img src="/favicon.png" alt="LearnPathly" className="h-6 w-6" />
          <span className="font-serif text-xl font-bold">
            Learn<span className="text-blue-500">Pathly</span>
          </span>
        </Link>
        <p className="text-sm text-stone-500">
          AI & IT learning platform. Built for self-learning developers.
        </p>
        <div className="flex gap-8">
          <Link to="/about" className="text-sm font-medium tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
            About
          </Link>
          <Link to="/resources" className="text-sm font-medium tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
            Resources
          </Link>
          <Link to="/updates" className="text-sm font-medium tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
            Updates
          </Link>
        </div>
      </div>
    </footer>
  );
}
