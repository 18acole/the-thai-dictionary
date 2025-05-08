import { useState } from 'react';
import { Word } from '../pages/index';

interface TableRowProps {
  word: Word;
  language: 'english' | 'chinese';
}

export default function TableRow({ word, language }: TableRowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // This is just UI state since we don't have a login system
  };

  return (
    <tr className="hover:bg-pink-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {language === 'english' ? word.english : word.chinese}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{word.thai}</div>
        <div className="text-xs text-gray-500">{word.romanized}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`p-2 rounded-full ${
            isPlaying 
              ? 'bg-purple-200 text-purple-600' 
              : 'bg-purple-100 text-purple-500 hover:bg-purple-200'
          }`}
        >
          {isPlaying ? '🔊' : '🔈'}
        </button>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={toggleFavorite}
          className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </td>
    </tr>
  );
}
