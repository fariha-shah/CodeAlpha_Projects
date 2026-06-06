import { useState, useRef, useEffect } from 'react';
import { Send, Lock, MessageSquare } from 'lucide-react';
import styles from './Chat.module.css';

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Chat({ messages, sendMessage }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <MessageSquare size={15} />
        <span>Encrypted Chat</span>
        <div className={styles.encBadge}>
          <Lock size={10} />
          <span>E2E Encrypted</span>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <Lock size={32} color="#444" />
            <p>No messages yet</p>
            <span>Messages are end-to-end encrypted</span>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${msg.isMine ? styles.mine : styles.theirs}`}
            >
              {!msg.isMine && (
                <span className={styles.sender}>{msg.sender}</span>
              )}
              <div className={styles.bubble}>
                <p>{msg.text}</p>
                <div className={styles.meta}>
                  <Lock
                    size={9}
                    color={msg.isMine ? 'rgba(255,255,255,0.5)' : '#555'}
                  />
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.input}
            placeholder="Type a message... (Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={16} />
          </button>
        </div>
        <div className={styles.encNote}>
          <Lock size={10} color="#555" />
          <span>Messages are encrypted before sending</span>
        </div>
      </div>
    </div>
  );
}
