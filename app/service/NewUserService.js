import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getIndustryList = async () => {

    const URL = API_URL + 'signup/industryList';
    
    return axios.get(URL, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((res) => res
    ).catch((error) => error);
};

export const saveNewUser = async (data) => {
    const URL = API_URL + 'signup/signupApi';
    const obj = JSON.stringify({
        email: data.email,
        phone: data.phone,
        company_name: data.companyName,
        industry: data.Industry
    });

    return axios.post(URL, obj, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};
