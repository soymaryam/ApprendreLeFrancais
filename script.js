const wordEl = document.getElementById("word");
const translationEl = document.getElementById("translation");
const translationArEl = document.getElementById("translation-ar");
const btn = document.getElementById("generateBtn");
const speakIconEl = document.getElementById("speakIcon");

const apiURL = "https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json";

let words = [];
let voices = [];

async function loadWords() {
  const res = await fetch(apiURL);
  words = await res.json();
}

function loadVoices() {
  voices = speechSynthesis.getVoices();
}

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);

  const frenchVoice = voices.find(v => v.lang.startsWith("fr"));
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  utterance.lang = "fr-FR";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}

async function translateWord(word, target) {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=fr|${target}`);
  const data = await res.json();
  return data.responseData.translatedText;
}

async function showNewWord() {
  if (words.length === 0) await loadWords();

  const randomWord = words[Math.floor(Math.random() * words.length)];
  wordEl.childNodes[0].textContent = randomWord + " ";

  translationEl.textContent = "Translating...";
  translationArEl.textContent = "";

  speakIconEl.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  speakIconEl.className = "speak-icon";
  speakIconEl.onclick = () => speakWord(randomWord);

  try {
    const translatedEn = await translateWord(randomWord, "en");
    translationEl.textContent = translatedEn || "Translation unavailable";

    const translatedAr = await translateWord(randomWord, "ar");
    translationArEl.textContent = translatedAr || "";
  } catch {
    translationEl.textContent = "Translation failed";
  }
}

speechSynthesis.onvoiceschanged = loadVoices;

btn.addEventListener("click", showNewWord);

loadWords().then(() => {
  loadVoices();
  showNewWord();
});
