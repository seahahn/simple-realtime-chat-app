import stylesheet from "~/tailwind.css";
import type {LinksFunction, MetaFunction} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import texts from "./constants/texts";

export const links: LinksFunction = () => [{rel: "stylesheet", href: stylesheet}];

export const meta: MetaFunction = () => {
  return [{title: texts.APP_NAME}, {name: "description", content: texts.APP_DESCRIPTION}];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <TopBar />
        <Outlet />
        <Footer />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
