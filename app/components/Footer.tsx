import {Link} from "@remix-run/react";

const Footer = () => {
  return (
    <footer className="px-4 py-12 border-t flex justify-center">
      <div className="container flex flex-col gap-2 w-full md:flex-row md:items-center md:justify-between lg:gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">© 2023 Gyeongho Ahn.</span>
          All rights reserved.
        </div>
        <nav className="flex gap-4 md:gap-8">
          <Link className="text-sm text-gray-500 dark:text-gray-400" to="#">
            Terms
          </Link>
          <Link className="text-sm text-gray-500 dark:text-gray-400" to="#">
            Privacy
          </Link>
          <Link className="text-sm text-gray-500 dark:text-gray-400" to="#">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
