import axios from 'axios';
import { API_URL } from '../constants/constants';

export const loginUser = async (email, password, os, model, appVersion) => {
    const URL = API_URL + 'register/signinCustomer';

    const data = JSON.stringify({
        email_id_or_mobile: email,
        password,
        os,
        model,
        appVersion
    });

    console.log(data);

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};

export const forgotPassword = async (email) => {
    const URL = API_URL + 'register/resetPassword';
    const data = JSON.stringify({
        email_id: email
    });

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};

export const addToken = async (token, userID) => {
    const URL = API_URL + 'worder/addToken';
    const data = JSON.stringify({
        token,
        userID
    });

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};

export const logOut = async (user_id) => {
    const URL = API_URL + 'register/logoutUser';
    const data = JSON.stringify({
        user_id
    });
    console.log(data);
    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};
