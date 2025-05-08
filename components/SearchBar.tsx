import { ChangeEvent, FormEvent } from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'english' | 'chinese';
}

export default function SearchBar({ searchQuery, setSearchQuery, language }: SearchBarProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // The search actually happens in real-time, this just prevents form submission
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex rounded-full overflow-hidden shadow-md bg-white">
        <div className="flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={`🔎 Search Thai words...`}
            className="w-full h-12 px-6 focus:outline-none"
          />
        </div>
        <button 
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 h-12 transition-colors"
        >
          Search
        </button>
      </div>
      <p className="text-center text-sm mt-2 text-purple-400">
        Instantly find Thai translations ✨
      </p>
    </form>
  );
}
