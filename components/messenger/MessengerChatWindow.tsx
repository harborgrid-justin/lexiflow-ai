
import React, { useRef, useEffect } from 'react';
import { Conversation, Attachment } from '../../hooks/useSecureMessenger';
import { UserAvatar } from '../common/UserAvatar';
import { Button } from '../common/Button';
import { 
  ArrowLeft, Lock, Phone, Video, Info, AlertTriangle, Shield, 
  ImageIcon, FileText, CheckCheck, Check, Flag, X, Clock, Paperclip, Send 
} from 'lucide-react';

interface MessengerChatWindowProps {
  activeConversation: Conversation | undefined;
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  inputText: string;
  setInputText: (text: string) => void;
  pendingAttachments: Attachment[];
  setPendingAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isPrivilegedMode: boolean;
  setIsPrivilegedMode: (mode: boolean) => void;
  handleSendMessage: () => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (iso: string) => string;
}

export const MessengerChatWindow: React.FC<MessengerChatWindowProps> = ({
  activeConversation, activeConvId, setActiveConvId,
  inputText, setInputText, pendingAttachments, setPendingAttachments,
  isPrivilegedMode, setIsPrivilegedMode, handleSendMessage, handleFileSelect, formatTime
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConvId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages, activeConvId]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-12 w-12 text-slate-300"/>
        </div>
        <h3 className="text-xl font-bold text-slate-700">Secure Messenger</h3>
        <p className="text-center max-w-sm mt-2 text-slate-500">
          Select a conversation to start communicating securely with clients, partners, and external counsel.
        </p>
        <div className="mt-8 flex gap-4 text-xs">
          <div className="flex items-center"><Shield className="h-4 w-4 mr-2 text-green-500"/> SOC2 Compliant</div>
          <div className="flex items-center"><Lock className="h-4 w-4 mr-2 text-green-500"/> E2E Encrypted</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-slate-50/30 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
      {/* Header */}
      <div className="h-16 px-6 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveConvId(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="h-5 w-5"/>
          </button>
          <UserAvatar name={activeConversation.name} />
          <div>
            <h3 className="font-bold text-slate-900 flex items-center">
              {activeConversation.name}
              {activeConversation.isExternal && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded border border-amber-200 uppercase tracking-wide font-bold">External</span>}
            </h3>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <Lock className="h-3 w-3 mr-1"/> End-to-End Encrypted
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600"><Phone className="h-5 w-5"/></Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600"><Video className="h-5 w-5"/></Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600"><Info className="h-5 w-5"/></Button>
        </div>
        
        {activeConversation.isExternal && (
          <div className="absolute top-full left-0 right-0 bg-amber-50 border-b border-amber-100 px-4 py-1 flex justify-center items-center text-[10px] text-amber-800 font-medium z-0">
            <AlertTriangle className="h-3 w-3 mr-2"/>
            External Recipient. Do not share credentials or unredacted PII.
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-8">
        {activeConversation.messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg`}>
              {!isMe && <UserAvatar name={activeConversation.name} size="sm" className="mt-1 mr-2" />}
              <div className={`max-w-[75%] md:max-w-[60%]`}>
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

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {pendingAttachments.length > 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto">
            {pendingAttachments.map((att, i) => (
              <div key={i} className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-xs border border-slate-200">
                <FileText className="h-3 w-3 mr-2 text-slate-500"/>
                <span className="max-w-[100px] truncate">{att.name}</span>
                <button onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))} className="ml-2 text-slate-400 hover:text-red-500">
                  <X className="h-3 w-3"/>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <label className="flex items-center text-xs text-slate-600 cursor-pointer select-none">
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors mr-2 ${isPrivilegedMode ? 'bg-amber-500' : 'bg-slate-300'}`} onClick={() => setIsPrivilegedMode(!isPrivilegedMode)}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${isPrivilegedMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <span className={isPrivilegedMode ? 'font-bold text-amber-700' : ''}>Attorney-Client Privilege</span>
            </label>
          </div>
          {activeConversation.draft && <span className="text-[10px] text-slate-400 italic flex items-center"><Clock className="h-3 w-3 mr-1"/> Draft saved</span>}
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-200 rounded-full transition-colors"
            title="Attach File"
          >
            <Paperclip className="h-5 w-5"/>
          </button>
          <input 
            className="flex-1 bg-transparent border-none outline-none text-sm px-2"
            placeholder={`Message ${activeConversation.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() && pendingAttachments.length === 0}
            className={`p-2 rounded-full transition-all ${inputText.trim() || pendingAttachments.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-slate-200 text-slate-400'}`}
          >
            <Send className="h-5 w-5 ml-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );
};
