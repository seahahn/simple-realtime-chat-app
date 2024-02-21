import {Form, Link} from "@remix-run/react";
import {useState} from "react";
import texts from "~/constants/texts";
import {UserSession} from "~/constants/types";
import {LuShip} from "react-icons/lu";
import {CgMenu, CgProfile} from "react-icons/cg";

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

/**
 * This is the left side of the top bar and includes the logo element and the app name.
 */
const LeftSide = () => {
  return (
    <Link className="flex items-center gap-2 text-lg font-semibold" to="/">
      <LuShip className="h-6 w-6" />
      <h1 className="hidden md:block">{texts.APP_NAME}</h1>
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
      {/* Desktop, tablet nav */}
      <nav className="hidden md:flex flex-1 max-w-2xl justify-center items-center gap-4 text-sm font-medium tracking-wide">
        <Link className="text-gray-900" to="/chat">
          {texts.CHAT_WITH_PEOPLE}
        </Link>
        <Link className="text-gray-900" to="#">
          {texts.CHAT_WITH_AI}
        </Link>
      </nav>

      {/* Mobile nav */}
      <nav className="relative md:hidden">
        <button className="md:hidden" onClick={toggleNav}>
          <CgMenu className="h-6 w-6" />
        </button>
        {isNavOpen ? (
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
        ) : null}
      </nav>
    </>
  );
};

/**
 * This is the right side of the top bar and includes the user's nickname and the sign in and sign up links.
 */
const RightSide = ({user}: {user: UserSession}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <CgProfile className="h-6 w-6 md:hidden" onClick={toggleMenu} />

      <div
        className={`${isMenuOpen ? "flex" : "hidden"} absolute top-8 right-0 flex-col justify-center items-center border-2 border-black bg-white rounded-lg p-2 md:static md:flex md:flex-row md:space-x-4 md:border-0`}>
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
    </div>
  );
};
