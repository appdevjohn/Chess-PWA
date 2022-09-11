import axios from 'axios';

const chessAPI = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default chessAPI;