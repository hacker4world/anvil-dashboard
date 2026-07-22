import { useEffect } from "react";
import { io } from "socket.io-client";
import { base_url } from "@/services/axios.client";
import { toast } from "sonner";

export function useWebSocketNotification() {
  useEffect(() => {
    const socket = io(base_url, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connecté");
    });

    socket.on("notification", (data: { message?: string }) => {
      toast(data.message);
    });

    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion Socket.IO :", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO déconnecté :", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
