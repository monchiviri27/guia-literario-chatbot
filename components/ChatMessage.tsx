
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // This is a very basic markdown parser. For a production app,
    // a more robust library like 'react-markdown' would be preferable,
    // but this avoids complex dependencies in this environment.
    const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
        .replace(/(\r\n|\r|\n){2,}/g, '</p><p>')     // Paragraphs
        .replace(/(\r\n|\r|\n)/g, '<br/>')         // Line breaks
        .replace(/<\/p><p>/g, '</p><p class="mt-4">') // Add margin between paragraphs
        .replace(/<\/p><ul>/g, '</ul>')
        .replace(/^\s*-\s(.*?)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/<\/ul>\s*<ul>/gs, '')
        .replace(/(<br\/>)?\s*<ul>/g, '<ul class="list-disc list-inside ml-4 mt-2">')


    return <div dangerouslySetInnerHTML={{ __html: `<p>${formattedContent}</p>` }} />;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 ${!isUserModel ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${isUserModel ? 'bg-[#268BD2]' : 'bg-[#6C71C4]'}`}>
        {isUserModel ? 'CL' : 'TÚ'}
      </div>
      <div className={`p-4 rounded-lg max-w-lg shadow-sm ${isUserModel ? 'bg-white' : 'bg-[#E0F2FE]'}`}>
        {message.content === '' && isUserModel ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
            <SimpleMarkdownRenderer content={message.content} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
