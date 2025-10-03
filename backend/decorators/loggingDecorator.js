// DECORATOR PATTERN
// This decorator adds logging functionality to an existing handler.
class LoggingDecorator {
  constructor(handler) {
    this.handler = handler;
  }

  async process(data) {
    console.log("[LOG] Input:", data);
    const result = await this.handler.process(data);
    console.log("[LOG] Output:", result);
    return result;
  }
}

module.exports = LoggingDecorator;
