// Linking Service using Enzyme API Client
import { enzymeClient } from './client';
import { EntityLink } from '../types';

const LINKING_ENDPOINTS = {
  links: '/links',
  detail: (id: string) => `/links/${id}`,
  graph: (caseId: string) => `/links/graph/${caseId}`,
  suggest: '/links/suggest',
  deepLink: '/links/deep-link',
  crossMatter: '/links/cross-matter',
  resolveEntities: '/links/resolve-entities',
  health: '/links/health',
  visualize: (caseId: string) => `/links/visualize/${caseId}`,
} as const;

export const enzymeLinkingService = {
  async createLink(link: Partial<EntityLink>): Promise<EntityLink> {
    const response = await enzymeClient.post<EntityLink>(LINKING_ENDPOINTS.links, {
      body: link as Record<string, unknown>,
    });
    return response.data;
  },

  async getLinks(entityId: string): Promise<EntityLink[]> {
    const response = await enzymeClient.get<EntityLink[]>(LINKING_ENDPOINTS.links, {
      params: { entityId },
    });
    return response.data || [];
  },

  async deleteLink(id: string): Promise<void> {
    await enzymeClient.delete(LINKING_ENDPOINTS.detail(id));
  },

  async getLinkGraph(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(LINKING_ENDPOINTS.graph(caseId));
    return response.data;
  },

  async getSuggestedLinks(entityId: string): Promise<EntityLink[]> {
    const response = await enzymeClient.get<EntityLink[]>(LINKING_ENDPOINTS.suggest, {
      params: { entityId },
    });
    return response.data || [];
  },

  async createDeepLink(documentId: string, selection: any): Promise<string> {
    const response = await enzymeClient.post<{ url: string }>(LINKING_ENDPOINTS.deepLink, {
      body: { documentId, selection },
    });
    return response.data.url;
  },

  async findCrossMatterLinks(entityId: string): Promise<EntityLink[]> {
    const response = await enzymeClient.get<EntityLink[]>(LINKING_ENDPOINTS.crossMatter, {
      params: { entityId },
    });
    return response.data || [];
  },

  async resolveEntities(text: string): Promise<any[]> {
    const response = await enzymeClient.post<any[]>(LINKING_ENDPOINTS.resolveEntities, {
      body: { text },
    });
    return response.data || [];
  },

  async checkLinkHealth(caseId: string): Promise<{ broken: number; total: number; details: any[] }> {
    const response = await enzymeClient.get<{ broken: number; total: number; details: any[] }>(LINKING_ENDPOINTS.health, {
      params: { caseId },
    });
    return response.data;
  },

  async getVisualizationData(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(LINKING_ENDPOINTS.visualize(caseId));
    return response.data;
  },
};
