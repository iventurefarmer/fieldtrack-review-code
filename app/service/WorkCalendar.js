import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getWorkOrderCalendar = async (userid) => {
    const URL = API_URL + 'webservice/getMonthlyWorkslist';

    const data = JSON.stringify({
        userid: userid
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