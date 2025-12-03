import React, { useState } from 'react';
import { useWarRoom } from '../../enzyme/hooks/useWarRoom';
import { Card, Button } from '../common';
import { Video, Mic, MessageSquare, Monitor, Users } from 'lucide-react';

// Type assertion to ensure icons are treated as components
const VideoIcon = Video as React.ElementType;
const MicIcon = Mic as React.ElementType;

interface CaseWarRoomProps {
  caseId: string;
}

export const CaseWarRoom: React.FC<CaseWarRoomProps> = ({ caseId }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  
  const { 
    sessions, 
    activeSession, 
    transcript, 
    createSession, 
    joinSession,
    startRecording,
    sendChatMessage,
    isLoading 
  } = useWarRoom(caseId, activeSessionId);

  const [newMessage, setNewMessage] = useState('');

  const handleCreateSession = async () => {
    const session = await createSession({ 
      name: `War Room Session - ${new Date().toLocaleDateString()}`,
      caseId,
      status: 'Active',
      startTime: new Date().toISOString()
    });
    setActiveSessionId(session.id);
  };

  const handleJoinSession = async (sessionId: string) => {
    await joinSession(sessionId);
    setActiveSessionId(sessionId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSessionId) return;
    await sendChatMessage({ sessionId: activeSessionId, message: newMessage });
    setNewMessage('');
  };

  if (isLoading && !sessions.length) return <div className="p-8 text-center text-slate-500">Loading War Room...</div>;

  if (!activeSessionId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">War Room Sessions</h2>
          <Button onClick={handleCreateSession} icon={VideoIcon}>
            Start New Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map(session => (
            <div key={session.id} className="cursor-pointer hover:border-blue-400 transition-colors" onClick={() => handleJoinSession(session.id)}>
              <Card>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{session.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(session.startTime).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <Users className="w-3 h-3" />
                  <span>{session.participants?.length || 0} participants</span>
                </div>
              </div>
              </Card>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="col-span-3 text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">No active sessions. Start a new War Room session to collaborate.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              {activeSession?.name || 'Active Session'}
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => activeSessionId && startRecording(activeSessionId)}
                icon={MicIcon}
              >
                Record
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setActiveSessionId(undefined)}>
                Leave
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 flex items-center justify-center text-slate-400">
            {/* Placeholder for video/whiteboard */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 opacity-50 flex items-center justify-center">
                <Video className="w-8 h-8" />
              </div>
              <p>Video Stream / Whiteboard Area</p>
            </div>
          </div>
        </Card>

        <Card className="h-64 flex flex-col">
          <div className="p-3 border-b border-slate-200 font-medium text-sm">Real-time Transcript</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {transcript.map((entry, i) => (
              <div key={i} className="text-sm">
                <span className="font-bold text-slate-700">{entry.speaker}:</span>
                <span className="text-slate-600 ml-2">{entry.text}</span>
              </div>
            ))}
            {transcript.length === 0 && (
              <div className="text-slate-400 text-sm italic text-center mt-4">No transcript available yet.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1 flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <div className="p-3 border-b border-slate-200 font-medium text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Team Chat
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            {/* Chat messages would go here */}
            <div className="text-center text-slate-400 text-sm mt-10">Chat started</div>
          </div>
          <div className="p-3 border-t border-slate-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <Button type="submit" size="sm">Send</Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
