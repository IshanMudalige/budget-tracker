class BaseHandler {
  constructor(transaction,userId) {
    this.transaction = transaction;
    this.userId = userId;
  }

  process() {
    throw new Error("must be implemented by subclass");
  }
}

module.exports = BaseHandler;








