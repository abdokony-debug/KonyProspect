/**
 * F-C بحث عملاء Intelligence System - Diagnostics & Smart Correction Layer
 */

export interface IntelligenceSignal {
  timestamp: string;
  errorId: string;
  type: 'runtime' | 'api' | 'auth' | 'quota';
  context: any;
  suggestion: string;
  autoFixAvailable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class IntelligenceDiagnostics {
  private static instance: IntelligenceDiagnostics;
  private errorHistory: IntelligenceSignal[] = [];

  private constructor() {}

  public static getInstance(): IntelligenceDiagnostics {
    if (!IntelligenceDiagnostics.instance) {
      IntelligenceDiagnostics.instance = new IntelligenceDiagnostics();
    }
    return IntelligenceDiagnostics.instance;
  }

  /**
   * Analyzes an error and provides a smart suggestion based on the F-C Engine specs.
   */
  public analyzeError(error: any, context?: any): IntelligenceSignal {
    // Unwrap LeadGenError if it's the wrapper
    let actualError = error;
    if (error.name === 'LeadGenError' && error.details) {
      actualError = error.details;
    }

    const errorMsg = actualError.message || String(actualError);
    const timestamp = new Date().toISOString();
    const errorId = `ERR-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

    let signal: IntelligenceSignal = {
      timestamp,
      errorId,
      type: 'runtime',
      context,
      suggestion: `System encountered an unhandled signal: ${errorMsg.substring(0, 100)}${errorMsg.length > 100 ? '...' : ''}. Try refreshing your session.`,
      autoFixAvailable: false,
      priority: 'medium'
    };

    // Smart Pattern Matching for F-C Specific Contexts
    if (errorMsg.includes('TypeError')) {
      signal.type = 'runtime';
      signal.priority = 'critical';
      signal.suggestion = 'CRITICAL: Structural Engine Fault (TypeError). This usually indicates a broken interface or mismatched SDK protocols.';
    } else if (errorMsg.includes('JSON') || errorMsg.includes('SyntaxError')) {
      signal.type = 'runtime';
      signal.priority = 'medium';
      signal.suggestion = 'Neural parsing failed. The intelligence stream returned malformed JSON. Initiating semantic repair.';
      signal.autoFixAvailable = true;
    } else if (errorMsg.includes('GEMINI_API_KEY') || errorMsg.includes('apiKey')) {
      signal.type = 'auth';
      signal.priority = 'critical';
      signal.suggestion = 'CRITICAL: AI Authentication Failure. Verify GEMINI_API_KEY in the Secrets panel.';
    } else if (errorMsg.includes('quota') || errorMsg.includes('429')) {
      signal.type = 'quota';
      signal.priority = 'high';
      signal.suggestion = 'Pro-tier rate limit reached. Auto-switching to high-speed Flash tier for higher reliability.';
      signal.autoFixAvailable = true;
    } else if (errorMsg.includes('CRYPTO_KEY')) {
      signal.type = 'api';
      signal.priority = 'high';
      signal.suggestion = 'Campaign module requires CRYPTO_KEY. Configure this in deployment environment variables.';
    } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      signal.type = 'api';
      signal.priority = 'medium';
      signal.suggestion = 'Unstable uplink. Attempting to reroute through secondary proxy layer.';
      signal.autoFixAvailable = true;
    } else if (errorMsg.includes('empty response') || errorMsg.includes('no leads') || errorMsg.includes('null')) {
      signal.type = 'runtime';
      signal.priority = 'medium';
      signal.suggestion = 'Target density is low. Switching to Deep Spider Recursive strategy to bypass empty nodes.';
      signal.autoFixAvailable = true;
    } else if (errorMsg.includes('Safety') || errorMsg.includes('safetySettings') || errorMsg.includes('blocked')) {
      signal.type = 'runtime';
      signal.priority = 'high';
      signal.suggestion = 'Neural block detected by Safety Filters. Mutating semantic query to maintain extraction without violation.';
      signal.autoFixAvailable = true;
    }

    this.errorHistory.push(signal);
    if (this.errorHistory.length > 50) this.errorHistory.shift(); // Keep last 50

    return signal;
  }

  public getHistory(): IntelligenceSignal[] {
    return this.errorHistory;
  }

  /**
   * Identifies recurring patterns to "learn" from session failures
   */
  public getStrategicAdjustment(): string | null {
    if (this.errorHistory.length < 3) return null;
    
    // Check if the last 3 errors are the same type
    const lastThree = this.errorHistory.slice(-3);
    const types = new Set(lastThree.map(s => s.type));
    
    if (types.size === 1) {
      const type = Array.from(types)[0];
      if (type === 'quota') return 'STRATEGY: Extreme Extraction Depth detected as bottleneck. Reducing scan intensity to 30%.';
      if (type === 'api') return 'STRATEGY: Persistent API endpoint failures. Check backend server availability.';
    }
    
    return null;
  }

  /**
   * Logs a message to the internal diagnostics buffer.
   */
  public log(msg: string, level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' = 'INFO') {
    const timestamp = new Date().toISOString();
    const mockSignal: IntelligenceSignal = {
      timestamp,
      errorId: `LOG-${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
      type: 'runtime',
      context: { msg },
      suggestion: msg,
      autoFixAvailable: false,
      priority: level === 'CRITICAL' ? 'critical' : level === 'ERROR' ? 'high' : 'low'
    };
    this.errorHistory.push(mockSignal);
    if (this.errorHistory.length > 50) this.errorHistory.shift();
    console.log(`[DIAGNOSTICS-${level}] ${msg}`);
  }
}

export const diagnostics = IntelligenceDiagnostics.getInstance();
