import { useState } from 'react';

interface HeaderProps {
  language: 'english' | 'chinese';
  setLanguage: (language: 'english' | 'chinese') => void;
}

export default function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="bg-white bg-opacity-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <button
            onClick={() => setLanguage(language === 'english' ? 'chinese' : 'english')}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors px-3 py-1 rounded-full bg-white hover:bg-purple-50"
          >
            <span className="text-lg">🌐</span>
            <span>{language === 'english' ? '🇺🇸 English' : '🇨🇳 Chinese'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
