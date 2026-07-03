import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/ToastContext';
import { api } from '../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: 'gemini' | 'fallback';
}

const quickReplies = [
  'How long does the battery last?',
  'What colors are available?',
  'Is it waterproof?',
  'What\'s included in the box?',
  'How to pre-order?',
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi there! I'm your AI Watch assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.chat(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.reply,
        timestamp: new Date(),
        source: result.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success('Reply received', '');
    } catch {
      setError('Unable to get response. Please try again.');
      toast.error('Chat error', 'Unable to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi there! I'm your AI Watch assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
            : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 hover:scale-110'
        }`}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-color)] transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">AI Watch Assistant</div>
              <div className="text-xs text-white/80">Always here to help</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Reset chat"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-[var(--accent-primary)]'
                    : 'bg-[var(--bg-secondary)]'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-[var(--text-primary)]" />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[var(--accent-primary)] text-white rounded-tr-sm'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-tl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && message.source && (
                  <div className="mt-1 flex items-center gap-1">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded ${
                        message.source === 'gemini'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                      title={
                        message.source === 'gemini'
                          ? 'Trả lời bằng AI Gemini (câu trả lời được sinh tự động)'
                          : 'Trả lời từ câu có sẵn (fallback khi Gemini không khả dụng)'
                      }
                    >
                      {message.source === 'gemini' ? '✨ AI Gemini' : '💬 Câu mẫu'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[var(--text-primary)]" />
              </div>
              <div className="bg-[var(--bg-secondary)] px-4 py-3 rounded-2xl rounded-tl-sm">
                <Loader2 className="w-5 h-5 text-[var(--accent-primary)] animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickReplies.slice(0, 3).map((reply) => (
              <button
                key={reply}
                onClick={() => {
                  setInputValue(reply);
                  handleSend();
                }}
                disabled={isLoading}
                className="px-3 py-1 text-xs rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-xl bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
