/**
 * KONY-83 OS - Neural Processing Web Worker
 * Offloads heavy data computation and JSON transformations from the Main Thread.
 */
self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_LEADS') {
    try {
      // High-Precision Data Refinery Logic
      let items = payload;
      if (!Array.isArray(payload)) {
        if (payload && typeof payload === 'object') {
          // Try to find any array property
          const arrayProp = Object.values(payload).find(val => Array.isArray(val));
          if (arrayProp) {
            items = arrayProp;
          } else {
            // If it's a single object, wrap it in an array
            items = [payload];
          }
        } else {
          throw new Error('Invalid payload format: Expected an array or object containing leads.');
        }
      }

      const seenUrls = new Set<string>();
      const processed = items
        .filter((item: any) => {
          if (!item.url || seenUrls.has(item.url)) return false;
          seenUrls.add(item.url);
          return true;
        })
        .map((item: any) => {
          // High-precision score amplification logic
          const intentWeight = 0.45;
          const relevanceWeight = 0.25;
          const urgencyWeight = 0.15;
          const authorityWeight = 0.15;

          const composite = (
            (item.intentScore || 0) * intentWeight + 
            (item.relevanceScore || 0) * relevanceWeight + 
            (item.urgencyScore || 0) * urgencyWeight + 
            (item.authorityScore || 0) * authorityWeight
          );
          
          // Data Normalization & Sanitization
          const sanitizedContent = (item.content || '').trim().replace(/\s+/g, ' ');

          return {
            ...item,
            content: sanitizedContent,
            compositeScore: Number(composite.toFixed(3)),
            processedAt: Date.now(),
            // ALWAYS generate a unique ID to prevent React duplicate key warnings
            id: `L-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          };
        });

      // Sort by high-intent signal clusters
      processed.sort((a: any, b: any) => b.compositeScore - a.compositeScore);

      self.postMessage({ type: 'COMPLETE', payload: processed });
    } catch (error: any) {
      self.postMessage({ type: 'ERROR', message: error.message });
    }
  }

  if (type === 'HYDRATE_CONTEXT') {
    // Heavy string manipulation and semantic clustering
    const context = payload.text;
    const tokens = context.toLowerCase().split(/\s+/);
    const uniqueTokens = Array.from(new Set(tokens)).length;
    
    self.postMessage({ 
      type: 'HYDRATION_COMPLETE', 
      payload: { 
        tokens: tokens.length, 
        uniqueTokens,
        density: (uniqueTokens / tokens.length).toFixed(4)
      } 
    });
  }
};
