import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getWorkOrderDetail = async (workId) => {

    const URL = API_URL + 'worder/getworkorderDetail';

    const data = JSON.stringify({
        work_id: workId
    });

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((response) => {
        return response
    })
    .catch((error) => {
        return error
    });
};

export const uploadNotes = async (formData) => {
    const URL = API_URL + 'worder/addChatdata';
    return axios.post(URL, formData, {
      headers: {
            'content-type': 'application/json'
        }
    })
    .then((response) => {
        return response
    })
    .catch((error) => {
        return error
    });
};
