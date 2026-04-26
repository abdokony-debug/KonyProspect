import { monitor } from './monitoring';

export enum CircuitState {
  CLOSED, // Normal operation
  OPEN,   // Error threshold reached, blocking requests
  HALF_OPEN // Testing if system has recovered
}

/**
 * Advanced Circuit Breaker & Exponential Backoff Handler
 * Prevents UI freezes and handles 429 errors gracefully.
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastErrorTime: number = 0;
  private threshold: number = 3;
  private recoveryTimeout: number = 30000; // 30s

  constructor(private name: string) {}

  /**
   * Executes a mission with built-in protection and backoff
   */
  async execute<T>(mission: () => Promise<T>, retryLimit: number = 3): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastErrorTime > this.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`[CIRCUIT-BREAKER] ${this.name}: Transitioning to HALF_OPEN (Probing recovery)`);
      } else {
        throw new Error(`[CIRCUIT-BREAKER] ${this.name} is currently OPEN (Protection Mode). System is resting.`);
      }
    }

    let lastError: any;
    for (let attempt = 0; attempt <= retryLimit; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.warn(`[CIRCUIT-BREAKER] ${this.name}: Rate limit (429) detected. Exponential Backoff: ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
        }

        const result = await mission();
        
        // On success
        if (this.state !== CircuitState.CLOSED) {
          console.log(`[CIRCUIT-BREAKER] ${this.name}: Restored to CLOSED state.`);
          this.state = CircuitState.CLOSED;
          this.failures = 0;
        }
        return result;

      } catch (error: any) {
        lastError = error;
        
        // Check for 429 Rate Limit
        const isRateLimit = error.message?.includes('429') || error.status === 429;
        
        if (isRateLimit) {
          monitor.track('RATE_LIMIT_HIT', '⏳', `Provider rate limit reached for ${this.name}.`, { attempt: String(attempt) });
          // Force next iteration for backoff
          continue; 
        }

        this.failures++;
        if (this.failures >= this.threshold) {
          this.trip();
        }
        
        // Critical failures (non-rate-limit) should likely stop early unless minor
        if (attempt === retryLimit) break;
      }
    }

    throw lastError;
  }

  private trip() {
    this.state = CircuitState.OPEN;
    this.lastErrorTime = Date.now();
    monitor.track('CIRCUIT_TRIPPED', '🛡️', `Neural Circuit Breaker "${this.name}" tripped. Protection enabled.`, { failures: String(this.failures) });
    console.error(`[CIRCUIT-BREAKER] ${this.name}: TRIPPED. System frozen for protection.`);
  }

  getState() {
    return this.state;
  }
}

// Global Clusters
export const aiCircuit = new CircuitBreaker('AI_CLUSTER');
export const crawlCircuit = new CircuitBreaker('CRAWL_CLUSTER');
export const edgeCircuit = new CircuitBreaker('EDGE_CLUSTER');
