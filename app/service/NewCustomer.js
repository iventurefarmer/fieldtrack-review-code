import axios from 'axios';
import { API_URL } from '../constants/constants';

export const saveCustomer = async (data) => {

    const URL = API_URL + 'customer/createCustomerApi';

    const obj = JSON.stringify({
        company_id: data.company_id,
        userid: data.userId,
        customer_name: data.CustomerName,
        billing_address: data.BillingAddress,
        customer_add: data.Address,
        email: data.EmailID,
        customer_mobile_no: data.PrimaryNumber,
        city: data.City,
        state: data.State,
        country: data.Country,
        pincode: data.PostalCode,
        personname: data.Name,
        designation: data.Designation,
        personemail: data.PersonEmail,
        personmobile: data.MobileNo,
        customernote: data.CustomerNote,
        zone_id: data.Zone
    });

    console.log(obj);
    return axios.post(URL, obj, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((res) => res
    ).catch((error) => error);
};


export const getCountryList = async () => {

    const URL = API_URL + 'customer/countryList';

    return axios.get(URL, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};

export const getZoneList = async (company_id, country_id) => {

    const URL = API_URL + 'customer/zoneApi';
    const obj = JSON.stringify({
        company_id: company_id,
        country_id: country_id
    });

    return axios.post(URL, obj, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};
