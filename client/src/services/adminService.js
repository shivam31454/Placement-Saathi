import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/admin';

// Get token from local storage
const getToken = () => {
    return localStorage.getItem('token');
};

const config = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
});

const getStudents = async () => {
    const response = await axios.get(`${API_URL}/students`, config());
    return response.data;
};

const getStudentPerformance = async (studentId) => {
    const response = await axios.get(`${API_URL}/student/${studentId}/performance`, config());
    return response.data;
};

const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, config());
    return response.data;
};

const createTest = async (testData) => {
    const response = await axios.post(`${API_URL}/test`, testData, config());
    return response.data;
};

const getAllTests = async () => {
    const response = await axios.get(`${API_URL}/tests`, config());
    return response.data;
};

const deleteTest = async (testId) => {
    const response = await axios.delete(`${API_URL}/test/${testId}`, config());
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
