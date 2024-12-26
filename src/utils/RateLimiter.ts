class RateLimiter {
  private static instance: RateLimiter;
  private nextAvailableTime: number = Date.now();

  private constructor() {}

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  async waitForRateLimit(): Promise<void> {
    const currentTime = Date.now();
    if (currentTime < this.nextAvailableTime) {
      const waitTime = this.nextAvailableTime - currentTime;
      console.log(`Rate limit reached, waiting for ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  setNextAvailableTime(delayMs: number): void {
    this.nextAvailableTime = Date.now() + delayMs;
  }
}
