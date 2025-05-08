import { useState } from 'react';

interface RequestWordModalProps {
  onClose: () => void;
}

export default function RequestWordModal({ onClose }: RequestWordModalProps) {
  const [word, setWord] = useState('');
  const [language, setLanguage] = useState<'english' | 'chinese'>('english');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim()) {
      setMessage('Please enter a word');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, language }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        setWord('');
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-4 px-6">
          <h3 className="text-white text-lg font-medium">Request a Word 📝</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="word">
              Word to request:
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter word you'd like to be added"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Language:
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={language === 'english'}
                  onChange={() => setLanguage('english')}
                  className="form-radio text-purple-600"
                />
                <span className="ml-2">🇺🇸 English</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={language === 'chinese'}
                  onChange={() => setLanguage('chinese')}
                  className="form-radio text-purple-600"
                />
                <span className="ml-2">🇨🇳 Chinese</span>
              </label>
            </div>
          </div>
          
          {message && (
            <div className={`p-3 mb-4 rounded ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded hover:from-pink-600 hover:to-purple-700 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
