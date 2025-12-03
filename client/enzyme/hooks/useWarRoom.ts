import { useApiRequest, useApiMutation } from '../services/hooks';
import { WarRoomSession } from '../types';
import { enzymeWarRoomService } from '../services/warroom.service';

export const useWarRoom = (caseId?: string, sessionId?: string) => {
  const { data: sessions = [], isLoading, refetch } = useApiRequest<WarRoomSession[]>({
    endpoint: '/war-room/sessions',
    options: {
      enabled: !!caseId,
      params: { caseId },
    },
  });

  const { data: activeSession } = useApiRequest<WarRoomSession>({
    endpoint: `/war-room/sessions/${sessionId}`,
    options: {
      enabled: !!sessionId,
    },
  });

  const { data: transcript = [] } = useApiRequest<any[]>({
    endpoint: `/war-room/sessions/${sessionId}/transcript`,
    options: {
      enabled: !!sessionId,
    },
  });

  const { data: exhibits = [] } = useApiRequest<any[]>({
    endpoint: `/war-room/sessions/${sessionId}/exhibits`,
    options: {
      enabled: !!sessionId,
    },
  });

  const { mutateAsync: createSession } = useApiMutation<WarRoomSession, Partial<WarRoomSession>>({
    mutationFn: (data) => enzymeWarRoomService.createSession(data),
  });

  const { mutateAsync: joinSession } = useApiMutation<void, string>({
    mutationFn: (sid) => enzymeWarRoomService.joinSession(sid),
  });

  const { mutateAsync: startRecording } = useApiMutation<void, string>({
    mutationFn: (sid) => enzymeWarRoomService.startRecording(sid),
  });

  const { mutateAsync: stopRecording } = useApiMutation<string, string>({
    mutationFn: (sid) => enzymeWarRoomService.stopRecording(sid),
  });

  const { mutateAsync: sendChatMessage } = useApiMutation<void, { sessionId: string; message: string }>({
    mutationFn: ({ sessionId: sid, message }) => enzymeWarRoomService.sendChatMessage(sid, message),
  });

  const { mutateAsync: updatePresentation } = useApiMutation<void, { sessionId: string; state: any }>({
    mutationFn: ({ sessionId: sid, state }) => enzymeWarRoomService.updatePresentationState(sid, state),
  });

  return {
    sessions,
    activeSession,
    transcript,
    exhibits,
    isLoading,
    refetch,
    createSession,
    joinSession,
    startRecording,
    stopRecording,
    sendChatMessage,
    updatePresentation,
  };
};
