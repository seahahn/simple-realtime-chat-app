import bcrypt from "bcryptjs";
import {db} from "./db.server";
import {createCookieSessionStorage, redirect} from "@remix-run/node";
import {HASH_SALT, SESSION_SECRET, USER_SESSION_KEY} from "~/constants/envs.server";

interface SignInForm {
  email: string;
  password: string;
}

interface SignUpForm extends SignInForm {
  nickname: string;
}

interface UpdateUserForm extends Omit<SignUpForm, "password"> {
  newPassword: string;
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

/**
 * Redirects the user to the sign in page if they need to sign in
 * This function is used for preventing unauthorized user from accessing the pages which needs user session
 */
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/signin?${searchParams}`);
  }
  return userId;
}

/**
 * Redirects the user to the home page if they are signed in
 * This function is used for preventing signed-in users from accessing the sign in, sign up and reset-password pages
 */
export async function preventSignedInUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  if (userId) return redirect("/");
  return null;
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

export async function updateUser({email, newPassword, nickname}: UpdateUserForm) {
  const user = await db.user.findUnique({
    where: {email},
  });
  if (!user) return null;

  const data: {nickname?: string; password?: string} = {};

  if (nickname) data.nickname = nickname;

  if (newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, HASH_SALT);
    data.password = passwordHash;
  }

  const updatedUser = await db.user.update({
    where: {id: user.id},
    data,
    select: {id: true, email: true, nickname: true},
  });
  return updatedUser;
}

export async function deleteUser(email: string) {
  const user = await db.user.findUnique({
    where: {email},
  });
  if (!user) return null;

  const deletedUser = await db.user.delete({
    where: {id: user.id},
    select: {id: true, email: true, nickname: true},
  });
  return deletedUser;
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

export async function checkUserNickname(nickname: string, email?: string) {
  const userExists = await db.user.findUnique({
    where: {nickname},
  });

  // If email is provided, check if the user with the given email has the same nickname
  if (email && userExists?.email === email) return false;

  return userExists ? true : false;
}

export async function checkUserPassword(email: string, password: string) {
  const user = await db.user.findUnique({
    where: {email},
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  return isCorrectPassword ? true : false;
}

export async function signUp({email, password, nickname}: SignUpForm) {
  const passwordHash = await bcrypt.hash(password, HASH_SALT);
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
