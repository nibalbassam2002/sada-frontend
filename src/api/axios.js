import axios from 'axios';

const api = axios.create({
    // الرابط الذي حصلتِ عليه من ريندر
    baseURL: 'https://sada-api-b5qk.onrender.com/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// إضافة التوكن تلقائياً في كل طلب إذا كان موجوداً في الـ localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;