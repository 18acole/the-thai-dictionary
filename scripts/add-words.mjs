// Script to add Thai dictionary words to Sanity CMS
import fetch from 'node-fetch';

// List of Thai words with translations
// The first 6 words were added successfully, continuing with the rest
const words = [
  {
    english: "Sorry",
    chinese: "对不起",
    thai: "ขอโทษ",
    romanized: "Kho thot",
    pinyin: "Duìbùqǐ",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Th-kho_thot_khrap.ogg"
  },
  {
    english: "Friend",
    chinese: "朋友",
    thai: "เพื่อน",
    romanized: "Pheuan",
    pinyin: "Péngyǒu",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Th-Pheuan.oga"
  },
  {
    english: "Water",
    chinese: "水",
    thai: "น้ำ",
    romanized: "Nam",
    pinyin: "Shuǐ",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Th-nam.ogg"
  },
  {
    english: "Food",
    chinese: "食物",
    thai: "อาหาร",
    romanized: "Aahaan",
    pinyin: "Shíwù",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Th-aa-haan.ogg"
  },
  {
    english: "Hot",
    chinese: "热",
    thai: "ร้อน",
    romanized: "Ron",
    pinyin: "Rè",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Th-ron.ogg"
  },
  {
    english: "Cold",
    chinese: "冷",
    thai: "เย็น",
    romanized: "Yen",
    pinyin: "Lěng",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Th-yen.ogg"
  },
  {
    english: "Big",
    chinese: "大",
    thai: "ใหญ่",
    romanized: "Yai",
    pinyin: "Dà",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/03/Th-yai.ogg"
  },
  {
    english: "Small",
    chinese: "小",
    thai: "เล็ก",
    romanized: "Lek",
    pinyin: "Xiǎo",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Th-lek.ogg"
  },
  {
    english: "Good",
    chinese: "好",
    thai: "ดี",
    romanized: "Dee",
    pinyin: "Hǎo",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Th-dii.ogg"
  },
  {
    english: "Bad",
    chinese: "坏",
    thai: "ไม่ดี",
    romanized: "Mai dee",
    pinyin: "Huài",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Th-mai_dii.ogg"
  },
  {
    english: "Beautiful",
    chinese: "美丽",
    thai: "สวย",
    romanized: "Suay",
    pinyin: "Měilì",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Th-suay.ogg"
  },
  {
    english: "Delicious",
    chinese: "好吃",
    thai: "อร่อย",
    romanized: "Aroi",
    pinyin: "Hào chī",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Th-aroi.ogg"
  },
  {
    english: "Happy",
    chinese: "开心",
    thai: "มีความสุข",
    romanized: "Mee kwam suk",
    pinyin: "Kāixīn",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Th-mee_kham_suk.ogg"
  },
  {
    english: "Sad",
    chinese: "伤心",
    thai: "เศร้า",
    romanized: "Sao",
    pinyin: "Shāngxīn",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Th-sao.ogg"
  }
];

// Add words one by one with a delay to avoid overwhelming the API
async function addWords() {
  console.log(`Adding ${words.length} words to the dictionary...`);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    try {
      console.log(`Adding word ${i+1}/${words.length}: "${word.english}" (${word.thai})`);
      
      const response = await fetch('http://localhost:5000/api/create-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Successfully added "${word.english}" with ID: ${data.wordId}`);
      } else {
        console.error(`❌ Failed to add "${word.english}": ${data.message}`);
      }
      
      // Add a small delay between requests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error adding "${word.english}":`, error);
    }
  }
  
  console.log('Finished adding words!');
}

// Run the function
addWords().catch(error => {
  console.error('Script execution failed:', error);
});