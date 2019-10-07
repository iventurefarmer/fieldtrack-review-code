import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getAttendance = async (userid, month, year) => {
    const URL = API_URL + 'webservice/getAttendanceCalender';
    
    const data = JSON.stringify({
        'userid': userid,
        'month': month,
        'year': year
    });

    return axios.post(URL, data, {
        headers: {
          'content-type': 'application/json'
        }
    })
    .then((data) => data)
    .catch((error) => error);
};
