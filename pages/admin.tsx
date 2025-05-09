import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { sanityConfig } from '../lib/sanity';

export default function AdminPage() {
  const [word, setWord] = useState({
    english: '',
    chinese: '',
    thai: '',
    romanized: '',
    pinyin: '',
    audioUrl: '',
  });
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({});

    try {
      // Call the API endpoint to create a word in Sanity
      const response = await fetch('/api/create-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus({
          success: true,
          message: `Word created successfully with ID: ${data.wordId}`,
        });
        
        // Clear form after successful submission
        setWord({
          english: '',
          chinese: '',
          thai: '',
          romanized: '',
          pinyin: '',
          audioUrl: '',
        });
      } else {
        throw new Error(data.message || 'Failed to create word');
      }
    } catch (error) {
      setStatus({
        success: false,
        message: (error as Error).message || 'Failed to create word',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Head>
        <title>Admin - Thai Dictionary</title>
      </Head>

      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-purple-700">Thai Dictionary Admin</h1>
            <Link href="/" className="text-pink-600 hover:text-pink-800 transition-colors">
              Back to Dictionary
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border border-pink-200">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Sanity CMS Configuration</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Project ID:</p>
                <p className="text-pink-700">{sanityConfig.projectId || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Dataset:</p>
                <p className="text-pink-700">{sanityConfig.dataset || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">API Version:</p>
                <p className="text-pink-700">{sanityConfig.apiVersion || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Token:</p>
                <p className="text-pink-700">{sanityConfig.token ? '[Set]' : 'Not set'}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md border border-pink-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Add New Word to Sanity</h2>
          <p className="text-gray-600 mb-4">
            Use this form to add new words directly to the Sanity database.
            Words added here will appear in the dictionary immediately after refreshing the page.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="english" className="block text-sm font-medium text-purple-700 mb-1">
                  English
                </label>
                <input
                  type="text"
                  id="english"
                  name="english"
                  value={word.english}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="chinese" className="block text-sm font-medium text-purple-700 mb-1">
                  Chinese
                </label>
                <input
                  type="text"
                  id="chinese"
                  name="chinese"
                  value={word.chinese}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="thai" className="block text-sm font-medium text-purple-700 mb-1">
                  Thai
                </label>
                <input
                  type="text"
                  id="thai"
                  name="thai"
                  value={word.thai}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="romanized" className="block text-sm font-medium text-purple-700 mb-1">
                  Romanized
                </label>
                <input
                  type="text"
                  id="romanized"
                  name="romanized"
                  value={word.romanized}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="pinyin" className="block text-sm font-medium text-purple-700 mb-1">
                  Pinyin
                </label>
                <input
                  type="text"
                  id="pinyin"
                  name="pinyin"
                  value={word.pinyin}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="audioUrl" className="block text-sm font-medium text-purple-700 mb-1">
                  Audio URL
                </label>
                <input
                  type="url"
                  id="audioUrl"
                  name="audioUrl"
                  value={word.audioUrl}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
            </div>

            {status.message && (
              <div
                className={`p-3 rounded ${
                  status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="text-right">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-pink-200 p-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">How to Use Sanity Studio</h2>
          <div className="prose text-gray-700">
            <p>For a full content management experience, you should:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Set up Sanity Studio (separate repo)</li>
              <li>Configure your schema (similar to the one in <code>sanity/schemas/word.ts</code>)</li>
              <li>Deploy Sanity Studio to a hosted URL</li>
              <li>Use the Studio interface to create and manage dictionary entries</li>
              <li>The dictionary app will automatically show real data from Sanity when available</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}