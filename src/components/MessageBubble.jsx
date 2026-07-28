function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isLoading = message.role === 'loading';

  if (isLoading) {
    return (
      <div className="bubble-row bubble-row--ai">
        <div className="bubble-avatar">🍽️</div>
        <div className="bubble bubble--loading">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bubble-row ${isUser ? 'bubble-row--user' : 'bubble-row--ai'}`}>
      {!isUser && <div className="bubble-avatar">🍽️</div>}
      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--ai'}`}>
        <p className="bubble-text">{message.content}</p>
      </div>
      {isUser && <div className="bubble-avatar bubble-avatar--user">👤</div>}
    </div>
  );
}

export default MessageBubble;