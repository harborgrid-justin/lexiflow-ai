
import React from 'react';
import { 
  MessageSquare, Users, FileText, Archive
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { TabNavigation } from './common/TabNavigation';
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

  const tabs = [
    { id: 'chats', label: 'Active Chats', icon: MessageSquare },
    { id: 'contacts', label: 'Firm Directory', icon: Users },
    { id: 'files', label: 'Shared Files', icon: FileText },
    { id: 'archived', label: 'Archived', icon: Archive },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader 
        title="Secure Messenger" 
        subtitle="End-to-End Encrypted Communication Channel." 
      />

      <TabNavigation 
        tabs={tabs} 
        activeTab={view} 
        onTabChange={(id) => setView(id as any)}
        className="mb-4 bg-white rounded-t-lg md:bg-transparent"
      />

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
