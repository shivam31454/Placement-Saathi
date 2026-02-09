import api from './api';

const getStudents = async () => {
    const response = await api.get('/admin/students');
    return response.data;
};

const getStudentPerformance = async (studentId) => {
    const response = await api.get(`/admin/student/${studentId}/performance`);
    return response.data;
};

const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

const createTest = async (testData) => {
    const response = await api.post('/admin/test', testData);
    return response.data;
};

const getAllTests = async () => {
    const response = await api.get('/admin/tests');
    return response.data;
};

const deleteTest = async (testId) => {
    const response = await api.delete(`/admin/test/${testId}`);
    return response.data;
};

const adminService = {
    getDashboardStats,
    getStudents,
    getStudentPerformance,
    createTest,
    getAllTests,
    deleteTest
};

export default adminService;
