import stylesheet from "~/tailwind.css";
import type {LinksFunction, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import texts from "./constants/texts";
import {getUser} from "./lib/auth.server";
import {UserSession} from "./constants/types";

export const links: LinksFunction = () => [{rel: "stylesheet", href: stylesheet}];

export const meta: MetaFunction = () => {
  return [{title: texts.APP_NAME}, {name: "description", content: texts.APP_DESCRIPTION}];
};

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({user});
}

export default function App() {
  const {user} = useLoaderData<{user: UserSession}>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <TopBar user={user} />
        <Outlet />
        <Footer />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
