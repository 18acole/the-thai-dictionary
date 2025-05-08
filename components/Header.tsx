import { useState, useRef, useEffect, FormEvent } from 'react';

interface HeaderProps {
  language: 'english' | 'chinese';
  setLanguage: (language: 'english' | 'chinese') => void;
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({ language, setLanguage, showSearch, searchQuery, setSearchQuery }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectLanguage = (newLanguage: 'english' | 'chinese') => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-pink-100 p-3">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors px-3 py-1"
            aria-expanded={isDropdownOpen}
          >
            <span className="text-pink-500 text-lg">🌐</span>
            <span>{language === 'english' ? 'us English' : 'cn Chinese'}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className={`${
                    language === 'english' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  } group w-full flex items-center px-4 py-2 text-sm hover:bg-pink-50`}
                  onClick={() => selectLanguage('english')}
                  role="menuitem"
                >
                  us English
                </button>
                <button
                  className={`${
                    language === 'chinese' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  } group w-full flex items-center px-4 py-2 text-sm hover:bg-pink-50`}
                  onClick={() => selectLanguage('chinese')}
                  role="menuitem"
                >
                  cn Chinese
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Header Search Box - appears when scrolled past main search */}
        {showSearch && setSearchQuery && (
          <div className="flex-1 max-w-sm ml-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="🔎 Search..."
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1 px-3 text-sm rounded-full border border-pink-200 focus:border-pink-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-pink-500"
                aria-label="Search"
              >
                <span className="text-xs">🔍</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
