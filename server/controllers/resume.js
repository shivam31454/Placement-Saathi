const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Standard keywords to check against if no JD provided
const TECH_KEYWORDS = [
    'javascript', 'python', 'java', 'c++', 'react', 'node.js', 'express', 'mongodb',
    'sql', 'aws', 'docker', 'kubernetes', 'git', 'rest api', 'html', 'css',
    'redux', 'typescript', 'agile', 'scrum', 'structure', 'algorithms'
];

exports.analyzeResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a PDF file' });
        }

        const dataBuffer = fs.readFileSync(path.resolve(req.file.path));
        const data = await pdf(dataBuffer);
        const resumeText = data.text.toLowerCase();

        // Cleanup - remove file after processing
        fs.unlinkSync(req.file.path);

        // Analysis Logic
        const jobDescription = req.body.jobDescription ? req.body.jobDescription.toLowerCase() : '';

        let targetKeywords = [];
        if (jobDescription) {
            // Simple extraction of unique words from JD
            // In a real app, use NLP to extract nouns/skills. 
            // Here, we cross-reference JD words with our tech dictionary + common terms
            const words = jobDescription.split(/[\s,]+/); // Split by space or comma
            const uniqueWords = [...new Set(words)];
            // Filter only if they are in our tech dictionary OR just take all long words?
            // Let's stick to our TECH_KEYWORDS for stability, but prioritize ones found in JD
            // AND add words from JD that seem technical (len > 3) ??
            // Better approach: Check which TECH_KEYWORDS are present in JD. Those become mandatory.

            targetKeywords = TECH_KEYWORDS.filter(k => jobDescription.includes(k));

            // If JD implies other skills not in database, we might miss them.
            // But for MVP, matching against a known dictionary based on JD is safer.
            if (targetKeywords.length === 0) targetKeywords = TECH_KEYWORDS.slice(0, 10); // Fallback
        } else {
            targetKeywords = TECH_KEYWORDS;
        }

        // Checking matches
        const matchedKeywords = targetKeywords.filter(keyword => resumeText.includes(keyword));
        const missingKeywords = targetKeywords.filter(keyword => !resumeText.includes(keyword));

        const score = Math.round((matchedKeywords.length / targetKeywords.length) * 100) || 0;

        let feedback = '';
        if (score > 80) feedback = "Excellent! Your resume is highly optimized.";
        else if (score > 50) feedback = "Good start, but you could add more relevant skills.";
        else feedback = "Needs improvement. Try including more keywords from the job description.";

        res.status(200).json({
            success: true,
            data: {
                score,
                matchedKeywords,
                missingKeywords,
                feedback,
                totalKeywords: targetKeywords.length
            }
        });

    } catch (err) {
        console.error("Resume Analysis Error:", err);
        res.status(500).json({ success: false, error: err.message || 'Resume processing failed' });
    }
};
