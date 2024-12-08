import { path } from "@/app/path";
import { io } from "socket.io-client";

class SocketService {
  constructor(url) {
    this.socket = io(url, { transports: ["websocket"] });
  }

  connect(userId) {
    console.log(userId);
  }

  emit(type, data) {
    this.socket.emit(type, data);
  }

  on(type, callback) {
    this.socket.on(type, callback);
  }

  onChangeScore(callback) { 
    this.socket.on("changeScore", callback)
  }

  disconnect() {
    this.socket.off("disconnect");
    this.socket.off("connect");
    this.socket.off("roomMsg");
  }

  onDisconnect(callback) {
    this.socket.on("disconnect", callback);
  }
}

const socketService = new SocketService(path);
export default socketService;
