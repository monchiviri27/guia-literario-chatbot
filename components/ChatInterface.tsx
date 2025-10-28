
import React from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatInterfaceProps {
  messages: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ChatInterface;
