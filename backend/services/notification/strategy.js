class NotificationStrategy {
  send(message, user) {
    throw new Error("send() must be implemented");
  }
}

class EmailStrategy extends NotificationStrategy {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  send(message, user) {
    return this.adapter.send(user.email, message);
  }
}

class WebSocketStrategy extends NotificationStrategy {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  send(message, user) {
    return this.adapter.send(user.id, message);
  }
}

module.exports = { EmailStrategy, WebSocketStrategy };
