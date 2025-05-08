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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-600 mb-8">
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

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-2xl mb-3">
          🇹🇭 🌴 🍍 🌺
        </div>
        <div className="text-pink-500">
          <a href="https://instagram.com" className="mx-3 hover:text-pink-700">
            📸 Instagram
          </a>
          <a href="https://twitter.com" className="mx-3 hover:text-pink-700">
            🐦 Twitter
          </a>
        </div>
        <div className="mt-4 text-gray-500 text-sm">
          © 2025 The Thai Dictionary
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
  const words = await sanityClient.fetch(`
    *[_type == "word"]{
      _id,
      english,
      chinese,
      thai,
      romanized,
      "audioUrl": audio.asset->url
    }
  `);

  return {
    props: {
      words,
    },
  };
};
