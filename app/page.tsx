"use client";

import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, UserCircle, Bot, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

const PERSONAS = [
  {
    id: 'anshuman',
    name: 'Anshuman Singh',
    description: 'Pragmatic & direct. Focuses on patterns & core systems.',
    chips: [
      "How do I get into FAANG?",
      "Is CP really needed?",
      "Why did you start Scaler?"
    ]
  },
  {
    id: 'abhimanyu',
    name: 'Abhimanyu Saxena',
    description: 'Reflective & systemic. Values hard work & community.',
    chips: [
      "I code daily but feel stuck.",
      "Most important skill for devs?",
      "Why is community important?"
    ]
  },
  {
    id: 'kshitij',
    name: 'Kshitij Mishra',
    description: 'Supportive & detailed. Breaks down DSA fundamentals.',
    chips: [
      "I don't understand DP.",
      "Frameworks or DSA?",
      "I failed my mock interview."
    ]
  }
];

type Message = {
  role: 'user' | 'assistant' | 'error';
  content: string;
  options?: string[];
  type?: 'chat' | 'quiz';
  quiz?: {
    question: string;
    choices: string[];
    correctAnswer: string;
  };
};

function QuizCard({ quiz, onAnswer }: { quiz: NonNullable<Message['quiz']>, onAnswer: (ans: string, isCorrect: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    const isCorrect = choice === quiz.correctAnswer;
    setTimeout(() => {
      onAnswer(choice, isCorrect);
    }, 1500);
  };

  return (
    <div className={styles.quizCard}>
      <h4 className={styles.quizHeader}>{quiz.question}</h4>
      <div className={styles.quizChoices}>
        {quiz.choices.map((choice: string, idx: number) => {
          let choiceClass = styles.quizChoice;
          if (selected) {
            if (choice === quiz.correctAnswer) choiceClass += ` ${styles.quizChoiceCorrect}`;
            else if (choice === selected) choiceClass += ` ${styles.quizChoiceIncorrect}`;
            else choiceClass += ` ${styles.quizChoiceDisabled}`;
          }
          return (
            <button key={idx} className={choiceClass} onClick={() => handleSelect(choice)} disabled={!!selected}>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handlePersonaChange = (persona: typeof PERSONAS[0]) => {
    setActivePersona(persona);
    setMessages([]);
    setInput('');
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          personaId: activePersona.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply, options: data.options, type: data.type, quiz: data.quiz }]);
    } catch (error: any) {
      console.error(error);
      setMessages([...newMessages, { role: 'error', content: error.message || 'An error occurred. Please check your API key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Scaler Mentors AI</h1>
        <p className={styles.subtitle}>Get guidance directly from the founders and top instructors.</p>
      </header>

      <div className={styles.switcher}>
        {PERSONAS.map(p => (
          <button
            key={p.id}
            className={`${styles.personaBtn} ${activePersona.id === p.id ? styles.active : ''}`}
            onClick={() => handlePersonaChange(p)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <section className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <Bot size={48} className="animate-fade-in" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
              <h3>Chat with {activePersona.name}</h3>
              <p>{activePersona.description}</p>
              
              <div className={styles.chips}>
                {activePersona.chips.map((chip, i) => (
                  <button 
                    key={i} 
                    className={styles.chip}
                    onClick={() => sendMessage(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`${styles.messageRow} ${styles[msg.role]} animate-fade-in`}>
                {msg.role !== 'user' && <div className={styles.avatar}><Bot size={24} /></div>}
                
                <div className={styles.messageContent}>
                  <div className={`${styles.messageBubble} ${msg.role === 'error' ? styles.errorBubble : ''}`}>
                    {msg.role === 'error' && <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}/>}
                    {msg.content}
                  </div>
                  
                  {msg.type === 'quiz' && msg.quiz && (
                    <QuizCard 
                      quiz={msg.quiz} 
                      onAnswer={(ans, isCorrect) => {
                        sendMessage(`I chose: "${ans}". ${isCorrect ? "I think that's right!" : "Is that wrong?"}`);
                      }} 
                    />
                  )}

                  {msg.options && msg.options.length > 0 && (
                    <div className={styles.dynamicChips}>
                      {msg.options.map((opt, i) => (
                        <button key={i} className={styles.chip} onClick={() => sendMessage(opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && <div className={styles.avatar}><UserCircle size={24} /></div>}
              </div>
            ))
          )}

          {isLoading && (
            <div className={`${styles.messageRow} ${styles.assistant} animate-fade-in`}>
              <div className={styles.avatar}><Bot size={24} /></div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ margin: '0 4px' }}></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <form 
            className={styles.inputForm}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder={`Ask ${activePersona.name} a question...`}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              rows={1}
            />
            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading}
            >
              <SendHorizontal size={24} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
