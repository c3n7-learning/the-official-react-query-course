import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useWebsocketQueryInvalidate() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3031");
    const handleMessage = (event) => {
      const queryKey = JSON.parse(event.data);
      if (Array.isArray(queryKey) && queryKey.length > 0) {
        queryClient.invalidateQueries({ queryKey });
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, [queryClient]);
}
