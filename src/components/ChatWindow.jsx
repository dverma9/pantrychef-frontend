import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../api/chatApi';
import MessageBubble from './MessageBubble';

const WELCOME_MESSAGE = {
  role: 'ai',
  content: "Hi! I'm PantryChef AI 🍳 Tell me what you're craving, ask me what to cook with your pantry, or request a full recipe. I'm here to help!",
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

  const getHistory = (msgs) => {
    return msgs
      .filter((m) => m.role === 'user' || m.role === 'ai')
      .map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));
  };

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
      setError('Something went wrong. Please try again.');
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

  const charsLeft = MAX_CHARS - input.length;

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-header-title">💬 Chat with PantryChef AI</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type your message... (Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          {input.length > 400 && (
            <span className={`char-counter ${charsLeft < 20 ? 'char-counter--warn' : ''}`}>
              {charsLeft}
            </span>
          )}
        </div>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          title="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;