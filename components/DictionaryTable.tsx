import { Word } from '../pages/index';
import TableRow from './TableRow';

interface DictionaryTableProps {
  words: Word[];
  language: 'english' | 'chinese';
}

export default function DictionaryTable({ words, language }: DictionaryTableProps) {
  return (
    <div id="results" className="w-full max-w-2xl mx-auto overflow-x-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 border border-pink-200">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-pink-100">
              <th className="py-3 text-left text-pink-700 font-bold">
                {language === 'english' ? '🇺🇸 English' : '🇨🇳 Chinese'}
              </th>
              <th className="py-3 text-left text-pink-700 font-bold">
                🇹🇭 Thai
              </th>
              <th className="py-3 text-center text-pink-700 font-bold">
                🔊 Audio
              </th>
            </tr>
          </thead>
          <tbody>
            {words.length > 0 ? (
              words.map((word) => (
                <TableRow key={word._id} word={word} language={language} />
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No words found. Try adjusting your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
