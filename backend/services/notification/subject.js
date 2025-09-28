class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(event, data) {
    console.log("📢 Subject.notify() called with data:", data);
    this.observers.forEach((observer, i) => {
      console.log(`➡️ Notifying observer[${i}] of type:`, observer.constructor.name);
      observer.update(event,data);
    });
  }
}

module.exports =  new Subject();