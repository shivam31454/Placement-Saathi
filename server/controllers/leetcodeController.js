const axios = require('axios');
const User = require('../models/User');

// @desc    Update LeetCode Username
// @route   POST /api/v1/leetcode/username
// @access  Private
const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { leetcodeUsername: username }, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get LeetCode Analytics
// @route   GET /api/v1/leetcode/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.leetcodeUsername) {
            return res.status(400).json({ success: false, error: 'LeetCode username not linked' });
        }

        const username = user.leetcodeUsername;

        // 1. Fetch Basic Stats & Tag Stats
        const statsQuery = `
        query userStats($username: String!) {
            matchedUser(username: $username) {
                username
                submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
                submissionCalendar
                tagProblemCounts {
                    advanced { tagName tagSlug problemsSolved }
                    intermediate { tagName tagSlug problemsSolved }
                    fundamental { tagName tagSlug problemsSolved }
                }
            }
        }
        `;

        const response = await axios.post('https://leetcode.com/graphql', {
            query: statsQuery,
            variables: { username }
        });

        if (!response.data.data.matchedUser) {
            return res.status(404).json({ success: false, error: 'User not found on LeetCode' });
        }

        const data = response.data.data.matchedUser;
        const allTags = [
            ...data.tagProblemCounts.fundamental,
            ...data.tagProblemCounts.intermediate,
            ...data.tagProblemCounts.advanced
        ];

        // 2. Analyze Topics (Scale 0-10)
        // Simple logic: < 5 solved = Weak, 5-15 = Average, > 15 = Strong
        // Scaled to 10: min(10, count * 0.7)
        const analyzedTags = allTags.map(tag => {
            let score = Math.min(10, Math.round(tag.problemsSolved * 0.5)); // Heuristic
            if (tag.problemsSolved === 0) score = 1;
            return {
                ...tag,
                score,
                status: score < 5 ? 'Weak' : score > 7 ? 'Strong' : 'Average' // Changed < 4 to < 5 as requested
            };
        }).sort((a, b) => a.score - b.score);

        const weakAreas = analyzedTags.filter(t => t.status === 'Weak'); // Removed slice to show all
        const strongAreas = analyzedTags.filter(t => t.status === 'Strong');

        // 3. Get Recommendations for top 3 Weak Areas
        let recommendations = [];
        for (const area of weakAreas) {
            const recs = await fetchRecommendations(area.tagSlug);
            recommendations.push({
                topic: area.tagName,
                problems: recs
            });
        }

        const stats = data.submitStats.acSubmissionNum;
        const totalSolved = {
            all: stats.find(s => s.difficulty === 'All')?.count || 0,
            easy: stats.find(s => s.difficulty === 'Easy')?.count || 0,
            medium: stats.find(s => s.difficulty === 'Medium')?.count || 0,
            hard: stats.find(s => s.difficulty === 'Hard')?.count || 0,
        };

        // 4. Process Submission History (Last 30 Days)
        let submissionHistory = [];
        try {
            const calendar = JSON.parse(data.submissionCalendar || '{}');
            const now = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);

            // Initialize last 30 days with 0
            for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                submissionHistory.push({ date: dateStr, count: 0 });
            }

            // Fill with actual data
            Object.entries(calendar).forEach(([timestamp, count]) => {
                const date = new Date(parseInt(timestamp) * 1000);
                if (date >= thirtyDaysAgo) {
                    const dateStr = date.toISOString().split('T')[0];
                    const entry = submissionHistory.find(h => h.date === dateStr);
                    if (entry) entry.count = count;
                }
            });
        } catch (e) {
            console.error("Error parsing submission calendar", e);
        }

        res.status(200).json({
            success: true,
            data: {
                username: data.username,
                totalSolved,
                analyzedTags,
                weakAreas,
                strongAreas,
                recommendations,
                submissionHistory
            }
        });

    } catch (error) {
        console.error("LeetCode Analytics Error:", error.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Helper: Fetch problems for a tag
// Using LeetCode's problemsetQuestionList query
async function fetchRecommendations(tagSlug) {
    const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            data {
                title
                titleSlug
                difficulty
                topicTags { name slug }
            }
        }
    }
    `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: query,
            variables: {
                categorySlug: "",
                limit: 50,
                skip: 0,
                filters: {
                    tags: [tagSlug],
                }
            }
        });

        // Filter out premium if we could check, for now just take top 3
        const allProblems = response.data.data.problemsetQuestionList?.data || [];
        const result = [];

        // Helper to find first problem of difficulty not already in result
        const addProblem = (diff) => {
            const prob = allProblems.find(p => p.difficulty === diff && !result.some(r => r.titleSlug === p.titleSlug));
            if (prob) result.push(prob);
        };

        addProblem('Easy');
        addProblem('Medium');
        addProblem('Hard');

        // Fallback: If we couldn't find one of each, fill with whatever is available to reach 3
        if (result.length < 3) {
            const remaining = allProblems.filter(p => !result.some(r => r.titleSlug === p.titleSlug)).slice(0, 3 - result.length);
            result.push(...remaining);
        }

        return result;
    } catch (err) {
        console.error(`Failed to fetch recs for ${tagSlug}`, err.message);
        return [];
    }
}

module.exports = { updateUsername, getAnalytics };
