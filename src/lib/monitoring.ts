import axios from 'axios';
import { toast } from 'sonner';

/**
 * Global Monitoring Gateway (KONY-83 OS Monitoring)
 * Unified interface for UI notifications, background tracking, and error management.
 */
export const monitor = {
  /**
   * Tracks events and displays UI notifications for critical system updates.
   */
  async track(event: string, icon: string, description: string, tags: Record<string, string> = {}) {
    // Background tracking to database
    try {
      axios.post('/api/monitor/track', { event, description, icon, tags });
    } catch (e) {
      console.warn('[MONITOR] Backend logging unreachable');
    }

    // UI Notification for significant events
    if (tags.priority === 'high' || tags.priority === 'critical') {
      toast(`${icon} ${event}`, {
        description: description,
        duration: 5000,
      });
    } else {
      console.log(`[MONITOR] ${icon} ${event}: ${description}`);
    }
  },

  /**
   * Logs errors, triggers UI alerts, and initiates background recovery pulses.
   */
  async error(error: Error | string, context: Record<string, any> = {}) {
    const message = error instanceof Error ? error.message : error;
    console.error(`[CRITICAL-ALARM] ${message}`, context);
    
    // Immediate UI Alert
    toast.error('Neural Fracture Detected', {
      description: message,
      action: {
        label: 'Heal',
        onClick: () => console.log('Manual healing trigger')
      }
    });

    try {
      await axios.post('/api/system/report-error', { error: message, context });
    } catch (e) {
      console.warn('[MONITOR] Error reporting unreachable');
    }
  },

  /**
   * Performance logging for UI analytics
   */
  logAIMove(model: string, tokens: number, cost: number) {
    this.track('AI_MOVE', '🧠', `Model: ${model} | Move Executed`, { 
      model, 
      tokens: String(tokens), 
      cost: String(cost),
      priority: 'low' 
    });
  }
};
