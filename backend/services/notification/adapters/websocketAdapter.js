class WebSocketAdapter {
  constructor(io) {
    this.io = io;
  }

  send(userId, message) {
    console.log(`WebSocket sent to ${userId}: ${message}`);
    this.io.to(userId.toString()).emit("notification", { message });
    return true;
  }
}

module.exports = WebSocketAdapter;
