import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-burger-builder-c9bc0.firebaseio.com/'
});

export default instance;