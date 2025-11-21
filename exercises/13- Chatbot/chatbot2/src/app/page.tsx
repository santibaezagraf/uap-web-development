'use client';

import { useChat } from '@/hooks/useChat';
import { useEffect } from 'react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setError } = useChat('/api/chat');

  // Auto-scroll al último mensaje
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 p-4 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            🤖 Chatbot Inteligente
          </h1>
          <p className="text-slate-400 text-sm mt-1">Powered by OpenRouter & Vercel AI SDK</p>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        id="messages-container"
        className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-slate-300 text-lg font-medium">Inicia una conversación</p>
              <p className="text-slate-500 text-sm mt-2">Hazme cualquier pregunta y te ayudaré</p>
            </div>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fadeIn`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg break-words ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                    : 'bg-slate-700 text-slate-100 rounded-bl-none shadow-lg'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator - Typing Animation */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none shadow-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex justify-center animate-fadeIn">
            <div className="bg-red-600/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm max-w-md">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-300 hover:text-red-100 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-600 p-4 bg-slate-800/80 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            maxLength={1000}
            className="flex-1 px-4 py-3 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-blue-600/50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Enviando
              </span>
            ) : (
              '📤 Enviar'
            )}
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-2 max-w-4xl mx-auto">
          💡 Máximo 1000 caracteres por mensaje
        </p>
      </div>
    </div>
  );
}
