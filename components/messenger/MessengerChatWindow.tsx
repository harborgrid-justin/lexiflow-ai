
import React from 'react';
import { Conversation, Attachment } from '../../hooks/useSecureMessenger';
import { Lock, Shield } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';

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

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 hidden md:flex">
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
      <ChatHeader 
        conversation={activeConversation} 
        onBack={() => setActiveConvId(null)} 
      />
      
      <MessageList 
        conversation={activeConversation} 
        currentUserId="me" 
        formatTime={formatTime} 
      />

      <ChatInput 
        inputText={inputText}
        setInputText={setInputText}
        pendingAttachments={pendingAttachments}
        setPendingAttachments={setPendingAttachments}
        isPrivilegedMode={isPrivilegedMode}
        setIsPrivilegedMode={setIsPrivilegedMode}
        onSend={handleSendMessage}
        onFileSelect={handleFileSelect}
        draft={activeConversation.draft}
        recipientName={activeConversation.name}
      />
    </div>
  );
};
