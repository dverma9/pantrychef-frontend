import { useState, useEffect, useRef, useCallback } from 'react';
import { sendMessage } from '../api/chatApi';
import MessageBubble from './MessageBubble';

const WELCOME_MESSAGE = {
  role: 'ai',
  content:
    "Hi! I'm **PantryChef AI** 🍳\n\nHere's what I can do for you:\n- Tell you what dishes you can make with your current pantry\n- Generate full step-by-step recipes on request\n- Find the exact missing ingredients for any dish you're craving\n\nTry asking: *\"What can I make for dinner?\"* or *\"I'm craving biryani — what am I missing?\"*",
};

function ChatWindow() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const MAX_CHARS = 500;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  const getHistory = useCallback((msgs) => {
    return msgs
      .filter((m) => m.role === 'user' || m.role === 'ai')
      .slice(-20) // cap at last 20 messages
      .map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages([...updatedMessages, { role: 'loading' }]);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const history = getHistory(updatedMessages);
      const reply = await sendMessage(text, history.slice(0, -1));
      setMessages([...updatedMessages, { role: 'ai', content: reply }]);
    } catch (err) {
      setError('Something went wrong. Please check your connection and try again.');
      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setError('');
    inputRef.current?.focus();
  };

  const charsLeft = MAX_CHARS - input.length;

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-header-title">💬 Chat with PantryChef AI</span>
        {messages.length > 1 && (
          <button
            className="clear-chat-btn"
            onClick={handleClearChat}
            title="Start a new conversation"
          >
            New Chat
          </button>
        )}
      </div>

      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="chat-error" role="alert">
          <span>⚠️ {error}</span>
          <button
            className="error-dismiss"
            onClick={() => setError('')}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="What would you like to cook? (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            aria-label="Message input"
          />
          {input.length > 400 && (
            <span
              className={`char-counter ${charsLeft < 20 ? 'char-counter--warn' : ''}`}
              aria-live="polite"
            >
              {charsLeft}
            </span>
          )}
        </div>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          title="Send message"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;