import { useEffect } from "react";

export default function useWebsocketQueryInvalidate() {
  useEffect(() => {
    // TODO: use useQueryClient and invalidate query keys from message payloads
    const socket = new WebSocket("ws://localhost:3031");
    return () => socket.close();
  }, []);
}
