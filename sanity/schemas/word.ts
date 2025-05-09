export default {
  name: "word",
  title: "Word",
  type: "document",
  fields: [
    { name: "english", title: "English", type: "string" },
    { name: "chinese", title: "Chinese", type: "string" },
    { name: "thai", title: "Thai", type: "string" },
    { name: "romanized", title: "Romanized", type: "string" },
    { name: "pinyin", title: "Pinyin", type: "string" },
    { name: "audioUrl", title: "Audio URL", type: "url" },
  ],
}