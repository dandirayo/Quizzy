import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './ChatRoomPage.module.css';

export default function ChatRoomPage() {
  const { roomId: _roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data dari halaman lobby (saat dummy match)
  const partnerMbti = location.state?.partnerMbti || 'INTJ';
  const partnerName = location.state?.partnerName || 'Anonim';
  const revealedName = location.state?.revealedName || 'Quizzy Bot';
  const revealedUsername = location.state?.revealedUsername || 'quizzy_bot';
  const revealedAvatar = location.state?.revealedAvatar || '🤖';
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: `Kamu terhubung dengan seorang ${partnerMbti}! Mulai ngobrol 👋` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [hasRevealed, setHasRevealed] = useState(false);
  const [partnerRevealed, setPartnerRevealed] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Tambah pesan sendiri
    const newMsg = { id: Date.now(), sender: 'me', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    // Simulasi balasan (Dummy bot)
    setTimeout(() => {
      const replies = [
        "Oh gitu ya? Seru banget!",
        "Hahaha iya bener.",
        "Eh, btw kamu tipe MBTI apa?",
        "Menarik, aku baru tau soal itu.",
        "Setuju! Sebagai " + partnerMbti + " aku juga ngerasa gitu."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'partner', text: randomReply }]);
    }, 1500 + Math.random() * 2000);
  };

  const handleReveal = () => {
    if (hasRevealed) return;
    setHasRevealed(true);
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      sender: 'system', 
      text: 'Kamu meminta untuk mengungkap identitas.' 
    }]);

    // Simulasi partner menyetujui reveal
    setTimeout(() => {
      setPartnerRevealed(true);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'system', 
        text: `🎉 Identitas terungkap! Lawan bicaramu adalah "${revealedName}" (@${revealedUsername}) - ${partnerMbti}.` 
      }]);
    }, 2500);
  };

  const handleEndChat = () => {
    if (window.confirm('Yakin ingin meninggalkan obrolan?')) {
      navigate('/chat');
    }
  };

  const displayPartnerName = partnerRevealed ? `${revealedName} (@${revealedUsername})` : partnerName;
  const displayPartnerAvatar = partnerRevealed ? revealedAvatar : '👻';

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.btnLeave} onClick={handleEndChat}>
            <span className={styles.icon}>&times;</span> Keluar
          </button>
        </div>
        
        <div className={styles.headerCenter}>
          <div className={styles.partnerAvatar}>{displayPartnerAvatar}</div>
          <div className={styles.partnerInfo}>
            <div className={styles.partnerName}>{displayPartnerName}</div>
            <div className={styles.partnerMbti}>{partnerMbti}</div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button 
            className={`${styles.btnReveal} ${hasRevealed ? styles.revealed : ''}`}
            onClick={handleReveal}
            disabled={hasRevealed}
          >
            {partnerRevealed ? '🎭 Terungkap' : (hasRevealed ? '⏳ Menunggu...' : '🎭 Reveal')}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className={styles.systemMessage}>
                <span>{msg.text}</span>
              </div>
            );
          }

          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`${styles.messageWrapper} ${isMe ? styles.messageRight : styles.messageLeft}`}>
              {!isMe && <div className={styles.messageAvatar}>{displayPartnerAvatar}</div>}
              <div className={`${styles.messageBubble} ${isMe ? styles.bubbleMe : styles.bubblePartner}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Ketik pesan di sini..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        <button 
          type="submit" 
          className={styles.btnSend}
          disabled={!inputValue.trim()}
        >
          ➤
        </button>
      </form>
    </div>
  );
}
