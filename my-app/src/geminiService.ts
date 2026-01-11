import type { WordPack } from './types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface WordData {
  word: string;
  description: string;
  imposterHint: string;
}

export async function generateWordFromPack(pack: WordPack): Promise<WordData> {
  if (!GEMINI_API_KEY) {
    return generateFallbackWord(pack);
  }

  try {
    const prompt = `You are an expert game designer creating content for a social deduction game called "Imposter" (similar to Spyfall or Insider).

GAME RULES CONTEXT:
- Crewmates all receive the SAME SECRET WORD
- The Imposter(s) receive only a HINT (they do NOT know the word)
- Players discuss and try to figure out who doesn't know the word
- The Imposter must blend in by asking vague questions without revealing they don't know

YOUR TASK:
Generate ONE specific, concrete word from the category: "${pack.name}" (${pack.description})

CRITICAL REQUIREMENTS FOR THE HINT:
❌ NEVER use the word itself or close variations
❌ NEVER be too specific (avoid obvious giveaways)
❌ NEVER use phrases like "related to X" or "type of Y"
✅ BE clever and thematic to the category
✅ BE vague enough that it applies to MULTIPLE items in the category
✅ THINK like a game designer: what information helps blend in WITHOUT revealing the answer?

EXAMPLES OF GOOD HINTS:
Word: "Swimming" → Hint: "You might need special equipment and a specific location for this"
Word: "Basketball" → Hint: "Team coordination and precise aim are essential here"
Word: "Elephant" → Hint: "Size and memory are notable characteristics"
Word: "Pizza" → Hint: "Temperature and timing are crucial for the best experience"

EXAMPLES OF BAD HINTS (NEVER DO THIS):
❌ Word: "Swimming" → Hint: "Water sport" (too obvious)
❌ Word: "Basketball" → Hint: "Ball game with hoops" (contains key identifiers)
❌ Word: "Elephant" → Hint: "Large animal" (too direct)

STRICT RESPONSE FORMAT (JSON only, no markdown):
{
  "word": "single specific concrete noun",
  "description": "brief 4-6 word factual description",
  "imposterHint": "clever vague hint that could apply to multiple things in the category"
}

Category: ${pack.name}
Generate now:`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 1.0,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 300,
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      console.error('API Error:', await response.text());
      throw new Error('Failed to generate word');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from AI');
    }

    // Clean and parse
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const wordData: WordData = JSON.parse(cleanedText);

    // Validation: ensure hint doesn't contain the word
    const wordLower = wordData.word.toLowerCase();
    const hintLower = wordData.imposterHint.toLowerCase();
    
    if (hintLower.includes(wordLower)) {
      console.warn('Hint contained the word! Regenerating...');
      // Try one more time with even stricter prompt
      return await generateWithStricterPrompt(pack, wordData.word);
    }

    return wordData;
  } catch (error) {
    console.error('Error generating word with Gemini:', error);
    return generateFallbackWord(pack);
  }
}

async function generateWithStricterPrompt(pack: WordPack, avoidWord: string): Promise<WordData> {
  try {
    const prompt = `CRITICAL GAME DESIGN TASK - Social Deduction Game

You previously generated: "${avoidWord}"
This was GOOD, but the hint was too obvious.

Generate a NEW word from: "${pack.name}"

ABSOLUTE RULES FOR THE HINT:
1. NEVER mention the word or any part of it
2. NEVER use obvious category descriptors
3. BE abstract and philosophical
4. THINK: "What would someone discuss about this topic WITHOUT knowing the specific thing?"

Examples of PERFECT hints:
- "The experience varies greatly depending on the season"
- "Preparation time often exceeds actual usage time"
- "Cultural significance differs across regions"
- "Safety considerations are frequently debated"

JSON format only:
{
  "word": "specific noun",
  "description": "4-6 word description",
  "imposterHint": "abstract philosophical hint"
}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 1.2,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 300,
          responseMimeType: "application/json",
        }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Stricter prompt failed:', error);
    return generateFallbackWord(pack);
  }
}

function generateFallbackWord(pack: WordPack): WordData {
  const fallbackWords: Record<string, WordData[]> = {
    animals: [
      { 
        word: 'Elephant', 
        description: 'Largest land mammal with trunk', 
        imposterHint: 'Memory and social bonds are remarkable characteristics here' 
      },
      { 
        word: 'Dolphin', 
        description: 'Intelligent marine mammal species', 
        imposterHint: 'Communication methods are surprisingly complex and studied' 
      },
      { 
        word: 'Eagle', 
        description: 'Powerful bird of prey', 
        imposterHint: 'Symbolism in various cultures is widespread and significant' 
      },
      { 
        word: 'Penguin', 
        description: 'Flightless Antarctic bird species', 
        imposterHint: 'Adaptation to extreme environments is quite remarkable' 
      },
    ],
    food: [
      { 
        word: 'Pizza', 
        description: 'Italian flatbread with toppings', 
        imposterHint: 'Customization options are nearly infinite for this' 
      },
      { 
        word: 'Sushi', 
        description: 'Japanese vinegared rice dish', 
        imposterHint: 'Freshness and preparation technique are absolutely critical' 
      },
      { 
        word: 'Burger', 
        description: 'Grilled patty sandwich meal', 
        imposterHint: 'Assembly order and temperature greatly affect the outcome' 
      },
      { 
        word: 'Pasta', 
        description: 'Italian wheat-based noodle dish', 
        imposterHint: 'Cooking time precision makes or breaks the experience' 
      },
    ],
    movies: [
      { 
        word: 'Inception', 
        description: 'Nolan dream heist thriller', 
        imposterHint: 'Multiple layers and reality questioning are central themes' 
      },
      { 
        word: 'Avatar', 
        description: 'Cameron sci-fi epic blockbuster', 
        imposterHint: 'Environmental themes and visual innovation defined this' 
      },
      { 
        word: 'Titanic', 
        description: 'Historical disaster romance epic', 
        imposterHint: 'True events mixed with fictional romance storyline' 
      },
      { 
        word: 'Interstellar', 
        description: 'Space exploration time dilation', 
        imposterHint: 'Scientific accuracy and emotional weight balance uniquely' 
      },
    ],
    sports: [
      { 
        word: 'Basketball', 
        description: 'Indoor court team sport', 
        imposterHint: 'Vertical space utilization is crucial to success' 
      },
      { 
        word: 'Tennis', 
        description: 'Racket sport with net', 
        imposterHint: 'Individual mental fortitude often determines the outcome' 
      },
      { 
        word: 'Swimming', 
        description: 'Competitive aquatic racing sport', 
        imposterHint: 'Breath control and technique optimization are paramount' 
      },
      { 
        word: 'Soccer', 
        description: 'Global football team sport', 
        imposterHint: 'Continuous movement and strategy adaptation are essential' 
      },
    ],
    technology: [
      { 
        word: 'Smartphone', 
        description: 'Portable touchscreen computer device', 
        imposterHint: 'Battery life and screen size trade-offs exist' 
      },
      { 
        word: 'Laptop', 
        description: 'Portable personal computing machine', 
        imposterHint: 'Portability versus performance is a constant balance' 
      },
      { 
        word: 'Smartwatch', 
        description: 'Wearable digital timepiece computer', 
        imposterHint: 'Form factor limitations create interesting design challenges' 
      },
      { 
        word: 'Drone', 
        description: 'Remote controlled flying device', 
        imposterHint: 'Regulatory restrictions vary significantly by location' 
      },
    ],
    countries: [
      { 
        word: 'Japan', 
        description: 'East Asian island nation', 
        imposterHint: 'Ancient traditions and modern innovation coexist uniquely' 
      },
      { 
        word: 'France', 
        description: 'Western European cultural nation', 
        imposterHint: 'Culinary arts and historical architecture are celebrated' 
      },
      { 
        word: 'Brazil', 
        description: 'Largest South American country', 
        imposterHint: 'Biodiversity and cultural diversity are defining features' 
      },
      { 
        word: 'Norway', 
        description: 'Scandinavian Nordic kingdom country', 
        imposterHint: 'Natural phenomena and social welfare systems impress' 
      },
    ],
  };

  const packWords = fallbackWords[pack.id] || fallbackWords.animals;
  const randomIndex = Math.floor(Math.random() * packWords.length);
  return packWords[randomIndex];
}

export async function generateCustomWordPack(topic: string): Promise<WordData> {
  if (!GEMINI_API_KEY) {
    return {
      word: topic,
      description: `Related to ${topic} concept`,
      imposterHint: `Context and application vary significantly`,
    };
  }

  try {
    const prompt = `EXPERT GAME DESIGN - Social Deduction Game Content

Create content for custom topic: "${topic}"

GAME CONTEXT:
- This is like "Spyfall" - crewmates know the word, imposters only get a hint
- Imposters must BLEND IN by discussing without revealing they don't know
- The hint should help imposters ask relevant questions WITHOUT being obvious

YOUR MISSION:
1. Pick ONE specific, concrete thing from this topic
2. Write a 4-6 word factual description
3. Create a CLEVER hint that:
   ✅ Is abstract and philosophical
   ✅ Could apply to MANY things in this category
   ✅ Helps discussion without revealing the answer
   ❌ NEVER mentions the word itself
   ❌ NEVER is too specific

HINT STRATEGY:
Think: "What would people GENERALLY discuss about things in this category?"
Examples:
- "Personal preference plays a significant role here"
- "Historical context adds depth to appreciation"
- "Technical specifications often spark debates"
- "Maintenance and care requirements are important"

STRICT JSON FORMAT (no markdown):
{
  "word": "specific concrete noun",
  "description": "4-6 word factual description",
  "imposterHint": "abstract hint that could fit multiple items"
}

Topic: "${topic}"
Generate now:`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 1.1,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 300,
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate custom word');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const wordData: WordData = JSON.parse(cleanedText);

    // Validation
    const wordLower = wordData.word.toLowerCase();
    const hintLower = wordData.imposterHint.toLowerCase();
    
    if (hintLower.includes(wordLower)) {
      console.warn('Custom hint contained word, using fallback');
      return {
        word: wordData.word,
        description: wordData.description,
        imposterHint: 'Context and interpretation vary among different groups',
      };
    }

    return wordData;
  } catch (error) {
    console.error('Error generating custom word:', error);
    return {
      word: topic,
      description: `Specific example from ${topic}`,
      imposterHint: 'Opinions and experiences differ widely on this',
    };
  }
}