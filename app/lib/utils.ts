import {json} from "@remix-run/node";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateUrl(url: string) {
  const urls = ["/"];
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}
export const badRequest = <T>(data: T) => json(data, {status: 400});
