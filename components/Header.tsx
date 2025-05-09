import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  language: 'english' | 'chinese';
  setLanguage: (language: 'english' | 'chinese') => void;
}

export default function Header({ language, setLanguage }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show title when scrolled down
  useEffect(() => {
    function handleScroll() {
      // Show title when scrolled down enough that hero is not visible
      // Hero height is approximately 200px
      setShowTitle(window.scrollY > 200);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectLanguage = (newLanguage: 'english' | 'chinese') => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-pink-100 p-3">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        {/* Language selector - now on left */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors px-3 py-1"
            aria-expanded={isDropdownOpen}
          >
            <span className="text-pink-500 text-lg">🌐</span>
            <span>{language === 'english' ? '🇬🇧 English' : '🇨🇳 Chinese'}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className={`${
                    language === 'english' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  } group w-full flex items-center px-4 py-2 text-sm hover:bg-pink-50`}
                  onClick={() => selectLanguage('english')}
                  role="menuitem"
                >
                  🇬🇧 English
                </button>
                <button
                  className={`${
                    language === 'chinese' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  } group w-full flex items-center px-4 py-2 text-sm hover:bg-pink-50`}
                  onClick={() => selectLanguage('chinese')}
                  role="menuitem"
                >
                  🇨🇳 Chinese
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Title in center - only visible when scrolled */}
        <div className="flex-1 flex justify-center">
          {showTitle && (
            <h2 className="text-xl font-bold text-purple-700 transition-opacity duration-300">
              {language === 'english' ? 'The Thai Dictionary 🇹🇭' : '泰语词典 🇹🇭'}
            </h2>
          )}
        </div>
        
        {/* Right side spacer for balance */}
        <div className="w-[100px]"></div>
      </div>
    </header>
  );
}
