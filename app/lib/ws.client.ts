import io from "socket.io-client";

export function connect(url: string) {
  return io(url);
}
