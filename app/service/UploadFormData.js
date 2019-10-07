import { API_URL } from '../constants/constants';
import axios from 'axios';

export const uploadFormData = async (formData, value) => {
    let URL;
    if (value === 1) {
        URL = API_URL + 'user/Holdinsertformdata';
    } else {
        URL = API_URL + 'user/insertformdata';
    }
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

export const uploadWorkorderLocation = async (formData) => {
    const URL = API_URL + 'worder/addformstartData';
    return axios.post(URL, formData, {
        headers: {
            'content-type': 'application/json'
        }
    })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        });
};

export const sendEmail = async (id, email_ids) => {
    const URL = API_URL + 'worder/sendWokorder';
    const obj = JSON.stringify({
        id,
        email_ids
    });

    return axios.post(URL, obj, {
        headers: {
            'content-type': 'application/json'
        }
    })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        });
};
