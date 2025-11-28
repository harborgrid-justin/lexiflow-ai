
import React, { useState, useMemo, useEffect } from 'react';
import { Conversation, Message, Attachment } from '../types';
import { ApiService } from '../services/apiService';



export const useSecureMessenger = (currentUserId?: string) => {
  const [view, setView] = useState<'chats' | 'contacts' | 'files' | 'archived'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isPrivilegedMode, setIsPrivilegedMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convs, users] = await Promise.all([
          ApiService.getConversations(),
          ApiService.getUsers()
        ]);
        setConversations(convs);
        setContactsList(users.map(u => ({
            id: u.id,
            name: u.name,
            role: u.role,
            status: 'online', // Mock status for now
            email: u.email,
            department: u.role
        })));
      } catch (error) {
        console.error("Failed to fetch messenger data", error);
      }
    };
    fetchData();
  }, []);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const lastMsgA = a.messages[a.messages.length - 1];
      const lastMsgB = b.messages[b.messages.length - 1];
      if (!lastMsgA) return 1;
      if (!lastMsgB) return -1;
      return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
    });
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sortedConversations.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.role.toLowerCase().includes(term) ||
      c.messages.some(m => m.text.toLowerCase().includes(term))
    );
  }, [sortedConversations, searchTerm]);

  const contacts = useMemo(() => {
      return contactsList.filter(c => 
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [contactsList, searchTerm]);

  const allFiles = useMemo(() => {
      const files: Attachment[] = [];
      conversations.forEach(c => {
          c.messages.forEach(m => {
              if (m.attachments) {
                  m.attachments.forEach(a => {
                      files.push({
                          ...a,
                          sender: m.senderId === 'me' ? 'Me' : c.name,
                          date: m.timestamp
                      });
                  });
              }
          });
      });
      return files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [conversations, searchTerm]);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  const handleSelectConversation = (id: string) => {
    if (activeConvId === id) return;

    if (activeConvId) {
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, draft: inputText } : c
      ));
    }

    const targetConv = conversations.find(c => c.id === id);
    setInputText(targetConv?.draft || '');
    setPendingAttachments([]);
    setIsPrivilegedMode(targetConv?.role.includes('Client') || false);
    setActiveConvId(id);

    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, unread: 0 } : c
    ));
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && pendingAttachments.length === 0) || !activeConvId) return;
    
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUserId || 'me',
      text: inputText,
      timestamp: new Date().toISOString(),
      status: 'sent',
      isPrivileged: isPrivilegedMode,
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    };

    // Optimistic update
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          draft: '',
        };
      }
      return c;
    }));

    setInputText('');
    setPendingAttachments([]);

    try {
      await ApiService.sendMessage(activeConvId, newMessage.text, currentUserId);
      
      // Update status to delivered
      setConversations(prev => prev.map(c => 
          c.id === activeConvId 
          ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m) } 
          : c
      ));
    } catch (error) {
      console.error("Failed to send message", error);
      // Revert or show error
    }

    // Mock reply for demo purposes
    if (activeConversation && activeConversation.status !== 'offline') {
        setTimeout(() => {
            const replyMsg: Message = {
                id: `rep-${Date.now()}`,
                senderId: 'other',
                text: 'I received your message securely. Will review shortly.',
                timestamp: new Date().toISOString(),
                status: 'read'
            };
            setConversations(prev => prev.map(c => 
                c.id === activeConvId 
                ? { ...c, messages: [...c.messages, replyMsg], unread: activeConvId === c.id ? 0 : c.unread + 1 } 
                : c
            ));
        }, 5000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newAtt: Attachment = {
              name: file.name,
              type: file.type.includes('image') ? 'image' : 'doc',
              size: '1.2 MB'
          };
          setPendingAttachments([...pendingAttachments, newAtt]);
      }
  };

  const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    view,
    setView,
    conversations,
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
  };
};