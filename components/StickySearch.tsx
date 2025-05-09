import { useState, useEffect } from 'react';

interface StickySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language?: 'english' | 'chinese';
}

export default function StickySearch({ searchQuery, setSearchQuery, language = 'english' }: StickySearchProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to handle scroll
    const handleScroll = () => {
      // Show sticky search when scrolled down 300px
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      
      // Using the threshold with a clean toggle
      setIsVisible(scrollPosition > 300);
    };

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial position
    handleScroll();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is real-time, this just prevents form submission
  };

  return (
    <div 
      className={`fixed top-14 left-0 right-0 z-30 w-full transition-all duration-200 ease-in-out ${
        isVisible 
          ? 'opacity-100 transform-none' 
          : 'opacity-0 -translate-y-5 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="bg-white/90 backdrop-blur-sm shadow-md border-b border-pink-200 py-2 px-4">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleChange}
              placeholder={language === 'english' 
                ? "🔍 Search Thai..."
                : "🔍 搜索泰语..."}
              className="flex-1 rounded-full border border-pink-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 text-sm rounded-full font-medium"
            >
              {language === 'english' ? 'Search' : '搜索'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}