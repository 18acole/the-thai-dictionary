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
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative w-full mb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="🔎 Search Thai words..."
          className="w-full h-14 pl-4 pr-24 text-lg rounded-full border-2 border-pink-300 focus:border-purple-500 shadow-md"
        />
        <button 
          type="submit"
          className="absolute right-1 top-1 h-12 px-6 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <span className="flex items-center">
            Search
          </span>
        </button>
      </div>
      <p className="text-center text-pink-700">
        Learn Thai instantly — from a native, not a robot 🤖❌
      </p>
    </form>
  );
}
