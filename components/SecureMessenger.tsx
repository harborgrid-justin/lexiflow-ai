
import React from 'react';
import { 
  MessageSquare, Users, FileText, Archive
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { useSecureMessenger } from '../hooks/useSecureMessenger';
import { MessengerChatList } from './messenger/MessengerChatList';
import { MessengerChatWindow } from './messenger/MessengerChatWindow';
import { MessengerContacts } from './messenger/MessengerContacts';
import { MessengerFiles } from './messenger/MessengerFiles';

export const SecureMessenger: React.FC = () => {
  const {
    view,
    setView,
    activeConvId,
    setActiveConvId,
    searchTerm,
    setSearchTerm,
    inputText,
    setInputText,
    pendingAttachments,
    setPendingAttachments,
    isPrivilegedMode,
    setIsPrivilegedMode,
    activeConversation,
    filteredConversations,
    handleSelectConversation,
    handleSendMessage,
    handleFileSelect,
    formatTime,
    contacts,
    allFiles
  } = useSecureMessenger();

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader 
        title="Secure Messenger" 
        subtitle="End-to-End Encrypted Communication Channel." 
      />

      <div className="border-b border-slate-200 mb-4">
        <nav className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'chats', label: 'Active Chats', icon: MessageSquare },
            { id: 'contacts', label: 'Firm Directory', icon: Users },
            { id: 'files', label: 'Shared Files', icon: FileText },
            { id: 'archived', label: 'Archived', icon: Archive },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`pb-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                view === item.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-0">
        
        {view === 'chats' && (
          <>
            <MessengerChatList 
              conversations={filteredConversations}
              activeConvId={activeConvId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSelectConversation={handleSelectConversation}
              formatTime={formatTime}
            />
            <MessengerChatWindow 
              activeConversation={activeConversation}
              activeConvId={activeConvId}
              setActiveConvId={setActiveConvId}
              inputText={inputText}
              setInputText={setInputText}
              pendingAttachments={pendingAttachments}
              setPendingAttachments={setPendingAttachments}
              isPrivilegedMode={isPrivilegedMode}
              setIsPrivilegedMode={setIsPrivilegedMode}
              handleSendMessage={handleSendMessage}
              handleFileSelect={handleFileSelect}
              formatTime={formatTime}
            />
          </>
        )}

        {view === 'contacts' && (
          <MessengerContacts 
            contacts={contacts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onMessageClick={() => setView('chats')}
          />
        )}

        {view === 'files' && (
          <MessengerFiles 
            files={allFiles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {view === 'archived' && (
          <div className="w-full flex flex-col items-center justify-center p-12 text-slate-400">
            <Archive className="h-16 w-16 mb-4 opacity-20"/>
            <h3 className="text-lg font-medium text-slate-600">Archived Conversations</h3>
            <p className="text-sm mt-2">No archived threads found in the last 90 days.</p>
            <Button variant="outline" className="mt-6">Search Server Archives</Button>
          </div>
        )}

      </div>
    </div>
  );
};
