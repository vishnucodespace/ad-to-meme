// AdMe Content Script

// Define ad selectors (unchanged)
const adSelectors = [
  'iframe[class*="ads"]',
  'iframe[src*="ads"]',
  'iframe[id*="ads"]',
  'iframe[aria-label*="ad"]',
  'img[class*="ads_"]',
  'img[id*="ads_"]',
  'img[id*="ads-"]',
  'img[src*="_ads_"]',
];

// Imgflip meme templates (unchanged)
const memeTemplates = [
  { id: "181913649", name: "Drake Hotline Bling", description: "Drake approving or rejecting, casual tone." },
  { id: "61579", name: "One Does Not Simply", description: "Boromir warning, dramatic tone." },
  { id: "102156234", name: "Mocking Spongebob", description: "Spongebob mocking, sarcastic tone." },
  { id: "129242436", name: "Change My Mind", description: "Guy with sign, defiant humor." },
  { id: "101470", name: "Philosoraptor", description: "Raptor pondering, witty questions." },
  { id: "15506739", name: "Success Kid", description: "Baby celebrating, triumphant tone." },
  { id: "5496396", name: "First World Problems", description: "Crying over triviality, ironic tone." },
  { id: "61532", name: "The Most Interesting Man", description: "Cool guy boasting, suave tone." },
  { id: "405658", name: "Grumpy Cat", description: "Cat rejecting, grumpy sarcasm." },
  { id: "100947", name: "Rage Guy (FFFUUU)", description: "Angry face, pure frustration." },
  { id: "61546", name: "Y U No", description: "Demanding face, annoyed plea." },
  { id: "80707627", name: "Bad Luck Brian", description: "Unlucky teen, cursed humor." },
  { id: "6235864", name: "Scumbag Steve", description: "Jerk in hat, shady vibe." },
  { id: "195389", name: "Overly Attached Girlfriend", description: "Crazy girlfriend, obsessive tone." },
  { id: "91545132", name: "Trump Bill Signing", description: "Trump with paper, smug tone." },
  { id: "259680", name: "All The Things", description: "Fist raised, aggressive motivation." },
  { id: "16464531", name: "But That’s None Of My Business", description: "Kermit sipping tea, shady comment." },
  { id: "922147", name: "Laughing Men In Suits", description: "Men laughing, mocking tone." },
  { id: "101440", name: "Troll Face", description: "Troll grinning, sneaky humor." },
  { id: "134797956", name: "Skeptical 3rd World Kid", description: "Kid doubting, sarcastic disbelief." },
  { id: "27813981", name: "Hide The Pain Harold", description: "Old man smiling, forced positivity." },
  { id: "61520", name: "Futurama Fry", description: "Fry squinting, suspicious tone." },
  { id: "163573", name: "Conspiracy Keanu", description: "Keanu shocked, wild theories." },
  { id: "124055827", name: "Y’all Got Any More Of That", description: "Crackhead begging, desperate humor." },
  { id: "89370399", name: "Roll Safe", description: "Guy tapping head, clever trick." }
];

// Shuffled template queue (unchanged)
let memeTemplateQueue = [];

// Sets to track used content (unchanged)
const usedQuotes = new Set();
const usedFacts = new Set();
const usedRiddles = new Set();
const usedJokes = new Set();

// Pools for each content type (unchanged)
let quotePool = [];
let factPool = [];
let riddlePool = [];
let jokePool = [];

// Fallback content arrays (unchanged)
const fallbackQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The best way to predict the future is to create it. - Peter Drucker"
];

const fallbackFacts = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
  "Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.",
  "Bananas are berries, but strawberries aren't. Botanically, berries are fruits produced from a single ovary.",
  "A group of flamingos is called a 'flamboyance'.",
  "Wombat poop is cube-shaped."
];

const fallbackRiddles = [
  { question: "What has keys but can't open locks?", answer: "A piano" },
  { question: "What runs but never walks?", answer: "A river" },
  { question: "What can travel around the world while staying in a corner?", answer: "A stamp" },
  { question: "What has a head, a tail, is brown, and has no legs?", answer: "A penny" },
  { question: "What is full of holes but still holds water?", answer: "A sponge" }
];

const fallbackJokes = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
  { setup: "What do you call fake spaghetti?", punchline: "An impasta!" },
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field!" },
  { setup: "How does a penguin build its house?", punchline: "Igloos it together!" },
  { setup: "Why don't skeletons fight each other?", punchline: "They don't have the guts." }
];

// Refill promises to handle concurrent access (unchanged)
let refillQuotePromise = null;
let refillFactPromise = null;
let refillRiddlePromise = null;
let refillJokePromise = null;

// Fetch multiple quotes at once (unchanged)
async function fetchMultipleQuotes(count) {
  const prompt = `Generate ${count} deeply inspiring, uplifting quotes, the quotes must not be repeated, best inspiring quote (each max 15 words, positive tone). Separate them with '|'`;
  const response = await fetchAICaption(prompt);
  const quotes = response.split('|').map(q => q.trim()).filter(q => q && !usedQuotes.has(q));
  quotes.forEach(q => usedQuotes.add(q));
  return quotes;
}

// Refill quote pool (unchanged)
async function refillQuotePool() {
  if (!refillQuotePromise) {
    refillQuotePromise = fetchMultipleQuotes(5).then(newQuotes => {
      quotePool.push(...newQuotes);
      refillQuotePromise = null;
    });
  }
  await refillQuotePromise;
}

// Get unique quote from pool with fallback (unchanged)
async function getAIQuote() {
  if (quotePool.length === 0) {
    await refillQuotePool();
  }
  if (quotePool.length === 0) {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }
  return quotePool.shift();
}

// Fetch multiple facts at once (unchanged)
async function fetchMultipleFacts(count) {
  const prompt = `Generate ${count} mind-blowing, fascinating fun facts, make them all unique (each max 15 words, wow factor). Separate them with '|'`;
  const response = await fetchAICaption(prompt);
  const facts = response.split('|').map(f => f.trim()).filter(f => f && !usedFacts.has(f));
  facts.forEach(f => usedFacts.add(f));
  return facts;
}

// Refill fact pool (unchanged)
async function refillFactPool() {
  if (!refillFactPromise) {
    refillFactPromise = fetchMultipleFacts(5).then(newFacts => {
      factPool.push(...newFacts);
      refillFactPromise = null;
    });
  }
  await refillFactPromise;
}

// Get unique fact from pool with fallback (unchanged)
async function getAIFact() {
  if (factPool.length === 0) {
    await refillFactPool();
  }
  if (factPool.length === 0) {
    const randomIndex = Math.floor(Math.random() * fallbackFacts.length);
    return fallbackFacts[randomIndex];
  }
  return factPool.shift();
}

// Fetch multiple riddles at once (unchanged)
async function fetchMultipleRiddles(count) {
  const prompt = `Generate ${count} clever, concise riddles, all must be unique, each with a clear one-word answer. Format each as "Riddle: [question] Answer: [answer]" separated by '||'`;
  const response = await fetchAICaption(prompt);
  const riddleTexts = response.split('||').map(rt => rt.trim());
  const riddles = riddleTexts.map(rt => {
    const parts = rt.split("Answer: ");
    const question = parts[0].replace("Riddle: ", "").trim();
    const answer = parts[1]?.trim() || "Unknown";
    return { question, answer };
  }).filter(r => r.question && r.answer && !usedRiddles.has(`${r.question}|${r.answer}`));
  riddles.forEach(r => usedRiddles.add(`${r.question}|${r.answer}`));
  return riddles;
}

// Refill riddle pool (unchanged)
async function refillRiddlePool() {
  if (!refillRiddlePromise) {
    refillRiddlePromise = fetchMultipleRiddles(3).then(newRiddles => {
      riddlePool.push(...newRiddles);
      refillRiddlePromise = null;
    });
  }
  await refillRiddlePromise;
}

// Get unique riddle from pool with fallback (unchanged)
async function getAIRiddle() {
  if (riddlePool.length === 0) {
    await refillRiddlePool();
  }
  if (riddlePool.length === 0) {
    const randomIndex = Math.floor(Math.random() * fallbackRiddles.length);
    return fallbackRiddles[randomIndex];
  }
  return riddlePool.shift();
}

// Fetch multiple jokes at once (unchanged)
async function fetchMultipleJokes(count) {
  const prompt = `Generate ${count} sharp, all must be unique, hilarious jokes with setup and punchline (each max 15 words). Format each as "Setup: [setup] Punchline: [punchline]" separated by '||'`;
  const response = await fetchAICaption(prompt);
  const jokeTexts = response.split('||').map(jt => jt.trim());
  const jokes = jokeTexts.map(jt => {
    const parts = jt.split("Punchline: ");
    const setup = parts[0].replace("Setup: ", "").trim();
    const punchline = parts[1]?.trim() || "Oops, no punchline!";
    return { setup, punchline };
  }).filter(j => j.setup && j.punchline && !usedJokes.has(`${j.setup}|${j.punchline}`));
  jokes.forEach(j => usedJokes.add(`${j.setup}|${j.punchline}`));
  return jokes;
}

// Refill joke pool (unchanged)
async function refillJokePool() {
  if (!refillJokePromise) {
    refillJokePromise = fetchMultipleJokes(3).then(newJokes => {
      jokePool.push(...newJokes);
      refillJokePromise = null;
    });
  }
  await refillJokePromise;
}

// Get unique joke from pool with fallback (unchanged)
async function getAIJoke() {
  if (jokePool.length === 0) {
    await refillJokePool();
  }
  if (jokePool.length === 0) {
    const randomIndex = Math.floor(Math.random() * fallbackJokes.length);
    return fallbackJokes[randomIndex];
  }
  return jokePool.shift();
}

// Generic AI caption fetcher (unchanged)
async function fetchAICaption(prompt) {
  const apiKey = window.adMeConfig?.geminiApiKey || "MISSING_API_KEY";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${prompt} Just the content, no labels.` }] }]
      }),
    });

    if (!response.ok) throw new Error("Gemini API request failed");
    const data = await response.json();
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!content) throw new Error("No content returned");
    console.log("Generated AI content:", content);
    return content;
  } catch (error) {
    console.error("Error fetching AI content:", error);
    return "AI failed, try again!";
  }
}

// Shuffle array function (unchanged)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize or reset template queue (unchanged)
function initializeTemplateQueue(templateList, queue) {
  if (queue.length === 0) {
    queue.push(...shuffleArray(templateList));
    console.log(`Initialized queue with ${queue.length} templates`);
  }
}

// Fetch caption from Gemini API for memes (unchanged)
async function fetchGeminiCaption(template, attempt = 1) {
  const apiKey = window.adMeConfig?.geminiApiKey || "MISSING_API_KEY";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const maxAttempts = 3;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate one short, funny, complete caption (max 6 words) for the "${template.name}" meme: ${template.description}. Must be a full thought, no cutoff. Fit the top text area. Just the caption.`
          }]
        }]
      }),
    });

    if (!response.ok) throw new Error("Gemini API request failed");
    const data = await response.json();
    let caption = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!caption || caption === "" || caption.split(" ").length > 6) {
      caption = `Oops, ${template.name} broke!`;
    } else if (caption.length > 35) {
      caption = caption.substring(0, 32) + "...";
    } else if (caption.match(/,\s*$|\.\.\.$/) && attempt < maxAttempts) {
      console.log("Incomplete caption detected:", caption, "Retrying...");
      return await fetchGeminiCaption(template, attempt + 1);
    }

    console.log("Generated caption for", template.name, ":", caption);
    return caption;
  } catch (error) {
    console.error("Error fetching Gemini caption:", error);
    return `Oops, ${template.name} broke!`;
  }
}

// Fetch unique meme using Gemini caption and Imgflip (unchanged from original)
async function fetchUniqueMeme(templateList, queue) {
  const username = window.adMeConfig?.imgflipUsername || "MISSING_USERNAME";
  const password = window.adMeConfig?.imgflipPassword || "MISSING_PASSWORD";
  const apiUrl = "https://api.imgflip.com/caption_image";

  try {
    initializeTemplateQueue(templateList, queue);
    const template = queue.shift();
    const text0 = await fetchGeminiCaption(template);
    const text1 = "";

    console.log("Using template:", template.name, "with ID:", template.id, "Queue left:", queue.length);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        template_id: template.id,
        username: username,
        password: password,
        text0: text0,
        text1: text1,
      }).toString(),
    });

    if (!response.ok) throw new Error("Imgflip API request failed");
    const data = await response.json();
    if (!data.success) throw new Error(data.error_message);

    const meme = {
      templateId: template.id,
      text0: text0,
      text1: text1,
      imageUrl: data.data.url,
    };
    console.log("Generated meme URL:", meme.imageUrl);
    return meme;
  } catch (error) {
    console.error("Error fetching meme:", error);
    const fallback = {
      templateId: templateList[0].id,
      text0: "Meme generation failed!",
      text1: "",
      imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    };
    return fallback;
  }
}

// Replace ad element based on selected option (updated to use styles.css with meme debugging)
function replaceAd(element) {
  if (element.dataset.admeReplaced) {
    console.log("Skipping:", element);
    return;
  }
  console.log("Replacing Ad Element:", element);
  element.dataset.admeReplaced = "true";

  element.innerHTML = `<div class="ad-placeholder">Loading...</div>`;

  chrome.storage.sync.get(["replacementType", "customMessage"], async (data) => {
    const replacementType = data.replacementType || "default";
    let replacementContent = "";

    switch (replacementType) {
      case "quotes":
        const quote = await getAIQuote();
        replacementContent = `
          <div class="quote-container">
            <div class="quote-title">QUOTE OF THE DAY</div>
            <p class="quote-text">“${quote}”</p>
          </div>`;
        break;
      case "facts":
        const fact = await getAIFact();
        replacementContent = `
          <div class="funfact-container">
            <div class="funfact-header">DID YOU KNOW?</div>
            <p class="funfact-text">${fact}</p>
          </div>`;
        break;
      case "riddles":
        const riddle = await getAIRiddle();
        replacementContent = `
          <div class="riddle-box">
            <div class="riddle-header">CAN YOU SOLVE THIS?</div>
            <p class="riddle-question">${riddle.question}</p>
            <p class="riddle-answer">Show answer <span>${riddle.answer}</span></p>
          </div>`;
        break;
      case "jokes":
        const joke = await getAIJoke();
        replacementContent = `
          <div class="joke-container">
            <div class="joke-header">LAUGH BREAK</div>
            <p class="joke-setup">${joke.setup}</p>
            <p class="joke-punchline">${joke.punchline}</p>
          </div>`;
        break;
      case "empty":
        replacementContent = "";
        break;
      case "solid":
        replacementContent = `<div class="solid-placeholder"><span>AD BLOCKED</span></div>`;
        break;
      case "custom":
        replacementContent = `
          <div class="custom-message-box">
            <div class="custom-message-title">CUSTOM MESSAGE</div>
            <p class="custom-message-content">${data.customMessage || "Your personalized content goes here!"}</p>
          </div>`;
        break;
      case "memes":
        console.log("Attempting to fetch meme...");
        const meme = await fetchUniqueMeme(memeTemplates, memeTemplateQueue);
        console.log("Meme object:", meme);
        replacementContent = `<img src="${meme.imageUrl}" alt="Funny Meme" class="meme-image">`;
        console.log("Meme HTML set:", replacementContent);
        break;
      default:
        replacementContent = `<div class="solid-placeholder"><span>AD BLOCKED</span></div>`;
    }
    element.innerHTML = replacementContent;
    console.log("Replacement content applied:", element.innerHTML);
  });
}

// Detect ads (unchanged)
function detectAds() {
  console.log("Detecting Ads...");
  adSelectors.forEach(selector => {
    const adElements = document.querySelectorAll(selector);
    adElements.forEach(element => {
      const parent = element.closest('div');
      if (parent) replaceAd(parent);
    });

    const adContainers = document.querySelectorAll('div[class*="ad"] > iframe, div[class*="ad"] > img');
    adContainers.forEach(adDiv => {
      if (adDiv && !adDiv.dataset.admeReplaced) replaceAd(adDiv);
    });
  });
}

// Mutation observer (unchanged)
function setupMutationObserver() {
  let timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => detectAds(), 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize (unchanged)
console.log("AdMe content script loaded");
detectAds();
setupMutationObserver();
console.log("Ad detection and observer initialized.");