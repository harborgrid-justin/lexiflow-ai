// War Room Service using Enzyme API Client
import { enzymeClient } from './client';
import { WarRoomSession } from '../types';

const WAR_ROOM_ENDPOINTS = {
  sessions: '/war-room/sessions',
  sessionDetail: (id: string) => `/war-room/sessions/${id}`,
  whiteboard: (sessionId: string) => `/war-room/sessions/${sessionId}/whiteboard`,
  assets: (sessionId: string) => `/war-room/sessions/${sessionId}/assets`,
  participants: (sessionId: string) => `/war-room/sessions/${sessionId}/participants`,
  join: (sessionId: string) => `/war-room/sessions/${sessionId}/join`,
  leave: (sessionId: string) => `/war-room/sessions/${sessionId}/leave`,
  transcript: (sessionId: string) => `/war-room/sessions/${sessionId}/transcript`,
  recording: (sessionId: string) => `/war-room/sessions/${sessionId}/recording`,
  exhibits: (sessionId: string) => `/war-room/sessions/${sessionId}/exhibits`,
  presentation: (sessionId: string) => `/war-room/sessions/${sessionId}/presentation`,
  chat: (sessionId: string) => `/war-room/sessions/${sessionId}/chat`,
} as const;

export const enzymeWarRoomService = {
  async getSessions(caseId: string): Promise<WarRoomSession[]> {
    const response = await enzymeClient.get<WarRoomSession[]>(WAR_ROOM_ENDPOINTS.sessions, {
      params: { caseId },
    });
    return response.data || [];
  },

  async getSessionById(id: string): Promise<WarRoomSession> {
    const response = await enzymeClient.get<WarRoomSession>(WAR_ROOM_ENDPOINTS.sessionDetail(id));
    return response.data;
  },

  async createSession(data: Partial<WarRoomSession>): Promise<WarRoomSession> {
    const response = await enzymeClient.post<WarRoomSession>(WAR_ROOM_ENDPOINTS.sessions, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async updateSession(id: string, data: Partial<WarRoomSession>): Promise<WarRoomSession> {
    const response = await enzymeClient.put<WarRoomSession>(WAR_ROOM_ENDPOINTS.sessionDetail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async getWhiteboardData(sessionId: string): Promise<any> {
    const response = await enzymeClient.get<any>(WAR_ROOM_ENDPOINTS.whiteboard(sessionId));
    return response.data;
  },

  async updateWhiteboard(sessionId: string, data: any): Promise<void> {
    await enzymeClient.put(WAR_ROOM_ENDPOINTS.whiteboard(sessionId), {
      body: data,
    });
  },

  async getRealTimeTranscript(sessionId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(WAR_ROOM_ENDPOINTS.transcript(sessionId));
    return response.data || [];
  },

  async startRecording(sessionId: string): Promise<void> {
    await enzymeClient.post(WAR_ROOM_ENDPOINTS.recording(sessionId), {
      body: { action: 'start' },
    });
  },

  async stopRecording(sessionId: string): Promise<string> {
    const response = await enzymeClient.post<{ url: string }>(WAR_ROOM_ENDPOINTS.recording(sessionId), {
      body: { action: 'stop' },
    });
    return response.data.url;
  },

  async getExhibitTracking(sessionId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(WAR_ROOM_ENDPOINTS.exhibits(sessionId));
    return response.data || [];
  },

  async updatePresentationState(sessionId: string, state: any): Promise<void> {
    await enzymeClient.put(WAR_ROOM_ENDPOINTS.presentation(sessionId), {
      body: state,
    });
  },

  async sendChatMessage(sessionId: string, message: string): Promise<void> {
    await enzymeClient.post(WAR_ROOM_ENDPOINTS.chat(sessionId), {
      body: { message },
    });
  },

  async getAssets(sessionId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(WAR_ROOM_ENDPOINTS.assets(sessionId));
    return response.data || [];
  },

  async addAsset(sessionId: string, assetId: string): Promise<void> {
    await enzymeClient.post(WAR_ROOM_ENDPOINTS.assets(sessionId), {
      body: { assetId },
    });
  },

  async joinSession(sessionId: string): Promise<void> {
    await enzymeClient.post(WAR_ROOM_ENDPOINTS.join(sessionId), { body: {} });
  },

  async leaveSession(sessionId: string): Promise<void> {
    await enzymeClient.post(WAR_ROOM_ENDPOINTS.leave(sessionId), { body: {} });
  },
};
