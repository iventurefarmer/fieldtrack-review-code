import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getUserProfile = async (userid) => {
    const URL = API_URL + 'webservice/getProfileInfo';
    
    const data = JSON.stringify({
        userid: userid
    });

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};

export const updateUserProfile = async (userid, profilePic) => {
    const URL = API_URL + 'worder/updateuserprofile';
    
    const data = JSON.stringify({
        userid: userid,
        profilepic: profilePic
    });

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};