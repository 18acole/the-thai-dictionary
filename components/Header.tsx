import { useState } from 'react';

interface HeaderProps {
  language: 'english' | 'chinese';
  setLanguage: (language: 'english' | 'chinese') => void;
}

export default function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-pink-100 p-3">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => setLanguage(language === 'english' ? 'chinese' : 'english')}
            className="flex items-center gap-1 text-pink-600 hover:text-pink-800 transition-colors px-3 py-1 rounded-full bg-white hover:bg-pink-50"
          >
            <span className="text-lg">🌐</span>
            <span>{language === 'english' ? '🇺🇸 English' : '🇨🇳 Chinese'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
