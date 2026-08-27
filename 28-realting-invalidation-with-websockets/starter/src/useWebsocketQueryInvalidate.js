import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useWebsocketQueryInvalidate() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // TODO: use useQueryClient and invalidate query keys from message payloads
    const socket = new WebSocket("ws://localhost:3031");
    const handleMessage = (e) => {
      const queryKey = JSON.parse(e.data);

      if (Array.isArray(queryKey) && queryKey.length > 0) {
        queryClient.invalidateQueries({ queryKey });
      }

      console.log(queryKey);
    }
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.close()
    };
  }, [queryClient]);
}
