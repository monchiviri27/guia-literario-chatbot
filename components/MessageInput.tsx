
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-[#D3CBB8] p-4 sticky bottom-0">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu consulta literaria aquí..."
          className="flex-1 p-3 border border-[#D3CBB8] rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:outline-none resize-none transition-shadow"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 bg-[#8B4513] text-white rounded-lg disabled:bg-[#D3CBB8] disabled:cursor-not-allowed hover:bg-[#A0522D] transition-colors focus:ring-2 focus:ring-[#8B4513] focus:outline-none"
          aria-label="Enviar mensaje"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
