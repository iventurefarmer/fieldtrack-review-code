import axios from 'axios';
import { API_URL } from '../constants/constants';
import FCM from 'react-native-fcm';

export const notification = async (userId, status, deviceId) => {

    return FCM.getFCMToken().then(token => {
        console.log("TOKEN (getFCMToken)", token);
        //send to the server
    });

    // const URL = API_URL + 'worder/syncData';
    // const data = JSON.stringify({
    //     id: userId,
    //     deviceid: deviceId,
    //     status: status
    // });

    // return axios.post(URL, data, {
    //     headers: {
    //         'content-type': 'application/json'
    //     }
    // });
};
