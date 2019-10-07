import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getWorkOrderCount = async (userId) => {

    const URL = API_URL + 'webservice/getWorkOrderCount';
    
    const data = JSON.stringify({
      userid: userId
    });

    return axios.post(URL, data, {
      headers: {
        'content-type': 'application/json'
      }
    }).then((data) => data
    ).catch((error) => error);
};
