import {Form, Link} from "@remix-run/react";
import {useState} from "react";
import texts from "~/constants/texts";
import {UserSession} from "~/constants/types";

interface PropTypes {
  user: UserSession;
}

const TopBar = ({user}: PropTypes) => {
  return (
    <header className="fixed z-10 w-full h-16 border-b flex items-center justify-center bg-white">
      <div className="container flex items-center justify-between px-4">
        <LeftSide />
        {user?.id ? <NavSide /> : null}
        <RightSide user={user} />
      </div>
    </header>
  );
};

export default TopBar;

const FlagIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
};

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
};

/**
 * This is the left side of the top bar and includes the logo element and the app name.
 */
const LeftSide = () => {
  return (
    <Link className="flex items-center gap-2 text-lg font-semibold" to="/">
      <FlagIcon className="h-6 w-6" />
      <h1 className="hidden md:visible">{texts.APP_NAME}</h1>
    </Link>
  );
};

/**
 * This is the middle side of the top bar and includes the navigation links.
 */
const NavSide = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <>
      <nav className="hidden md:flex flex-1 max-w-2xl justify-center items-center gap-4 text-sm font-medium tracking-wide">
        <Link className="text-gray-900" to="/chat">
          {texts.CHAT_WITH_PEOPLE}
        </Link>
        <Link className="text-gray-900" to="#">
          {texts.CHAT_WITH_AI}
        </Link>
      </nav>
      <nav className="relative md:hidden">
        <button className="md:hidden" onClick={toggleNav}>
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
        {isNavOpen && (
          <div className="absolute top-12 -left-20 w-48 flex flex-col border-2 border-black bg-white rounded-lg p-2 max-w-2xl justify-center items-center gap-4 text-sm font-medium tracking-wide">
            <Link className="text-gray-900" to="/chat">
              {texts.CHAT_WITH_PEOPLE}
            </Link>
            <Link
              className="text-gray-900"
              to="#"
              onClick={() => alert("We're still preparing to release it!")}>
              {texts.CHAT_WITH_AI}
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

/**
 * This is the right side of the top bar and includes the user's nickname and the sign in and sign up links.
 */
const RightSide = ({user}: {user: UserSession}) => {
  return (
    <div className="flex items-center space-x-4">
      {user?.id ? (
        <>
          <Link
            className="text-sm font-medium text-gray-50 bg-gray-900 rounded-md px-3 py-2"
            to="/profile">
            {user.nickname}
          </Link>
          <Form action="/signout" method="post">
            <button className="text-sm font-medium text-gray-900">{texts.SIGN_OUT}</button>
          </Form>
        </>
      ) : (
        <>
          <Link className="text-sm font-medium text-gray-900" to="/signin">
            {texts.SIGN_IN}
          </Link>
          <Link
            className="text-sm font-medium text-gray-50 bg-gray-900 rounded-md px-3 py-2"
            to="/signup">
            {texts.SIGN_UP}
          </Link>
        </>
      )}
    </div>
  );
};
