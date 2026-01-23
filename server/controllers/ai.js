const Groq = require('groq-sdk');

exports.chatWithAI = async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not defined");
        }

        const groq = new Groq({
            apiKey: apiKey
        });

        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Construct messages array from history + current message
        // History should be an array of { role: 'user' | 'assistant', content: string }
        const messages = history ? [...history] : [];
        messages.push({ role: 'user', content: message });

        // Add a system prompt to guide the AI's behavior
        const systemPrompt = {
            role: "system",
            content: "You are an intelligent AI assistant for 'Placement Saathi', a platform designed to help students prepare for placements. You are helpful, kind, and knowledgeable about coding, interviews, resumes, and career advice. Keep your answers concise yet informative."
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

        res.status(200).json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        console.error("AI Chat Error Details:", error);
        res.status(500).json({
            success: false,
            message: `AI Error: ${error.message}`,
            error: error.message
        });
    }
};
