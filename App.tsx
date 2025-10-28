import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from './types';
import { initializeChat, sendMessageStream } from './services/geminiService';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import MessageInput from './components/MessageInput';

const CHAT_HISTORY_KEY = 'curadorLiterarioChatHistory';

const initialWelcomeMessage: Message = {
    id: 'initial-message',
    role: 'model',
    content: "¡Bienvenido! Soy tu Curador Literario. ¿Buscas una recomendación para tu próxima lectura, o prefieres un análisis profundo de alguna obra maestra? Estoy aquí para guiarte en el fascinante mundo de la literatura."
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Could not load chat history from localStorage', error);
      localStorage.removeItem(CHAT_HISTORY_KEY); // Clear corrupted data
    }
    return [initialWelcomeMessage];
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat service with the loaded history
    initializeChat(messages);
  }, []); // Run only once on mount

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Save chat history to localStorage whenever it changes,
    // but avoid saving the pristine initial state.
    if (messages.length === 1 && messages[0].id === 'initial-message') {
      return;
    }
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
    };

    const modelMessageId = `model-${Date.now()}`;
    setMessages(prev => [...prev, userMessage, { id: modelMessageId, role: 'model', content: '' }]);

    try {
      const stream = await sendMessageStream(userInput);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setError(errorMessage);
      setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, content: `Error: ${errorMessage}` } : msg
          )
        );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen bg-[#FDF6E3] text-[#586E75]">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <ChatInterface messages={messages} />
          <div ref={chatEndRef} />
        </div>
      </main>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;