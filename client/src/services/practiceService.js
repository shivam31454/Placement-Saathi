import api from './api';

const generatePracticeTest = async (topicId, difficulty) => {
    const response = await api.post('/practice/generate', { topicId, difficulty });
    return response.data;
};

const submitTest = async (topicId, answers, timeTaken) => {
    const response = await api.post('/practice/submit', { topicId, answers, timeTaken });
    return response.data;
};

const practiceService = {
    generatePracticeTest,
    submitTest
};

export default practiceService;
