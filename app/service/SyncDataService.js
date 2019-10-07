import axios from 'axios';
import { API_URL } from '../constants/constants';

export const syncData = async (userId, status, deviceId) => {
    const URL = API_URL + 'worder/syncData';

    const data = JSON.stringify({
        id: userId,
        deviceid: deviceId,
        status: status
    });

    
    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    });
};

export const uploadData = async (data) => {
    const URL = API_URL + 'worder/updateFormData';
    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    });
};
