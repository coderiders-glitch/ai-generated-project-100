import React, { useState } from 'react';
import { sendChatMessage } from '../services/api';

interface ChatInterfaceProps {
  token: string;
  onLogout: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ token, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await sendChatMessage({ message: inputMessage }, token);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    if (e.key === 'Escape') {
      setInputMessage('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Chat</h1>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: message.isUser ? '#1976d2' : '#f5f5f5',
              color: message.isUser ? 'white' : '#333',
              wordWrap: 'break-word'
            }}
          >
            <div>{message.text}</div>
            <div style={{
              fontSize: '12px',
              opacity: 0.7,
              marginTop: '4px'
            }}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: '18px',
            backgroundColor: '#f5f5f5',
            color: '#666'
          }}>
            Typing...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '10px 20px',
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          borderTop: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #eee'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '24px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: (!inputMessage.trim() || isLoading) ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;