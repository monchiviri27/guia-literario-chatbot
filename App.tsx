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
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
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

  // ✅ NUEVA FUNCIÓN: Limpiar conversación
  const handleClearChat = useCallback(() => {
    setMessages([initialWelcomeMessage]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setShowClearConfirm(false);
    // También podrías reinicializar el servicio de chat si es necesario
    initializeChat([initialWelcomeMessage]);
  }, []);

  // ✅ NUEVA FUNCIÓN: Mostrar confirmación
  const handleClearClick = useCallback(() => {
    if (messages.length <= 1) {
      // Si solo hay el mensaje de bienvenida, limpiar directamente
      handleClearChat();
    } else {
      setShowClearConfirm(true);
    }
  }, [messages.length, handleClearChat]);

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
      <Header onClearChat={handleClearClick} /> {/* ✅ Pasar función al Header */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <ChatInterface messages={messages} />
          <div ref={chatEndRef} />
        </div>
      </main>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      {/* ✅ Modal de confirmación para limpiar chat */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-2">¿Limpiar conversación?</h3>
            <p className="text-gray-600 mb-4">
              Se eliminará todo el historial del chat. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;