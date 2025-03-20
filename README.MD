AdMe
====

AdMe is a browser extension that replaces online advertisements with positive, engaging content widgets such as motivational quotes, fun facts, riddles, jokes, custom messages, or memes. It enhances the browsing experience by transforming ad spaces into delightful, user-customizable content areas.

Features
--------

*   **Ad Replacement Options**: Choose from various content types to replace ads:
   
    *   **Motivational Quotes**: Uplifting and inspiring quotes (AI-generated or fallback).
       
    *   **Fun Facts**: Fascinating, mind-blowing facts (AI-generated or fallback).
       
    *   **Riddles**: Clever brain teasers with answers (AI-generated or fallback).
       
    *   **Jokes**: Hilarious setup-punchline humor (AI-generated or fallback).
       
    *   **Memes**: Funny images with captions generated via Imgflip API and Gemini AI.
       
    *   **Custom Messages**: User-defined text for a personalized touch.
       
    *   **Empty Space**: Removes ads entirely.
       
    *   **Solid Background**: Displays a simple "AD BLOCKED" message.
       
*   **Dynamic Content**: AI-generated content fetched from the Gemini API ensures freshness and variety.
   
*   **Meme Generation**: Uses Imgflip API with a curated list of popular meme templates.
   
*   **Smart Ad Detection**: Identifies ads using predefined CSS selectors and replaces them seamlessly.
   
*   **Responsive UI**: Popup carousel interface with mouse and touch (two-finger) navigation.
   
*   **Persistent Settings**: Saves user preferences using Chrome storage for a consistent experience.
   

Installation
------------

### Prerequisites

*   Google Chrome or a Chromium-based browser.
   
*   API keys for:
   
    *   **Gemini API** (for AI-generated content).
       
    *   **Imgflip API** (for meme generation).
       
*   Basic knowledge of browser extension development.
   

### Steps

1.  **Clone or Download the Repository**:bashCollapseWrapCopygit clone cd AdMe
   
2.  **Configure API Keys**:
   
    *   Create a config.js file in the root directory.
       
    *   Add the following:javascriptCollapseWrapCopywindow.adMeConfig = { geminiApiKey: "YOUR\_GEMINI\_API\_KEY", imgflipUsername: "YOUR\_IMGFLIP\_USERNAME", imgflipPassword: "YOUR\_IMGFLIP\_PASSWORD"};
       
    *   Replace placeholders with your actual API credentials.
       
3.  **Load the Extension in Chrome**:
   
    *   Open Chrome and navigate to chrome://extensions/.
       
    *   Enable "Developer mode" (top right).
       
    *   Click "Load unpacked" and select the AdMe project folder.
       
4.  **Verify Installation**:
   
    *   The AdMe icon should appear in your browser toolbar.
       
    *   Click it to open the settings popup and confirm functionality.
       

Usage
-----

1.  **Open the Popup**:
   
    *   Click the AdMe icon in your browser toolbar to access the settings carousel.
       
2.  **Select Replacement Type**:
   
    *   Use the arrow buttons, mouse drag, or two-finger touch to navigate the carousel.
       
    *   Click a slide to choose a replacement type (e.g., "Memes", "Quotes").
       
    *   For "Custom Message", enter your text in the input field.
       
3.  **Apply Settings**:
   
    *   Clicking a slide saves your selection and closes the popup.
       
    *   The extension immediately begins replacing ads on web pages.
       
4.  **Browse the Web**:
   
    *   Ads will be replaced with your chosen content type in real-time.
       
    *   A Mutation Observer ensures new ads are detected and replaced as pages load or update.
       

Technical Details
-----------------

### Ad Detection

*   Uses CSS selectors (adSelectors) to identify ad elements (iframes, images).
   
*   Wraps ads in parent divs for replacement.
   
*   Employs a Mutation Observer to detect dynamically loaded ads.
   

### Content Generation

*   **AI Content**: Fetches quotes, facts, riddles, and jokes from the Gemini API.
   
    *   Pools are refilled asynchronously to prevent duplicates.
       
    *   Fallback arrays ensure content availability if API fails.
       
*   **Memes**: Combines Imgflip API for meme images and Gemini API for captions.
   
    *   Supports 25 popular meme templates (e.g., "Drake Hotline Bling", "Philosoraptor").
       
    *   Shuffles templates to maintain variety.
       

### Dependencies

*   **Gemini API**: For generating dynamic text content.
   
*   **Imgflip API**: For meme image generation.
   
*   **Chrome Storage**: For saving user preferences.
   
*   **Google Fonts**: Caveat font for popup styling.
   

Customization

*   **Add New Templates**: Extend memeTemplates in content.js with new Imgflip template IDs.
   
*   **Modify Fallbacks**: Update fallbackQuotes, fallbackFacts, etc., with custom content.
   
*   **Adjust Styling**: Edit styles.css to tweak the look of replacement widgets or popup.
   

Troubleshooting
---------------

*   **Ads Not Replacing**: Check console logs for API errors or missing config.js.
   
*   **API Failures**: Ensure valid API keys and internet connectivity.
   
*   **Meme Issues**: Verify Imgflip credentials and template IDs.
   
*   **UI Glitches**: Confirm styles.css is correctly linked and loaded.
   

Contributing
------------


AdMe transforms your browsing experience by replacing annoying ads with delightful content widgets. Swap out advertisements for motivational quotes, fun facts, clever riddles, hilarious jokes, custom messages, or memes—all powered by AI and user-friendly customization. With dynamic content from the Gemini API, meme generation via Imgflip, and a sleek popup interface, AdMe makes every ad space a moment of joy or inspiration. Take control, block the noise, and enjoy the web your way!

Feel free to submit pull requests or issues to enhance AdMe. Ideas for new content types, improved ad detection, or UI enhancements are welcome!