import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3031 });
let todos = [
  { id: 1, text: "Read message event", done: false },
  { id: 2, text: "Invalidate todos query", done: false },
];

function broadcast(payload) {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
}

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.type === "toggle") {
      todos = todos.map((todo) =>
        todo.id === msg.id ? { ...todo, done: !todo.done } : todo
      );
      broadcast(["todos"]);
    }
  });
  socket.send(JSON.stringify(["hello"]));
});

console.log("WebSocket server running on ws://localhost:3031");
