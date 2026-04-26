import { PuppeteerCrawler, ProxyConfiguration, RequestList } from 'crawlee';
import puppeteer from 'puppeteer-core';

/**
 * F-C بحث عملاء Deep Intelligence Scraper
 * Powered by Crawlee + Puppeteer
 */
export async function runDeepScrape(urls: string[]) {
  const browserWSEndpoint = process.env.REMOTE_BROWSER_WS_ENDPOINT;
  
  if (!browserWSEndpoint) {
    console.warn('[SCRAPER] REMOTE_BROWSER_WS_ENDPOINT not configured. Falling back to internal (might fail in restricted environments).');
  }

  const results: any[] = [];

  const crawler = new PuppeteerCrawler({
    // We use launchContext to pass our custom puppeteer connect logic if we have an endpoint
    launchContext: {
      launcher: puppeteer,
      launchOptions: browserWSEndpoint ? {
        browserWSEndpoint: browserWSEndpoint,
      } : {
        // If no endpoint, we assume local installation (Puppeteer default)
        // Note: In Cloud Run, you usually need specific buildpacks or Dockerfile setup for this.
        headless: true,
      } as any,
    },
    
    // Max requests to process per crawl
    maxRequestsPerCrawl: 50,
    
    // Handle the page processing
    async requestHandler({ page, request, log }) {
      log.info(`Processing ${request.url}...`);
      
      // Wait for content
      await page.waitForSelector('body');
      
      // Extract data
      const data = await page.evaluate(() => {
        return {
          title: document.title,
          text: document.body.innerText.slice(0, 1000),
          links: Array.from(document.querySelectorAll('a')).slice(0, 5).map(a => a.href),
        };
      });

      results.push({
        url: request.url,
        data,
      });
    },

    // Handle failed requests
    failedRequestHandler({ request, log }) {
      log.error(`Request ${request.url} failed after retries.`);
    },
  });

  await crawler.run(urls);
  
  return results;
}
