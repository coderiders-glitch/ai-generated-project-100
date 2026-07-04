import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthToken('');
    setIsAuthenticated(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {!isAuthenticated ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatInterface token={authToken} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;