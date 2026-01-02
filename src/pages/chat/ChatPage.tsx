import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, ArrowLeft, MessageCircle, User, Users, Loader2 } from 'lucide-react';
import Pusher from 'pusher-js';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface ChatUser {
  id: number;
  username: string;
  thumbnail: string | null;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender: ChatUser;
  message: string;
  type: 'text' | 'image' | 'file';
  file_path: string | null;
  read_at: string | null;
  created_at: string;
}

interface Conversation {
  id: number;
  user: ChatUser;
  last_message: {
    message: string;
    created_at: string;
    sender_id: number;
  } | null;
  unread_count: number;
  updated_at: string;
}

interface TypingUser {
  user_id: number;
  username: string;
  is_typing: boolean;
}

// Pusher config - you should replace these with your actual keys
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || 'your-pusher-key';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'ap1';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [typingUser, setTypingUser] = useState<TypingUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pusherRef = useRef<Pusher | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/chat/conversations');
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: number) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      if (response.data.success) {
        setMessages(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  // Subscribe to Pusher channel
  useEffect(() => {
    if (!selectedConversation) return;

    // Initialize Pusher
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
      });
    }

    const channel = pusherRef.current.subscribe(`conversation-${selectedConversation.id}`);

    // Listen for new messages
    channel.bind('message-sent', (data: Message) => {
      if (data.sender_id !== user?.id) {
        setMessages((prev) => [...prev, data]);
        // Mark as read
        api.post(`/chat/conversations/${selectedConversation.id}/read`).catch(console.error);
      }
    });

    // Listen for typing events
    channel.bind('user-typing', (data: TypingUser) => {
      if (data.user_id !== user?.id) {
        setTypingUser(data.is_typing ? data : null);
        // Clear typing indicator after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (data.is_typing) {
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 3000);
        }
      }
    });

    return () => {
      channel.unbind_all();
      pusherRef.current?.unsubscribe(`conversation-${selectedConversation.id}`);
    };
  }, [selectedConversation, user?.id]);

  // Cleanup Pusher on unmount
  useEffect(() => {
    return () => {
      pusherRef.current?.disconnect();
    };
  }, []);

  // Search users
  const searchForUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setAvailableUsers([]);
      return;
    }
    try {
      const response = await api.get(`/chat/users?search=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showUserSearch) {
        searchForUsers(searchUsers);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchUsers, showUserSearch, searchForUsers]);

  // Start a new conversation
  const startConversation = async (targetUserId: number) => {
    try {
      const response = await api.post('/chat/conversations', { user_id: targetUserId });
      if (response.data.success) {
        const newConv: Conversation = {
          id: response.data.data.id,
          user: response.data.data.user,
          last_message: null,
          unread_count: 0,
          updated_at: new Date().toISOString(),
        };
        setConversations((prev) => {
          const exists = prev.find((c) => c.id === newConv.id);
          if (exists) return prev;
          return [newConv, ...prev];
        });
        setSelectedConversation(newConv);
        setMessages([]);
        setShowUserSearch(false);
        setSearchUsers('');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  // Select a conversation
  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
    // Mark as read
    api.post(`/chat/conversations/${conv.id}/read`).catch(console.error);
    // Update unread count locally
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c))
    );
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      const response = await api.post(`/chat/conversations/${selectedConversation.id}/messages`, {
        message: newMessage,
        type: 'text',
      });
      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setNewMessage('');
        // Update last message in conversations list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversation.id
              ? {
                ...c,
                last_message: {
                  message: newMessage,
                  created_at: new Date().toISOString(),
                  sender_id: user?.id || 0,
                },
              }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedConversation) return;
    api.post(`/chat/conversations/${selectedConversation.id}/typing`, { is_typing: true }).catch(console.error);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
  };

  // Get avatar fallback
  const getAvatar = (chatUser: ChatUser) => {
    if (chatUser.thumbnail) {
      return (
        <img
          src={chatUser.thumbnail.startsWith('http') ? chatUser.thumbnail : `http://localhost:8000/storage/${chatUser.thumbnail}`}
          alt={chatUser.username}
          className="chat-avatar"
        />
      );
    }
    return (
      <div className="chat-avatar-placeholder">
        <span>{chatUser.username.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div className="chat-container">
      {/* Sidebar - Conversations List */}
      <aside className={`chat-sidebar ${selectedConversation ? 'hidden-mobile' : ''}`}>
        <div className="chat-sidebar-header">
          <h2>
            <MessageCircle size={24} />
            Chat
          </h2>
          <button
            className="btn-new-chat"
            onClick={() => setShowUserSearch(true)}
            title="Mulai chat baru"
          >
            <Users size={20} />
          </button>
        </div>

        {/* User Search Modal */}
        {showUserSearch && (
          <div className="user-search-overlay">
            <div className="user-search-modal">
              <div className="user-search-header">
                <button onClick={() => setShowUserSearch(false)}>
                  <ArrowLeft size={20} />
                </button>
                <h3>Cari User</h3>
              </div>
              <div className="user-search-input">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan username..."
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  autoFocus
                />
              </div>
              <ul className="user-search-results">
                {availableUsers.map((u) => (
                  <li key={u.id} onClick={() => startConversation(u.id)}>
                    {getAvatar(u)}
                    <span>{u.username}</span>
                  </li>
                ))}
                {searchUsers && availableUsers.length === 0 && (
                  <li className="no-results">Tidak ada user ditemukan</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="conversations-list">
          {isLoading ? (
            <div className="chat-loading">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : conversations.length === 0 ? (
            <div className="no-conversations">
              <MessageCircle size={48} />
              <p>Belum ada percakapan</p>
              <button onClick={() => setShowUserSearch(true)}>
                Mulai Chat Baru
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => selectConversation(conv)}
              >
                {getAvatar(conv.user)}
                <div className="conversation-info">
                  <div className="conversation-header">
                    <span className="conversation-name">{conv.user.username}</span>
                    {conv.last_message && (
                      <span className="conversation-time">
                        {formatTime(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="conversation-preview">
                    <p>
                      {conv.last_message
                        ? conv.last_message.sender_id === user?.id
                          ? `Anda: ${conv.last_message.message}`
                          : conv.last_message.message
                        : 'Mulai percakapan'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="unread-badge">{conv.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`chat-main ${!selectedConversation ? 'hidden-mobile' : ''}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <button
                className="btn-back-mobile"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft size={24} />
              </button>
              {getAvatar(selectedConversation.user)}
              <div className="chat-header-info">
                <h3>{selectedConversation.user.username}</h3>
                {typingUser && (
                  <span className="typing-indicator">sedang mengetik...</span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <User size={48} />
                  <p>Belum ada pesan. Kirim pesan pertama!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.message}</p>
                      <span className="message-time">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  handleTyping();
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isSending}
              />
              <button
                className="btn-send"
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageCircle size={64} />
            <h3>Selamat Datang di Chat</h3>
            <p>Pilih percakapan atau mulai chat baru</p>
          </div>
        )}
      </main>

      <style>{`
        .chat-container {
          display: flex;
          height: calc(100vh - 80px);
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .chat-sidebar {
          width: 360px;
          background: rgba(26, 26, 46, 0.95);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
        }

        .chat-sidebar-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
        }

        .chat-sidebar-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          color: #fff;
          margin: 0;
        }

        .btn-new-chat {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          padding: 10px;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-new-chat:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 6px;
        }

        .conversation-item:hover,
        .conversation-item.active {
          background: rgba(99, 102, 241, 0.2);
        }

        .conversation-item.active {
          border-left: 3px solid #6366f1;
        }

        .chat-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .chat-avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .conversation-name {
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-time {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .conversation-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .conversation-preview p {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .unread-badge {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(22, 33, 62, 0.95);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-header-info h3 {
          margin: 0;
          color: #fff;
          font-size: 1.1rem;
        }

        .typing-indicator {
          font-size: 0.8rem;
          color: #a855f7;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .btn-back-mobile {
          display: none;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 5px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          max-width: 70%;
        }

        .message.sent {
          align-self: flex-end;
        }

        .message.received {
          align-self: flex-start;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .message.sent .message-content {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .message.received .message-content {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-bottom-left-radius: 4px;
        }

        .message-content p {
          margin: 0;
          word-break: break-word;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.65rem;
          opacity: 0.7;
          display: block;
          text-align: right;
          margin-top: 4px;
        }

        .message-input-container {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(26, 26, 46, 0.9);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-input-container input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 12px 20px;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .message-input-container input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .message-input-container input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .btn-send {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          padding: 12px 16px;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-send:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .btn-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-chat-selected,
        .no-messages,
        .no-conversations {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: rgba(255, 255, 255, 0.5);
          gap: 16px;
          text-align: center;
          padding: 40px;
        }

        .no-chat-selected h3,
        .no-conversations button {
          color: #fff;
        }

        .no-conversations button {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .no-conversations button:hover {
          transform: scale(1.05);
        }

        .chat-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #6366f1;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* User Search Modal */
        .user-search-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 60px;
        }

        .user-search-modal {
          width: 100%;
          max-width: 400px;
          background: #1a1a2e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .user-search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-search-header button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 5px;
        }

        .user-search-header h3 {
          margin: 0;
          color: #fff;
        }

        .user-search-input {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
        }

        .user-search-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 1rem;
          outline: none;
        }

        .user-search-input input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .user-search-input svg {
          color: rgba(255, 255, 255, 0.4);
        }

        .user-search-results {
          list-style: none;
          margin: 0;
          padding: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .user-search-results li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          color: #fff;
          transition: background 0.3s ease;
        }

        .user-search-results li:hover {
          background: rgba(99, 102, 241, 0.2);
        }

        .user-search-results li.no-results {
          justify-content: center;
          color: rgba(255, 255, 255, 0.5);
          cursor: default;
        }

        .user-search-results li.no-results:hover {
          background: none;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100%;
            position: absolute;
            inset: 0;
            z-index: 10;
          }

          .chat-sidebar.hidden-mobile {
            display: none;
          }

          .chat-main.hidden-mobile {
            display: none;
          }

          .btn-back-mobile {
            display: block;
          }

          .message {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}
