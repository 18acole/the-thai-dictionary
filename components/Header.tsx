import { useState } from 'react';

interface HeaderProps {
  language: 'english' | 'chinese';
  setLanguage: (language: 'english' | 'chinese') => void;
}

export default function Header({ language, setLanguage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => setLanguage(language === 'english' ? 'chinese' : 'english')}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100"
          >
            <span className="text-lg">🌐</span>
            <span>{language === 'english' ? '🇺🇸 English' : '🇨🇳 Chinese'}</span>
          </button>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-200 transition-colors"
          >
            <span>👤</span>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 text-sm text-gray-500">
                User features coming soon!
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
