function formatAIText(text) {
  if (!text) return [];

  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={key++} className="bubble-spacer" />);
      continue;
    }

    // Numbered step: "1. ..." or "1) ..."
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (numberedMatch) {
      elements.push(
        <div key={key++} className="bubble-step">
          <span className="bubble-step-num">{numberedMatch[1]}</span>
          <span className="bubble-step-text">{renderInline(numberedMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Bullet: "- ..." or "• ..."
    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={key++} className="bubble-bullet">
          <span className="bubble-bullet-dot">•</span>
          <span>{renderInline(bulletMatch[1])}</span>
        </div>
      );
      continue;
    }

    // Section header: line ending with ":" that's short and bold-worthy
    // e.g. "Ingredients:", "Instructions:", "For the sauce:"
    if (trimmed.endsWith(':') && trimmed.length < 60 && !trimmed.includes('.')) {
      elements.push(
        <div key={key++} className="bubble-section-header">
          {trimmed}
        </div>
      );
      continue;
    }

    // Bold header: **text** as standalone line
    const boldHeader = trimmed.match(/^\*\*(.+)\*\*$/);
    if (boldHeader) {
      elements.push(
        <div key={key++} className="bubble-section-header">
          {boldHeader[1]}
        </div>
      );
      continue;
    }

    // Normal paragraph line
    elements.push(
      <p key={key++} className="bubble-para">
        {renderInline(trimmed)}
      </p>
    );
  }

  return elements;
}

function renderInline(text) {
  // Handle **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return <strong key={i}>{boldMatch[1]}</strong>;
    }
    return part;
  });
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isLoading = message.role === 'loading';

  if (isLoading) {
    return (
      <div className="bubble-row bubble-row--ai">
        <div className="bubble-avatar" aria-hidden="true">🍽️</div>
        <div className="bubble bubble--loading" aria-label="PantryChef is thinking">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-label">Thinking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bubble-row ${isUser ? 'bubble-row--user' : 'bubble-row--ai'}`}>
      {!isUser && (
        <div className="bubble-avatar" aria-hidden="true">🍽️</div>
      )}
      <div
        className={`bubble ${isUser ? 'bubble--user' : 'bubble--ai'}`}
        role={isUser ? undefined : 'article'}
      >
        {isUser ? (
          <p className="bubble-text">{message.content}</p>
        ) : (
          <div className="bubble-formatted">
            {formatAIText(message.content)}
          </div>
        )}
      </div>
      {isUser && (
        <div className="bubble-avatar bubble-avatar--user" aria-hidden="true">👤</div>
      )}
    </div>
  );
}

export default MessageBubble;