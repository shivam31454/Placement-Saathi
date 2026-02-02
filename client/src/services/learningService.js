import api from './api';

const getSubjects = async () => {
    const response = await api.get('/learning/subjects');
    return response.data;
};

const getTopicsBySubject = async (subjectId) => {
    const response = await api.get(`/learning/subjects/${subjectId}/topics`);
    return response.data;
};

const getTopic = async (topicId) => {
    const response = await api.get(`/learning/topics/${topicId}`);
    return response.data;
};

const updateProgress = async (topicId, status) => {
    const response = await api.put(`/learning/topics/${topicId}/progress`, { status });
    return response.data;
};

const getUserProgress = async (subjectId) => {
    const response = await api.get(`/learning/progress/${subjectId}`);
    return response.data;
};

const learningService = {
    getSubjects,
    getTopicsBySubject,
    getTopic,
    updateProgress,
    getUserProgress
};

export default learningService;
