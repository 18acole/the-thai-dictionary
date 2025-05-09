import { createClient } from '@sanity/client';

// Fallback data in case Sanity fetch fails
const fallbackData = [
  {
    _id: '1',
    english: 'Hello',
    chinese: '你好',
    thai: 'สวัสดี',
    romanized: 'Sawadee',
    pinyin: 'Nǐ hǎo',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Th-sawatdii_khrap.ogg',
  },
  {
    _id: '2',
    english: 'Thank you',
    chinese: '谢谢',
    thai: 'ขอบคุณ',
    romanized: 'Khob khun',
    pinyin: 'Xiè xiè',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Th-khxbkhun.ogg',
  },
  {
    _id: '3',
    english: 'Yes',
    chinese: '是',
    thai: 'ใช่',
    romanized: 'Chai',
    pinyin: 'Shì',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Th-ch%C4%B0.ogg',
  },
  {
    _id: '4',
    english: 'No',
    chinese: '不',
    thai: 'ไม่',
    romanized: 'Mai',
    pinyin: 'Bù',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Th-m%C4%80y.ogg',
  },
  {
    _id: '5',
    english: 'Good',
    chinese: '好',
    thai: 'ดี',
    romanized: 'Dee',
    pinyin: 'Hǎo',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Th-dii.ogg',
  },
  {
    _id: '6',
    english: 'Delicious',
    chinese: '好吃',
    thai: 'อร่อย',
    romanized: 'Aroy',
    pinyin: 'Hǎo chī',
    audioUrl: '',
  },
  {
    _id: '7',
    english: 'Beautiful',
    chinese: '美丽',
    thai: 'สวย',
    romanized: 'Suay',
    pinyin: 'Měilì',
    audioUrl: '',
  },
  {
    _id: '8',
    english: 'How much',
    chinese: '多少钱',
    thai: 'เท่าไหร่',
    romanized: 'Tao rai',
    pinyin: 'Duōshǎo qián',
    audioUrl: '',
  },
  {
    _id: '9',
    english: 'Water',
    chinese: '水',
    thai: 'น้ำ',
    romanized: 'Nam',
    pinyin: 'Shuǐ',
    audioUrl: '',
  },
  {
    _id: '10',
    english: 'Hot',
    chinese: '热',
    thai: 'ร้อน',
    romanized: 'Ron',
    pinyin: 'Rè',
    audioUrl: '',
  },
  {
    _id: '11',
    english: 'Help',
    chinese: '帮助',
    thai: 'ช่วย',
    romanized: 'Chuay',
    pinyin: 'Bāngzhù',
    audioUrl: '',
  },
  {
    _id: '12',
    english: 'Happy',
    chinese: '开心',
    thai: 'มีความสุข',
    romanized: 'Mee kwaam suk',
    pinyin: 'Kāixīn',
    audioUrl: '',
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
      const query = `*[_type == "word"] {
        _id,
        english,
        chinese,
        thai,
        romanized,
        pinyin,
        audioUrl
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
