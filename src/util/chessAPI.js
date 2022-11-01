import axios from 'axios';

const chessAPI = axios.create({
    baseURL: process.env.REACT_APP_CHESS_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default chessAPI;