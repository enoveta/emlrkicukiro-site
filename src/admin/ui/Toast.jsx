import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="admin-ui flex min-w-[260px] max-w-sm items-start gap-3 rounded-xl border border-[#e9e5dc] bg-white px-4 py-3 text-sm text-ink shadow-[0_12px_32px_rgba(20,54,66,.14)]"
          >
            <span
              className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full text-[11px] font-bold text-white ${
                t.type === 'error' ? 'bg-[#d92d20]' : t.type === 'info' ? 'bg-ink' : 'bg-[#17b26a]'
              }`}
              aria-hidden="true"
            >
              {t.type === 'error' ? '!' : t.type === 'info' ? 'i' : '✓'}
            </span>
            <span className="font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { push: () => {} };
  return ctx;
}
