import io from "socket.io-client";
import {SOCKET_SERVER_URL} from "~/constants/envs";

export function connect() {
  return io(SOCKET_SERVER_URL);
}
