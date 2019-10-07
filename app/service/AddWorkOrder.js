import axios from 'axios';
import { API_URL } from '../constants/constants';

export const getCustomerList = async (userId, company_id) => {

    const URL = API_URL + 'webservicenew/customerList';

    const data = JSON.stringify({
        userid: userId,
        company_id: company_id
    });

    return axios.post(URL, data, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((data) => data
    ).catch((error) => error);
};

export const saveWorkOrder = async (data) => {

    const URL = API_URL + 'workorder/insertworkorderApi';

    const obj = JSON.stringify({
        customer_id: data.CustomerId,
        sendaddress: data.Address,
        userid: data.userId,
        company_id: data.company_id,
        datestart: data.fromDate,
        datestart_readonly: data.fromDate,
        from_time: data.fromTime,
        dateend: data.toDate,
        dateend_readonly: data.toDate,
        create_curr_schedule_task: "NN",
        create_curr_task: "N",
        to_time: data.toTime,
        dynamicform: data.DyanmicForm,
        job_type: data.JobType,
        note: data.Note,
        repeat_status: data.RepeatOrder,
        repeat_date: data.RepeatOrderType,
        repeat_data_value: data.RepeatCount,
        "repeat_till": ""
    });

    console.log(obj);
    return axios.post(URL, obj, {
        headers: {
            'content-type': 'application/json'
        }
    }).then((res) => res
    ).catch((error) => error);
};
