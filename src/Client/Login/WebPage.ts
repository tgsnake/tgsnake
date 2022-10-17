class BetterPromise<T> {
  promise!: Promise<T>;
  reject!: any;
  resolve!: any;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
