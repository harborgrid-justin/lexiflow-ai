
import React, { useRef, useEffect } from 'react';
import { Conversation } from '../../hooks/useSecureMessenger';
import { UserAvatar } from '../common/UserAvatar';
import { Shield, ImageIcon, FileText, CheckCheck, Check, Flag } from 'lucide-react';

interface MessageListProps {
  conversation: Conversation;
  currentUserId: string;
  formatTime: (iso: string) => string;
}

export const MessageList: React.FC<MessageListProps> = ({ conversation, currentUserId, formatTime }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-8 bg-slate-50/30">
        {conversation.messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg`}>
              {!isMe && <UserAvatar name={conversation.name} size="sm" className="mt-1 mr-2" />}
              <div className={`max-w-[85%] md:max-w-[70%]`}>
                {msg.isPrivileged && (
                  <div className="text-[10px] text-amber-600 font-bold mb-0.5 flex items-center justify-end">
                    <Shield className="h-3 w-3 mr-1"/> PRIVILEGED
                  </div>
                )}
                <div className={`p-3 rounded-2xl text-sm shadow-sm relative group ${
                  isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                  
                  {msg.attachments && msg.attachments.map((att, i) => (
                    <div key={i} className={`mt-2 p-2 rounded flex items-center gap-3 ${isMe ? 'bg-blue-700' : 'bg-slate-100'}`}>
                      <div className={`p-2 rounded ${isMe ? 'bg-blue-800' : 'bg-white'}`}>
                        {att.type === 'image' ? <ImageIcon className="h-4 w-4"/> : <FileText className="h-4 w-4"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs truncate">{att.name}</p>
                        <p className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>{att.size}</p>
                      </div>
                    </div>
                  ))}

                  <div className={`text-[10px] mt-1 flex items-center justify-end ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp)}
                    {isMe && (
                      <span className="ml-1" title={msg.status}>
                        {msg.status === 'read' ? <CheckCheck className="h-3 w-3"/> : msg.status === 'delivered' ? <CheckCheck className="h-3 w-3 opacity-70"/> : <Check className="h-3 w-3"/>}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="opacity-0 group-hover/msg:opacity-100 p-1 text-slate-400 hover:text-blue-600 self-center mx-2 transition-opacity" title="Flag for Case File">
                <Flag className="h-4 w-4"/>
              </button>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
  );
};
