import { useState } from 'react';

interface RequestWordModalProps {
  onClose: () => void;
  language?: 'english' | 'chinese';
}

export default function RequestWordModal({ onClose, language = 'english' }: RequestWordModalProps) {
  const [word, setWord] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim()) {
      setMessage(language === 'english' ? 'Please enter a word' : '请输入一个单词');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
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
        setMessage(data.message || (language === 'english' 
          ? 'Something went wrong. Please try again.' 
          : '出错了，请重试。'));
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(language === 'english' 
        ? 'Network error. Please try again.' 
        : '网络错误，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-pink-300 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="py-4 px-6 border-b border-pink-200">
          <h3 className="text-purple-700 text-xl font-bold">
            {language === 'english' ? 'Request a Word 📝' : '请求添加单词 📝'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-purple-800 text-sm font-bold mb-2" htmlFor="word">
              {language === 'english' ? 'Word to request:' : '请求添加的单词:'}
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="appearance-none border-2 border-pink-200 rounded-lg w-full py-2 px-3 text-purple-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={language === 'english' 
                ? "Enter word you'd like to be added" 
                : "输入您想要添加的单词"}
            />
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
              className="px-4 py-2 text-pink-700 hover:text-pink-800 transition-colors"
              disabled={isSubmitting}
            >
              {language === 'english' ? 'Cancel' : '取消'}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (language === 'english' ? 'Submitting...' : '提交中...') 
                : (language === 'english' ? 'Submit Request' : '提交请求')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
