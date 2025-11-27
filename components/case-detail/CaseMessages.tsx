
import React, { useState } from 'react';
import { Case } from '../../types';
import { Send, Paperclip, Lock, Shield, User, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { UserAvatar } from '../common/UserAvatar';

interface CaseMessagesProps {
  caseData: Case;
}

interface Message {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  isPrivileged: boolean;
  attachments?: string[];
}

export const CaseMessages: React.FC<CaseMessagesProps> = ({ caseData }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1', sender: 'Alexandra H.', role: 'Senior Partner',
      text: `Team, regarding ${caseData.title}, we need to expedite the discovery review. The judge is pushing for a conference next week.`,
      timestamp: 'Yesterday 09:30 AM', isPrivileged: true
    },
    {
      id: 'm2', sender: 'Sarah Jenkins', role: 'Paralegal',
      text: 'Understood. I have uploaded the latest production set to the Discovery center. Waiting on OCR.',
      timestamp: 'Yesterday 10:15 AM', isPrivileged: true, attachments: ['Production_Set_004.pdf']
    },
    {
      id: 'm3', sender: 'John Doe', role: 'Client',
      text: 'I found the old email archives you asked for. How should I send them securely?',
      timestamp: 'Today 08:00 AM', isPrivileged: true
    }
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'Me',
      role: 'Attorney',
      text: inputText,
      timestamp: 'Just now',
      isPrivileged: true
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Thread Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600"/> Case Communication Thread
          </h3>
          <p className="text-xs text-slate-500">Participants: Firm Staff, Client ({caseData.client})</p>
        </div>
        <div className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full flex items-center font-semibold border border-amber-200">
           <Shield className="h-3 w-3 mr-1"/> Attorney-Client Privileged
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg) => {
          const isMe = msg.sender === 'Me';
          return (
            <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
              <UserAvatar name={msg.sender} className="mt-1"/>
              <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                   <span className="text-[10px] text-slate-400">{msg.role} • {msg.timestamp}</span>
                </div>
                <div className={`p-4 rounded-2xl text-sm shadow-sm relative ${
                   isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                   {msg.text}
                   {msg.attachments && (
                     <div className="mt-3 space-y-1">
                       {msg.attachments.map(att => (
                         <div key={att} className="flex items-center p-2 bg-black/10 rounded text-xs font-medium">
                            <FileText className="h-3 w-3 mr-2"/> {att}
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
         <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors">
                <Paperclip className="h-5 w-5"/>
            </button>
            <div className="flex-1 relative">
                <input 
                  className="w-full bg-slate-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Type a secure message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
            </div>
            <Button variant="primary" className="rounded-full px-4" onClick={handleSend}>
                <Send className="h-4 w-4 mr-2"/> Send
            </Button>
         </div>
         <p className="text-center text-[10px] text-slate-400 mt-2">
            Messages are end-to-end encrypted. Do not share credentials.
         </p>
      </div>
    </div>
  );
};
