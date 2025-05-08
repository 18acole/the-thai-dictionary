import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { sanityClient } from '../lib/sanity';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import DictionaryTable from '../components/DictionaryTable';
import RequestWordModal from '../components/RequestWordModal';

export interface Word {
  _id: string;
  english: string;
  chinese: string;
  thai: string;
  romanized: string;
  audioUrl: string;
}

interface HomeProps {
  words: Word[];
}

export default function Home({ words }: HomeProps) {
  const [language, setLanguage] = useState<'english' | 'chinese'>('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWords(words);
      return;
    }

    const filtered = words.filter((word) => {
      if (language === 'english') {
        return word.english.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return word.chinese.includes(searchQuery);
      }
    });

    setFilteredWords(filtered);
  }, [searchQuery, language, words]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700 mb-6">
          The Thai Dictionary 🇹🇭
        </h1>
        
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          language={language}
        />
        
        <p className="text-center mt-3 mb-8 text-purple-500 cursor-pointer hover:text-purple-700"
           onClick={() => setIsModalOpen(true)}>
          Can't find a word? Request it here 📩
        </p>
        
        <DictionaryTable 
          words={filteredWords} 
          language={language}
        />
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-pink-700">
        <div className="text-2xl mb-2">
          🇹🇭 🌴 🍍 🌺
        </div>
        <p>© 2025 The Thai Dictionary</p>
        <div className="flex justify-center gap-4 mt-2 text-purple-600">
          <a href="#" className="hover:text-purple-800">
            📸 Instagram
          </a>
          <a href="#" className="hover:text-purple-800">
            🐦 Twitter
          </a>
        </div>
      </footer>

      {isModalOpen && (
        <RequestWordModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch all dictionary entries from Sanity
  const words = await sanityClient.fetch();

  return {
    props: {
      words,
    },
  };
};
