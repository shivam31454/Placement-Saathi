const Groq = require('groq-sdk');
require('dotenv').config({ override: true });


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateInterviewResponse = async (req, res) => {
    try {
        const { history, message } = req.body;

        // Construct the messages array for the AI
        // We start with a system prompt to define the persona
        const systemPrompt = {
            role: "system",
            content: `You are a Senior Staff Software Engineer at a top tech company (like Google, Amazon, or Microsoft) conducting a mock interview for a Full Stack Developer role.
            
            Your Persona:
            - Professional, observant, but encouraging.
            - You deeply understand React, Node.js, MongoDB, System Design, and DSA.
            - You listen carefully. **CRITICAL**: The user is using speech-to-text which often makes mistakes (e.g., "hello hi baby" instead of "hello", "Note JS" instead of "Node JS"). **IGNORE** these hallucinations/artifacts completely and respond ONLY to the meaningful intent. Never mention the "baby" or weird words, just assume the user is professional.

            Instructions:
            1. **Topics**: Focus on Full Stack Web Development (React, Node, Databases), System Design basics, and Behavioral questions.
            2. **Smart Listening**: If the input contains weird words like "baby", "honey", or grammar soup due to STT, **clean it up mentally** and respond to the likely technical or professional intent.
            3. **Flow**: 
               - Start with an introduction if not done.
               - Ask **one** deeper follow-up question if the answer is shallow.
               - If the answer is good, praise specific technical points (e.g., "Great mention of useEffect dependency array...") and move on.
            4. **Conciseness**: Keep responses conversational and under 3-4 sentences so the voice output flows naturally.
            
            Current state: The interview is in progress.`
        };

        // Format history for Groq (ensure roles are 'user' or 'assistant')
        const previousMessages = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        // Add the latest user message if it's not already in history (depending on frontend implementation)
        // If frontend sends 'message' separately, append it.
        const messages = [
            systemPrompt,
            ...previousMessages
        ];

        if (message) {
            messages.push({ role: "user", content: message });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile", // High quality, fast model
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
            stream: false,
            stop: null
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "I apologize, but I'm having trouble thinking of a question right now. Let's move on.";

        res.json({ response: aiResponse });

    } catch (error) {
        console.error("Error in generateInterviewResponse:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
};

const generateChatResponse = async (req, res) => {
    try {
        const { history, message } = req.body;

        const systemPrompt = {
            role: "system",
            content: `You are 'Placement Saathi Bot', an intelligent career mentor specializing in Software Engineering and Full Stack Development.
            
            Your Goals:
            1. Provide expert advice on MERN Stack, DSA, System Design, and Resume Building.
            2. "Listen Smartly": Interpret user typos or vague queries intelligently (e.g., "how to center div" -> CSS Flexbox/Grid).
            3. **Grammar & polish**: If the user asks for help drafting text (like an email or intro), make it grammatically perfect and professional.
            4. Be concise, motivating, and actionable.

            Keep natural responses under 3 sentences for chat, unless a detailed technical explanation is required.`
        };

        const previousMessages = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        const messages = [
            systemPrompt,
            ...previousMessages
        ];

        if (message) {
            messages.push({ role: "user", content: message });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 200,
        });

        res.json({
            success: true,
            response: chatCompletion.choices[0]?.message?.content || "I'm not sure how to help with that."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Chat error", error: error.message });
    }
};

const generateInsights = async (req, res) => {
    try {
        const { testPerformance, leetCodeStats } = req.body;

        const systemPrompt = {
            role: "system",
            content: `You are an expert personalized tutor for coding interviews. 
            Analyze the student's performance data.
            Output format: A JSON object with two fields:
            1. "short_summary": 1-2 sentences highlighting strengths and main weakness.
            2. "action_item": A concrete step to improve (e.g., "Practice 5 Hard DP problems").`
        };

        const userMessage = {
            role: "user",
            content: `Data:
            Test History: ${JSON.stringify(testPerformance)}
            LeetCode Stats: ${JSON.stringify(leetCodeStats)}
            
            Provide insights.`
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, userMessage],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 150,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        res.json({ success: true, ...result });

    } catch (error) {
        console.error("Error generating insights:", error);
        res.status(500).json({ success: false, error: "Failed to generate insights" });
    }
};

module.exports = { generateInterviewResponse, generateChatResponse, generateInsights };

