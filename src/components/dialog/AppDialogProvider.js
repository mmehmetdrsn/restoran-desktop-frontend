import React, { createContext, useContext, useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AppDialogContext = createContext(null);

export const AppDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const [promptValue, setPromptValue] = useState('');

  const closeDialog = (result) => {
    if (dialog?.resolve) {
      dialog.resolve(result);
    }
    setDialog(null);
    setPromptValue('');
  };

  const confirm = (options) => {
    const opts = typeof options === 'string' ? { message: options } : (options || {});

    return new Promise((resolve) => {
      setDialog({
        type: 'confirm',
        title: opts.title || 'Onay Gerekli',
        message: opts.message || '',
        confirmText: opts.confirmText || 'Tamam',
        cancelText: opts.cancelText || 'Iptal',
        danger: !!opts.danger,
        resolve,
      });
    });
  };

  const prompt = (options) => {
    const opts = typeof options === 'string' ? { message: options } : (options || {});

    return new Promise((resolve) => {
      setPromptValue(opts.defaultValue || '');
      setDialog({
        type: 'prompt',
        title: opts.title || 'Bilgi Girin',
        message: opts.message || '',
        placeholder: opts.placeholder || '',
        confirmText: opts.confirmText || 'Tamam',
        cancelText: opts.cancelText || 'Iptal',
        resolve,
      });
    });
  };

  const value = useMemo(() => ({ confirm, prompt }), []);

  return (
    <AppDialogContext.Provider value={value}>
      {children}

      {dialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-lg">{dialog.title}</h2>
              <button
                type="button"
                onClick={() => closeDialog(dialog.type === 'prompt' ? null : false)}
                className="text-gray-400 hover:text-white"
                aria-label="Kapat"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {dialog.message && (
              <p className="text-gray-300 text-sm whitespace-pre-line mb-4">{dialog.message}</p>
            )}

            {dialog.type === 'prompt' && (
              <input
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder={dialog.placeholder}
                autoFocus
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-white/25 outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    closeDialog(promptValue);
                  }
                }}
              />
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => closeDialog(dialog.type === 'prompt' ? null : false)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all"
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                onClick={() => closeDialog(dialog.type === 'prompt' ? promptValue : true)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${dialog.danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-300 hover:bg-indigo-200 text-black'}`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppDialogContext.Provider>
  );
};

export const useAppDialog = () => {
  const context = useContext(AppDialogContext);
  if (!context) {
    throw new Error('useAppDialog must be used within AppDialogProvider');
  }
  return context;
};
