
import React from 'react';
import { Conversation } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { Button } from '../common/Button';
import { Search, MoreVertical, Briefcase } from 'lucide-react';

interface MessengerChatListProps {
  conversations: Conversation[];
  activeConvId: string | null;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  handleSelectConversation: (id: string) => void;
  formatTime: (iso: string) => string;
}

export const MessengerChatList: React.FC<MessengerChatListProps> = ({
  conversations, activeConvId, searchTerm, setSearchTerm, handleSelectConversation, formatTime
}) => {
  return (
    <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 bg-slate-50 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Inbox</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2"><MoreVertical className="h-5 w-5 text-slate-500"/></Button>
            <Button variant="primary" size="sm" className="h-8 w-8 p-0 rounded-full flex items-center justify-center">+</Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-md text-sm outline-none transition-all"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map(conv => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          return (
            <div 
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-white ${activeConvId === conv.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="relative">
                    <UserAvatar name={conv.name} size="md" />
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${conv.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${conv.unread > 0 ? 'text-slate-900' : 'text-slate-700'}`}>{conv.name}</h4>
                    <p className="text-xs text-slate-500 truncate flex items-center">
                      {conv.isExternal && <Briefcase className="h-3 w-3 mr-1 text-amber-500"/>}
                      {conv.role}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{formatTime(lastMsg?.timestamp)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pl-11">
                <p className={`text-sm truncate max-w-[180px] ${conv.unread > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                  {conv.draft ? <span className="text-red-500 italic">Draft: {conv.draft}</span> : lastMsg?.text}
                </p>
                {conv.unread > 0 && (
                  <span className="h-5 w-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
