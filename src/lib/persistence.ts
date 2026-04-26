/**
 * F-C Persistence Layer
 * Ensures the intelligence engine retains data clusters across reloads.
 */

export class FCPersistence {
  static saveLeads(leads: any[]) {
    localStorage.setItem('fc_leads_vault', JSON.stringify(leads.slice(0, 200))); // Limit to 200 for storage safety
  }

  static loadLeads(): any[] {
    const data = localStorage.getItem('fc_leads_vault');
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveSearchState(state: any) {
    localStorage.setItem('fc_search_state', JSON.stringify(state));
  }

  static loadSearchState() {
    const data = localStorage.getItem('fc_search_state');
    return data ? JSON.parse(data) : null;
  }
}
