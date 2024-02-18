import {Link} from "@remix-run/react";

const TopBar = () => {
  return (
    <header className="h-16 border-b flex items-center justify-center">
      <div className="container flex items-center justify-between px-4">
        <Link className="flex items-center gap-2 text-lg font-semibold" to="/">
          <FlagIcon className="h-6 w-6" />
          <span>Ahn</span>
        </Link>
        <nav className="hidden md:flex flex-1 max-w-2xl justify-center items-center gap-4 text-sm font-medium tracking-wide">
          <Link className="text-gray-900" to="#">
            Chat with People
          </Link>
          <Link className="text-gray-900" to="#">
            Chat with AI
          </Link>
        </nav>
        <button className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
        <div className="flex items-center space-x-4">
          <Link className="text-sm font-medium text-gray-900" to="/signin">
            Sign In
          </Link>
          <Link
            className="text-sm font-medium text-gray-50 bg-gray-900 rounded-md px-3 py-2"
            to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
