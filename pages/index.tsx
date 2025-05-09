import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { sanityClient } from '../lib/sanity';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import StickySearch from '../components/StickySearch';
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
      
      {/* Sticky Search that appears only when scrolled down */}
      <div className="relative">
        <StickySearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          language={language}
          allWords={words}
        />
      </div>
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700 mb-6">
            {language === 'english' ? 'The Thai Dictionary 🇹🇭' : '泰语词典 🇹🇭'}
          </h1>
          
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            language={language}
            allWords={words}
          />
        </div>
        
        <DictionaryTable 
          words={filteredWords} 
          language={language}
        />

        {/* Request Word Button */}
        <div className="w-full max-w-2xl mx-auto mt-10 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm border border-pink-200 text-pink-600 hover:text-pink-800 hover:bg-pink-50 transition-colors"
          >
            {language === 'english' 
              ? "Can't find a word? Request it here 📩" 
              : "找不到单词？点此请求添加 📩"}
          </button>
        </div>
      </main>

      <footer className="mt-10 py-6 px-4 border-t border-pink-100 bg-white/80">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-2xl mb-2">
            {language === 'english' ? '🇹🇭 🌴 🍍 🌺' : '泰语 🌴 🍍 🌺'}
          </div>
          <p className="text-sm text-pink-700">
            © {new Date().getFullYear()} {language === 'english' ? 'The Thai Dictionary' : '泰语词典'}
          </p>
        </div>
      </footer>

      {isModalOpen && (
        <RequestWordModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch all dictionary entries from Sanity
    const words = await sanityClient.fetch();

    return {
      props: {
        words,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        words: [], // Return empty array in case of error
      }
    };
  }
};
