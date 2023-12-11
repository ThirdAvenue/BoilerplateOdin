type Event = {
  type: string;
  data: any;
};
type Callback = (event: Event) => void;

export class EventDispatcher {
  private eventMap: Map<string, Callback[]> = new Map();

  public subscribe(eventName: string, callback: Callback) {
    const callbacks = this.eventMap.get(eventName);

    if (!callbacks) this.eventMap.set(eventName, [callback]);
    else this.eventMap.set(eventName, [...callbacks, callback]);
  }

  public unsubscribe(eventName: string, callback: Callback) {
    const callbacks = this.eventMap.get(eventName);
    this.eventMap.set(eventName, callbacks?.filter((c: Callback) => c !== callback) ?? []);
  }

  public emit(eventName: string, event: Event) {
    const callbacks = this.eventMap.get(eventName);
    if (callbacks) callbacks.forEach((callback: Callback) => callback(event));
  }

  public clear() {
    this.eventMap.clear();
  }
}
