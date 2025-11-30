import axios from 'axios';

interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
  formattedUrl?: string;
}

interface GoogleCustomSearchResponse {
  items?: GoogleSearchResult[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
}

export interface LegalSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore?: number;
}

export class GoogleCustomSearchService {
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor() {
    this.apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || '';
    // You'll need to create a Custom Search Engine ID at: https://programmablesearchengine.google.com/
    this.searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || '';

    if (!this.apiKey) {
      console.warn('Google Custom Search API key not configured');
    }
    if (!this.searchEngineId) {
      console.warn('Google Custom Search Engine ID not configured. Create one at https://programmablesearchengine.google.com/');
    }
  }

  /**
   * Perform legal research using Google Custom Search API
   * @param query - The search query
   * @param options - Search options
   */
  async searchLegal(
    query: string,
    options: {
      numResults?: number;
      dateRestrict?: string; // e.g., 'd7' for last 7 days, 'm6' for last 6 months
      siteSearch?: string; // Restrict to specific domains
      exactTerms?: string;
      excludeTerms?: string;
    } = {}
  ): Promise<LegalSearchResult[]> {
    if (!this.apiKey || !this.searchEngineId) {
      throw new Error('Google Custom Search not configured properly');
    }

    try {
      const params: any = {
        key: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        num: options.numResults || 10,
        // Safe search for professional legal content
        safe: 'active',
      };

      // Add optional parameters
      if (options.dateRestrict) {
        params.dateRestrict = options.dateRestrict;
      }
      if (options.siteSearch) {
        params.siteSearch = options.siteSearch;
        params.siteSearchFilter = 'i'; // include only this site
      }
      if (options.exactTerms) {
        params.exactTerms = options.exactTerms;
      }
      if (options.excludeTerms) {
        params.excludeTerms = options.excludeTerms;
      }

      const response = await axios.get<GoogleCustomSearchResponse>(
        this.baseUrl,
        { params }
      );

      if (!response.data.items || response.data.items.length === 0) {
        return [];
      }

      // Transform Google results to our format
      return response.data.items.map((item, index) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        source: item.displayLink || new URL(item.link).hostname,
        relevanceScore: 1 - (index / response.data.items!.length), // Higher score for earlier results
      }));
    } catch (error: any) {
      console.error('Google Custom Search error:', error.response?.data || error.message);
      throw new Error(`Search failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Search case law from specific legal databases
   */
  async searchCaseLaw(
    query: string,
    jurisdiction?: string
  ): Promise<LegalSearchResult[]> {
    // Focus on authoritative legal sources
    const legalSites = [
      'law.cornell.edu',
      'courtlistener.com',
      'justia.com',
      'casetext.com',
      'leagle.com',
    ].join(' OR site:');

    const enhancedQuery = jurisdiction 
      ? `${query} ${jurisdiction} site:${legalSites}`
      : `${query} site:${legalSites}`;

    return this.searchLegal(enhancedQuery, {
      numResults: 10,
    });
  }

  /**
   * Search statutes and regulations
   */
  async searchStatutes(
    query: string,
    jurisdiction?: string
  ): Promise<LegalSearchResult[]> {
    const statuteSites = [
      'law.cornell.edu/uscode',
      'law.cornell.edu/cfr',
      'gpo.gov',
      'congress.gov',
    ].join(' OR site:');

    const enhancedQuery = jurisdiction
      ? `${query} ${jurisdiction} site:${statuteSites}`
      : `${query} site:${statuteSites}`;

    return this.searchLegal(enhancedQuery, {
      numResults: 10,
    });
  }

  /**
   * Search legal articles and secondary sources
   */
  async searchLegalArticles(query: string): Promise<LegalSearchResult[]> {
    const articleSites = [
      'scholar.google.com',
      'ssrn.com',
      'heinonline.org',
      'papers.ssrn.com',
    ].join(' OR site:');

    return this.searchLegal(`${query} site:${articleSites}`, {
      numResults: 10,
    });
  }

  /**
   * Comprehensive legal research combining multiple sources
   */
  async comprehensiveResearch(
    query: string,
    jurisdiction?: string
  ): Promise<{
    caseLaw: LegalSearchResult[];
    statutes: LegalSearchResult[];
    articles: LegalSearchResult[];
    general: LegalSearchResult[];
  }> {
    const [caseLaw, statutes, articles, general] = await Promise.all([
      this.searchCaseLaw(query, jurisdiction).catch(() => []),
      this.searchStatutes(query, jurisdiction).catch(() => []),
      this.searchLegalArticles(query).catch(() => []),
      this.searchLegal(query, { numResults: 5 }).catch(() => []),
    ]);

    return {
      caseLaw,
      statutes,
      articles,
      general,
    };
  }

  /**
   * Search recent legal news and developments
   */
  async searchLegalNews(
    query: string,
    daysBack: number = 30
  ): Promise<LegalSearchResult[]> {
    const newsSites = [
      'law.com',
      'abajournal.com',
      'legalweek.com',
      'reuters.com/legal',
    ].join(' OR site:');

    return this.searchLegal(`${query} site:${newsSites}`, {
      numResults: 10,
      dateRestrict: `d${daysBack}`,
    });
  }
}
