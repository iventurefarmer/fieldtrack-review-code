import axios from 'axios';
import moment from 'moment';
import { retrieveItem } from './AsyncStorageUtil';
import { API_URL } from '../constants/constants';


const postUserLocation = async (lat, lng, type, odometer, user_id, company_id, geofence, batteryStatus) => {
    const date = moment().format('YYYY-MM-DD');
    const time = moment().format('HH:mm');
    const timeZone = moment().format('Z');
    let data = JSON.stringify({
        'latlong': `${lat},${lng}`,
        'userid': user_id,
        'type': type,
        'odometer': odometer,
        'company_id': company_id,
        'logoutby': '',// manually logout = ''
        'date': date,// '2018-11-21',
        'time': time,// '14:02',
        'timezone': timeZone,// '+5.30'//'+00:0'
        'geofence': geofence,
        'batteryStatus': batteryStatus
    });
    console.log(data);
    let URL = API_URL + 'webservice/addBgLocation';
    if (type === 'login') {
        URL = API_URL + 'webservice/checkin';
    } else if (type === 'logout') {
        URL = API_URL + 'webservice/checkout';
    } 
    // console.log(data);
    return axios.post(URL, data, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((data) => data)
    .catch((error) => error);

};
export default postUserLocation;
