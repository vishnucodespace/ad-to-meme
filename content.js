// AdMe Content Script

// Define ad selectors
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

// Imgflip meme templates (all single-line friendly)
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

// Shuffled template queue
let memeTemplateQueue = [];

// Sets to track used content
const usedQuotes = new Set();
const usedFacts = new Set();
const usedRiddles = new Set();
const usedJokes = new Set();

// Utility functions for AI content with no repeats
async function getAIQuote(attempt = 1) {
  const maxAttempts = 3;
  const quote = await fetchAICaption("Generate a deeply inspiring, uplifting quote (max 10 words, positive tone).");
  if (usedQuotes.has(quote) && attempt < maxAttempts) {
    console.log("Duplicate quote detected:", quote, "Retrying...");
    return await getAIQuote(attempt + 1);
  }
  usedQuotes.add(quote);
  return quote;
}

async function getAIFact(attempt = 1) {
  const maxAttempts = 3;
  const fact = await fetchAICaption("Generate a mind-blowing, fascinating fun fact (max 15 words, wow factor).");
  if (usedFacts.has(fact) && attempt < maxAttempts) {
    console.log("Duplicate fact detected:", fact, "Retrying...");
    return await getAIFact(attempt + 1);
  }
  usedFacts.add(fact);
  return fact;
}

async function getAIRiddle(attempt = 1) {
  const maxAttempts = 3;
  const riddleText = await fetchAICaption("Generate a clever, concise riddle with a clear one-word answer.");
  const parts = riddleText.split("Answer: ");
  const riddle = { question: parts[0].trim(), answer: parts[1]?.trim() || "Unknown" };
  if (usedRiddles.has(riddle.question) && attempt < maxAttempts) {
    console.log("Duplicate riddle detected:", riddle.question, "Retrying...");
    return await getAIRiddle(attempt + 1);
  }
  usedRiddles.add(riddle.question);
  return riddle;
}

async function getAIJoke(attempt = 1) {
  const maxAttempts = 3;
  const jokeText = await fetchAICaption("Generate a sharp, hilarious joke with setup and punchline (max 15 words).");
  const parts = jokeText.split(" - ");
  const joke = { setup: parts[0].trim(), punchline: parts[1]?.trim() || "Oops, no punchline!" };
  if (usedJokes.has(joke.setup) && attempt < maxAttempts) {
    console.log("Duplicate joke detected:", joke.setup, "Retrying...");
    return await getAIJoke(attempt + 1);
  }
  usedJokes.add(joke.setup);
  return joke;
}

// Generic AI caption fetcher
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

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize or reset template queue
function initializeTemplateQueue(templateList, queue) {
  if (queue.length === 0) {
    queue.push(...shuffleArray(templateList));
    console.log(`Initialized queue with ${queue.length} templates`);
  }
}

// Fetch caption from Gemini API for memes (reverted to original humor)
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

// Fetch unique meme using Gemini caption and Imgflip
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

// Replace ad element based on selected option
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
          <div class="quote-container" style="font-family: Arial, sans-serif; padding: 10px; text-align: center; background-color: #f9f9f9; border-left: 5px solid #007BFF;">
            <div class="quote-title" style="font-size: 14px; font-weight: bold; color: #007BFF;">QUOTE OF THE DAY</div>
            <p class="quote-text" style="font-size: 16px; font-style: italic; margin: 10px 0;">“${quote}”</p>
          </div>`;
        break;
      case "facts":
        const fact = await getAIFact();
        replacementContent = `
          <div class="funfact-container">
            <div class="funfact-header">🤔 DID YOU KNOW?</div> 
            <p class="funfact-text">${fact}</p>
          </div>`;
        break;
      case "riddles":
        const riddle = await getAIRiddle();
        replacementContent = `
          <div class="riddle-box">
            <div class="riddle-header">🤔 CAN YOU SOLVE THIS?</div>
            <p class="riddle-question">${riddle.question}</p>
            <p class="riddle-answer">Show answer <span>${riddle.answer}</span></p>
          </div>`;
        break;
      case "jokes":
        const joke = await getAIJoke();
        replacementContent = `
          <div class="joke-container">
            <div class="joke-header">😂 LAUGH BREAK 😂</div>
            <p class="joke-setup">${joke.setup}</p>
            <p class="joke-punchline">${joke.punchline}</p>
          </div>`;
        break;
      case "empty":
        replacementContent = "";
        break;
      case "solid":
        replacementContent = `<div class="solid-placeholder"></div>`;
        break;
      case "custom":
        replacementContent = `
          <div class="custom-message-box">
            <div class="custom-message-title">🌟🌟🌟</div>
            <p class="custom-message-content">${data.customMessage || "Your personalized content goes here!"}</p>
          </div>`;
        break;
      case "memes":
        const meme = await fetchUniqueMeme(memeTemplates, memeTemplateQueue);
        replacementContent = `<img src="${meme.imageUrl}" alt="Funny Meme" class="meme-image">`;
        break;
      default:
        replacementContent = `<p style="font-size: 16px; line-height: 1.5; font-weight: 500; color: #111827; background-color: #F9FAFB;">Ad Blocked</p>`;
    }
    element.innerHTML = replacementContent;
  });
}

// Detect ads
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

// Mutation observer
function setupMutationObserver() {
  let timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => detectAds(), 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize
console.log("AdMe content script loaded");
detectAds();
setupMutationObserver();
console.log("Ad detection and observer initialized.");