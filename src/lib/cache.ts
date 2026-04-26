import axios from 'axios';

/**
 * High-Speed Intelligence Persistence Layer
 * Uses an in-memory mirror for <1ms response time and server-side persistence.
 */
class IntelligenceCache {
  private localMirror = new Map<string, { value: any, expires: number }>();

  /**
   * Retrieves results from memory or the persistent backend
   */
  async get<T>(key: string): Promise<T | null> {
    // 1. Memory Check (Ultra-Fast)
    const mem = this.localMirror.get(key);
    if (mem && mem.expires > Date.now()) {
      return mem.value as T;
    }

    // 2. Server/Database Check
    try {
      const response = await axios.post('/api/cache/get', { key });
      const val = response.data.value;
      if (val) {
        // Hydrate memory
        this.localMirror.set(key, { value: val, expires: Date.now() + 3600 * 1000 });
        return val as T;
      }
      return null;
    } catch (e) {
      console.error("[CACHE-ERROR] Persistence layer unreachable:", e);
      return null;
    }
  }

  /**
   * Persists results across sessions
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const expires = Date.now() + ttl * 1000;
    
    // Update local mirror
    this.localMirror.set(key, { value, expires });

    // Update persistent backend
    try {
      await axios.post('/api/cache/set', { key, value, ttl });
    } catch (e) {
      console.error("[CACHE-ERROR] Persistence layer write failed:", e);
    }
  }

  /**
   * Utility for generating deterministic keys
   */
  generateKey(query: string, context: Record<string, any> = {}): string {
    const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const contextHash = btoa(JSON.stringify(context)).slice(0, 10);
    return `${cleanQuery}:${contextHash}`;
  }
}

export const cache = new IntelligenceCache();
