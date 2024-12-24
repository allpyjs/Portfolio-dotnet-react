import axios from 'axios';

const initRegion = async () => {
    const response = await axios.get('https://ipinfo.io/json?token=c5118d2d404912');
    return response.data;
};

export default initRegion;