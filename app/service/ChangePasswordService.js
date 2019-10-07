import axios from 'axios';
import { API_URL } from '../constants/constants';

const changePassword = async (userid, old_password, new_password) => {
    const URL = API_URL + 'home/changePassword';

    const data = JSON.stringify({
        user_id: userid,
        data: {
            oldpassword: old_password,
            newpassword: new_password,
            confirmpassword: new_password
        }
    });
    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};
export default changePassword;