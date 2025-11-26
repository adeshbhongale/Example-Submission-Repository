import { EventEmitter } from "events";

export const events = {
  BOOK_ADDED: "BOOK_ADDED",
};

class PubSub extends EventEmitter {
  asyncIterator(eventName) {
    return {
      next: () =>
        new Promise((resolve) => {
          this.once(eventName, (payload) => {
            resolve({ value: payload, done: false });
          });
        }),
      return: () => Promise.resolve({ value: undefined, done: true }),
      throw: (error) => Promise.reject(error),
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  publish(eventName, payload) {
    this.emit(eventName, payload);
  }
}

export const pubsub = new PubSub();
