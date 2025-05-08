import { createClient } from '@sanity/client';

// For now let's use static dummy data instead of Sanity until we fix the credentials
const dummyData = [
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

// Mock the Sanity client for now
export const sanityClient = {
  fetch: async () => {
    return dummyData;
  }
};

// Export configuration for use elsewhere
export const sanityConfig = {
  projectId: 'dummy',
  dataset: 'production',
};
