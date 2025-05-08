import { useState, useEffect, useRef } from 'react';
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
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Handle scrolling to show/hide header search
  useEffect(() => {
    const handleScroll = () => {
      if (!searchSectionRef.current) return;
      
      const searchSectionPosition = searchSectionRef.current.getBoundingClientRect();
      // Show header search when the main search section goes out of view
      if (searchSectionPosition.bottom < 0) {
        setShowHeaderSearch(true);
      } else {
        setShowHeaderSearch(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        showSearch={showHeaderSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl mx-auto mb-8" ref={searchSectionRef}>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700 mb-6">
            The Thai Dictionary 🇹🇭
          </h1>
          
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            language={language}
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
            Can't find a word? Request it here 📩
          </button>
        </div>
      </main>

      <footer className="mt-10 py-6 px-4 border-t border-pink-100 bg-white/80">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-2xl mb-2">🇹🇭 🌴 🍍 🌺</div>
          <p className="text-sm text-pink-700">© {new Date().getFullYear()} The Thai Dictionary</p>
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
