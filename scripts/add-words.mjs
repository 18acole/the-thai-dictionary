// Script to add Thai dictionary words to Sanity CMS
import fetch from 'node-fetch';

// List of Thai words with translations
// Adding the final 7 words (14 already added successfully)
const words = [
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
      
      // Use relative URL that works in any environment
      const response = await fetch('/api/create-word', {
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