import { Word } from '../pages/index';
import TableRow from './TableRow';

interface DictionaryTableProps {
  words: Word[];
  language: 'english' | 'chinese';
}

export default function DictionaryTable({ words, language }: DictionaryTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-purple-100">
          <thead className="bg-purple-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                {language === 'english' ? '🇺🇸 English' : '🇨🇳 Chinese'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                🇹🇭 Thai
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                🔊 Audio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                ❤️ Favourite
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-purple-100">
            {words.length > 0 ? (
              words.map((word) => (
                <TableRow key={word._id} word={word} language={language} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
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
