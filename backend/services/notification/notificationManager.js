const { Observer } = require("./observer");

class NotificationManager extends Observer {
  constructor(strategy) {
    super();
    this.strategy = strategy;
  }

  update(event, data) {
    if (event === "BUDGET_EXCEEDED") {
      const { user, message } = data;
      this.strategy.send(message, user);
    }
  }
}

module.exports = NotificationManager;
