import { useEffect, useRef, useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { publicApi } from '../api/client';
import { useSettings } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

const MAX_HISTORY = 10;

/** Church assistant: answers via the backend (Gemini), grounded in the church's published content. */
const ChatBot = () => {
  const { t, get } = useLanguage();
  const settings = useSettings();
  const phone = settings.phone || '+250 788 524 792';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || sending) return;
    const history = [...messages, { role: 'user', text: question }];
    setMessages(history);
    setInput('');
    setSending(true);
    try {
      const { reply } = await publicApi.post('/chat', {
        messages: history.filter((m) => !m.error).slice(-MAX_HISTORY).map(({ role, text: body }) => ({ role, text: body })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: t('chat.error', { phone }), error: true }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = get('chat.suggestions') || [];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-5 md:bottom-8 md:right-8 bg-[#003366] hover:bg-[#001d3a] text-white rounded-full p-4 shadow-lg z-40 transition-colors"
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaComments className="text-2xl" />}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-8 sm:w-96 max-h-[75vh] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden"
          role="dialog"
          aria-label={t('chat.title')}
        >
          <div className="bg-[#003366] text-white px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold">{t('chat.title')}</h2>
            <button type="button" onClick={() => setIsOpen(false)} className="hover:text-[#feed17]" aria-label={t('chat.close')}>
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-[200px]" aria-live="polite">
            {messages.length === 0 ? (
              <div className="text-gray-600 text-sm">
                <p className="mb-4">{t('chat.welcome')}</p>
                <p className="text-xs uppercase font-semibold text-gray-500 mb-2">{t('chat.tryAsking')}</p>
                <div className="space-y-2">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="block w-full text-left text-sm bg-white border border-gray-200 hover:border-[#5fb9e2] rounded-lg px-3 py-2"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#003366] text-white rounded-br-none'
                        : `bg-white border rounded-bl-none ${msg.error ? 'border-red-200 text-red-700' : 'border-gray-200 text-gray-800'}`
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex space-x-1 p-2" aria-label="...">
                {[0, 0.2, 0.4].map((d) => (
                  <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-gray-200 p-3 bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                aria-label={t('chat.placeholder')}
                className="flex-1 min-w-0 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5fb9e2]"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="bg-[#003366] text-white px-4 rounded-r-lg disabled:opacity-50 hover:bg-[#001d3a]"
                aria-label={t('chat.send')}
              >
                <FaPaperPlane />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">{t('chat.disclaimer')}</p>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
