# Imposter Game 🎭

A social deduction game powered by AI, similar to Spyfall and Among Us concepts combined!

## Features ✨

- 🎮 **Local Multiplayer**: Pass-and-play game mode
- 🤖 **AI-Powered Words**: Uses Google's Gemini AI to generate dynamic words and hints
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 📦 **Word Packs**: Pre-made packs (Animals, Food, Movies, Sports, etc.)
- ✨ **Custom Topics**: Generate words for any topic using AI
- 🔒 **Secret Roles**: Swipe-up gesture to privately reveal roles
- 🎭 **Imposter Hints**: AI-generated subtle hints for imposters

## How to Play 🎲

1. **Setup**: Choose number of players and imposters
2. **Pick Topic**: Select a word pack or create custom topic
3. **Role Reveal**: Each player swipes up to see their role privately
   - **Crewmates** get the secret word
   - **Imposters** get a related hint (but not the word!)
4. **Discussion**: Players discuss and try to find the imposter
5. **Vote**: Eliminate suspects until imposters are found or crewmates lose

## Setup Instructions 🛠️

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Gemini API Key (Free!)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 3. Configure Environment
```bash
# Create .env file
cp .env.example .env

# Add your API key to .env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Deploy to Vercel 🚀

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Deploy!

## Tech Stack 💻

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Google Gemini AI** - Word generation
- **Vercel** - Hosting (recommended)

## Game Modes 🎯

### Currently Available:
- ✅ **Local Game** - Pass and play on one device

### Coming Soon:
- 🔜 **Online Multiplayer** - Play with friends remotely
- 🔜 **AI Players** - Play against AI bots

## Fallback Mode 💡

If you don't have a Gemini API key, the game still works! It will use pre-defined word lists for each pack.

## Credits 👨‍💻

Developed by: [Your Name]
Powered by: Google Gemini AI

## License 📄

MIT License - Feel free to use and modify!