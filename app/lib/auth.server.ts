import bcrypt from "bcryptjs";
import {db} from "./db.server";
import {createCookieSessionStorage, redirect} from "@remix-run/node";
import {SESSION_SECRET, USER_SESSION_KEY} from "~/constants/envs";

interface SignInForm {
  email: string;
  password: string;
}

interface SignUpForm extends SignInForm {
  nickname: string;
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "Sailrs_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, remember: boolean, redirectTo: string) {
  const session = await storage.getSession();
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session, {
        // if remember is true, the session will persist for 7 days
        // if remember is false, the session will persist for the browser session
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
      }),
    },
  });
}
export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") return null;

  try {
    const user = await db.user.findUnique({
      where: {id: userId},
      select: {id: true, email: true, nickname: true},
    });
    return user;
  } catch {
    throw signOut(request);
  }
}

/**
 * Check if the user with the given email exists in the database
 * @param email - email of the user to check
 * @returns true if user exists, false otherwise
 */
export async function checkUserEmail(email: string) {
  const userExists = await db.user.findUnique({
    where: {email},
  });

  return userExists ? true : false;
}

export async function checkUserNickname(nickname: string) {
  const userExists = await db.user.findUnique({
    where: {nickname},
  });

  return userExists ? true : false;
}

export async function signUp({email, password, nickname}: SignUpForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {email, password: passwordHash, nickname},
  });
  return {id: user.id, email};
}

export async function signIn({email, password}: SignInForm) {
  const user = await db.user.findUnique({
    where: {email},
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return null;

  return {id: user.id, email: user.email, nickname: user.nickname};
}

export async function signOut(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
