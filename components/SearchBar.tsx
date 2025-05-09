import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Word } from '../pages/index';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'english' | 'chinese';
  allWords?: Word[];
}

export default function SearchBar({ searchQuery, setSearchQuery, language, allWords = [] }: SearchBarProps) {
  const [heroInputValue, setHeroInputValue] = useState('');
  const [heroSuggestions, setHeroSuggestions] = useState<Word[]>([]);
  
  // Sync hero input with global searchQuery when it changes externally (only once on init)
  useEffect(() => {
    setHeroInputValue(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filter suggestions based on hero input
  useEffect(() => {
    const input = heroInputValue.toLowerCase().trim();
    
    // Only show suggestions when input is 2+ characters
    if (input.length < 2 || !allWords?.length) {
      setHeroSuggestions([]);
      return;
    }
    
    // Filter based on the current language
    const matches = allWords.filter(word => {
      if (language === 'english' && word.english) {
        return word.english.toLowerCase().includes(input);
      } else if (language === 'chinese' && word.chinese) {
        return word.chinese.toLowerCase().includes(input);
      }
      return false;
    });
    
    setHeroSuggestions(matches.slice(0, 5)); // Max 5 suggestions
  }, [heroInputValue, language, allWords]);
  
  // Handle input change in hero search
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHeroInputValue(e.target.value);
  };
  
  // Submit search and update global state
  const submitHeroSearch = (value: string) => {
    setSearchQuery(value); // Update global search query
    setHeroSuggestions([]); // Close dropdown
    
    // Optionally scroll to results
    const resultsElement = document.getElementById('results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Clear search functionality
  const clearSearch = () => {
    setHeroInputValue("");
    setSearchQuery("");
    setHeroSuggestions([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (word: Word) => {
    const value = language === 'english' ? word.english : word.chinese;
    setHeroInputValue(value);
    submitHeroSearch(value);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitHeroSearch(heroInputValue);
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleDocumentClick() {
      setHeroSuggestions([]);
    }
    
    if (heroSuggestions.length > 0) {
      document.addEventListener('click', handleDocumentClick);
      return () => document.removeEventListener('click', handleDocumentClick);
    }
  }, [heroSuggestions.length]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative w-full mb-2">
        <input
          type="text"
          value={heroInputValue}
          onChange={handleInputChange}
          placeholder={language === 'english' 
            ? "🔎 Search Thai words..." 
            : "🔎 搜索泰语单词..."}
          className="w-full h-14 pl-4 pr-24 text-lg rounded-full border-2 border-pink-300 focus:border-purple-500 shadow-md"
        />
        {heroInputValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-[100px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✖️
          </button>
        )}
        <button 
          type="submit"
          className="absolute right-1 top-1 h-12 px-6 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <span className="flex items-center">
            {language === 'english' ? 'Search' : '搜索'}
          </span>
        </button>
        
        {/* Word prediction dropdown */}
        {heroSuggestions.length > 0 && (
          <div 
            className="absolute top-full mt-2 w-full bg-white border border-pink-200 rounded-xl shadow-lg z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {heroSuggestions.map((word, idx) => (
                <button
                  key={word._id || idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSuggestion(word);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-pink-50 transition-colors text-sm border-b last:border-b-0 border-pink-100"
                >
                  <span className="font-medium">
                    {language === 'english' ? word.english : word.chinese}
                  </span>
                  <span className="mx-2 text-gray-400">—</span>
                  <span className="text-pink-600">{word.thai}</span>
                  <span className="text-gray-500 ml-2 italic">
                    ({language === 'english' 
                      ? word.romanized 
                      : word.pinyin || word.romanized})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-pink-700">
        {language === 'english'
          ? "Learn Thai instantly — from a native, not a robot 🤖❌"
          : "由泰国本地人发音，不是机器人 🤖❌"}
      </p>
    </form>
  );
}
