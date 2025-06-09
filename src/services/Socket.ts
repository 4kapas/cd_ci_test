// socket.ts
import { CONFIG } from "@/config";
import { io } from "socket.io-client";

const socket = io(CONFIG.BASE_URL, {
  path: "/detector/socket.io",
  autoConnect: false,
});
export default socket;
