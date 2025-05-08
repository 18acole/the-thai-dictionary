import { createClient } from '@sanity/client';

// Fallback data in case Sanity fetch fails
const fallbackData = [
  {
    _id: '1',
    english: 'Hello',
    chinese: '你好',
    thai: 'สวัสดี',
    romanized: 'Sawadee',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Th-sawatdii_khrap.ogg',
  },
  {
    _id: '2',
    english: 'Thank you',
    chinese: '谢谢',
    thai: 'ขอบคุณ',
    romanized: 'Khob khun',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Th-khxbkhun.ogg',
  },
  {
    _id: '3',
    english: 'Yes',
    chinese: '是',
    thai: 'ใช่',
    romanized: 'Chai',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Th-ch%C4%B0.ogg',
  },
  {
    _id: '4',
    english: 'No',
    chinese: '不',
    thai: 'ไม่',
    romanized: 'Mai',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Th-m%C4%80y.ogg',
  },
  {
    _id: '5',
    english: 'Good',
    chinese: '好',
    thai: 'ดี',
    romanized: 'Dee',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Th-dii.ogg',
  },
];

// Sanity configuration using environment variables
export const sanityConfig = {
  projectId: process.env.SANITY_PROJECT_ID || 'fallback',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_TOKEN,
  useCdn: false, // We want always fresh content
};

// Create the Sanity client with validation check
const client = (() => {
  try {
    // Only create client if projectId is valid
    const projectId = process.env.SANITY_PROJECT_ID || '';
    if (projectId && /^[a-z0-9-]+$/.test(projectId)) {
      return createClient(sanityConfig);
    }
    console.warn('Invalid Sanity projectId, using fallback data');
    return null;
  } catch (error) {
    console.error('Error creating Sanity client:', error);
    return null;
  }
})();

// Export wrapper with error handling
export const sanityClient = {
  fetch: async () => {
    // If no client was created, return fallback data immediately
    if (!client) {
      console.warn('No Sanity client available, using fallback data');
      return fallbackData;
    }
    
    try {
      // GROQ query to get all dictionary words
      const query = `*[_type == "dictionaryEntry"] {
        _id,
        english,
        chinese,
        thai,
        romanized,
        "audioUrl": audio.asset->url
      }`;
      
      // Attempt to fetch data from Sanity (client is guaranteed non-null here)
      const result = await client!.fetch(query);
      
      // If we got data, return it
      if (result && result.length > 0) {
        console.log('Successfully fetched data from Sanity');
        return result;
      } else {
        // Otherwise, log and use fallback
        console.warn('No data found in Sanity, using fallback data');
        return fallbackData;
      }
    } catch (error) {
      // In case of errors, log and use fallback
      console.error('Error fetching from Sanity:', error);
      return fallbackData;
    }
  }
};
