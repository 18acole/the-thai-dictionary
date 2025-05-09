import { useState } from 'react';
import { Word } from '../pages/index';

interface TableRowProps {
  word: Word;
  language: 'english' | 'chinese';
}

export default function TableRow({ word, language }: TableRowProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const audio = new Audio(word.audioUrl);
    
    audio.onended = () => {
      setIsPlaying(false);
    };
    
    audio.onerror = () => {
      console.error('Error playing audio');
      setIsPlaying(false);
    };
    
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  };

  return (
    <tr className="border-b border-pink-50 hover:bg-pink-50">
      <td className="py-4 text-purple-800 font-medium">
        {language === 'english' ? word.english : word.chinese}
      </td>
      
      <td className="py-4">
        <div className="text-purple-800">{word.thai}</div>
        <div className="text-xs text-gray-500">
          {language === 'english' 
            ? word.romanized 
            : word.pinyin || word.romanized /* Fallback to romanized if pinyin not available */}
        </div>
      </td>
      
      <td className="py-4 text-center">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className="text-gray-500 hover:text-purple-600 focus:outline-none"
        >
          {isPlaying ? '🔊' : '🔊'}
        </button>
      </td>
    </tr>
  );
}
