import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaTimes, FaPaperPlane, FaRedo } from 'react-icons/fa';
import logo from '../assets/emlr/logo1.png';
import { publicApi } from '../api/client';
import { useSettings } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

const MAX_HISTORY = 10;
const STORAGE_KEY = 'emlr_chat';

const loadHistory = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

/** Renders **bold** and site paths like /amatangazo as links, without injecting HTML. */
function RichText({ text, onNavigate }) {
  return text.split('\n').map((line, li) => (
    <Fragment key={li}>
      {li > 0 ? <br /> : null}
      {line.split(/(\*\*[^*]+\*\*|(?:^|\s)\/[a-z][a-z0-9/-]*)/gi).map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
        const path = part.trim();
        if (/^\/[a-z][a-z0-9/-]*$/i.test(path)) {
          return (
            <Fragment key={i}>
              {part.startsWith(' ') ? ' ' : ''}
              <Link to={path} onClick={onNavigate} className="font-semibold text-[#1a6f99] underline underline-offset-2">
                {path}
              </Link>
            </Fragment>
          );
        }
        return <Fragment key={i}>{part.replace(/^\* /, '• ')}</Fragment>;
      })}
    </Fragment>
  ));
}

const Avatar = () => (
  <span className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
    <img src={logo} alt="" className="w-6 h-6 object-contain" />
  </span>
);

/** Church assistant: answers via the backend (Gemini), grounded in the church's published content. */
const ChatBot = () => {
  const { t, get } = useLanguage();
  const settings = useSettings();
  const phone = settings.phone || '+250 788 524 792';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, sending, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    // Phones: the panel is full-height, so stop the page behind it from scrolling.
    const small = window.matchMedia('(max-width: 639px)').matches;
    if (small) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Grow the textarea with its content (up to ~5 lines).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input, isOpen]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || sending) return;
    const history = [...messages, { role: 'user', text: question }];
    setMessages(history);
    setInput('');
    setSending(true);
    try {
      const { reply } = await publicApi.post('/chat', {
        messages: history
          .filter((m) => !m.error)
          .slice(-MAX_HISTORY)
          .map(({ role, text: body }) => ({ role, text: body })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: t('chat.error', { phone }), error: true }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = get('chat.suggestions') || [];
  const close = () => setIsOpen(false);

  return (
    <div className="print-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 bg-[#003366] hover:bg-[#001d3a] text-white rounded-full p-4 shadow-lg z-40 transition-colors ${
          isOpen ? 'hidden sm:block' : ''
        }`}
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaComments className="text-2xl" />}
      </button>

      {isOpen && (
        <div
          className="fixed z-50 flex flex-col bg-white shadow-2xl overflow-hidden border border-gray-200
            inset-x-0 bottom-0 top-[8vh] rounded-t-2xl
            sm:inset-auto sm:bottom-24 sm:right-6 md:right-8 sm:w-[420px] sm:h-[min(640px,calc(100vh-8rem))] sm:rounded-2xl"
          role="dialog"
          aria-modal="false"
          aria-label={t('chat.title')}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#001d3a] to-[#003366] text-white">
            <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
              <img src={logo} alt="" className="w-8 h-8 object-contain" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-base leading-tight">{t('chat.title')}</h2>
              <p className="flex items-center gap-1.5 text-xs text-white/75">
                <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                {t('chat.status')}
              </p>
            </div>
            {messages.length ? (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label={t('chat.newChat')}
                title={t('chat.newChat')}
              >
                <FaRedo aria-hidden="true" />
              </button>
            ) : null}
            <button type="button" onClick={close} className="p-2 rounded-full hover:bg-white/10" aria-label={t('chat.close')}>
              <FaTimes className="text-lg" aria-hidden="true" />
            </button>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto bg-[#f5f8fb] px-4 py-5 space-y-4" aria-live="polite">
            {messages.length === 0 ? (
              <div>
                <div className="flex items-end gap-2">
                  <Avatar />
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white border border-gray-200 px-4 py-3 text-[15px] leading-relaxed text-gray-800 shadow-sm">
                    {t('chat.welcome')}
                  </div>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-6 mb-2">{t('chat.tryAsking')}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="text-left text-sm bg-white border border-[#c9d8e6] text-[#003366] hover:bg-[#e8f5fb] hover:border-[#5fb9e2] rounded-full px-3.5 py-2 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) =>
                msg.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#003366] text-white px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-line shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-end gap-2">
                    <Avatar />
                    <div
                      className={`max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed shadow-sm border ${
                        msg.error ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-gray-200 text-gray-800'
                      }`}
                    >
                      <RichText text={msg.text} onNavigate={close} />
                    </div>
                  </div>
                )
              )
            )}
            {sending && (
              <div className="flex items-end gap-2" aria-label="…">
                <Avatar />
                <div className="rounded-2xl rounded-bl-md bg-white border border-gray-200 px-4 py-3.5 flex gap-1.5 shadow-sm">
                  {[0, 0.15, 0.3].map((d) => (
                    <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <form
            className="border-t border-gray-200 bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2 rounded-2xl border border-gray-300 bg-white pl-4 pr-1.5 py-1.5 focus-within:border-[#5fb9e2] focus-within:ring-2 focus-within:ring-[#5fb9e2]/30">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={t('chat.placeholder')}
                aria-label={t('chat.placeholder')}
                className="flex-1 min-w-0 resize-none bg-transparent py-2 text-[15px] leading-snug focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="shrink-0 w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#001d3a] transition-colors"
                aria-label={t('chat.send')}
              >
                <FaPaperPlane aria-hidden="true" />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 text-center">{t('chat.disclaimer')}</p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
