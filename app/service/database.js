import { openDatabase } from 'react-native-sqlite-storage';
import { syncData, uploadData } from './SyncDataService';
let db = openDatabase({ name: 'UserDatabase.db' });


async function createDatabase() {
    try {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_user(id INTEGER PRIMARY KEY AUTOINCREMENT, action VARCHAR(50), address VARCHAR(250), city VARCHAR(250), company_id INTEGER, email_id VARCHAR(200), home_lat_long VARCHAR(250), mobile_number VARCHAR(50), office_lat_long VARCHAR(200), profile_pic VARCHAR(255), register_date VARCHAR(200), roll_id INTEGER, route_id INTEGER, subzone_id VARCHAR(50), user_id VARCHAR(50), user_name VARCHAR(100), zone_id VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Attendace Table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='attendance'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS attendance', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS attendance(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(50), company_id VARCHAR(250), date VARCHAR(100), datetime VARCHAR(100), attendance_id VARCHAR(50), lat VARCHAR(250), logoutby VARCHAR(50), longi VARCHAR(200), odometer VARCHAR(200), remark VARCHAR(200), time VARCHAR(200), type VARCHAR(200), user_id VARCHAR(50), utctime VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10), geofence VARCHAR(50), BatteryStatus VARCHAR(200))',
                            []
                        );
                    }
                }
            );

            // For notification table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='notification'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS notification', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS notification(id INTEGER PRIMARY KEY AUTOINCREMENT, date_created VARCHAR(50), notification_id VARCHAR(250), notification VARCHAR(250), pagename VARCHAR(100), readstatus VARCHAR(10), repeat_work_order_id VARCHAR(20), work_order_id VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For chat table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='chat'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS chat', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS chat(id INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR(250), chat_id VARCHAR(50), work_order_id VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For company profile table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='company_profile'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS company_profile', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS company_profile(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), code VARCHAR(50), company VARCHAR(250), companyid VARCHAR(50), currency VARCHAR(50), name VARCHAR(100), symbol VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Work order table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='work_order'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS work_order', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS work_order(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), company_id VARCHAR(50), customer_id VARCHAR(250), delete_flag VARCHAR(50), form_id VARCHAR(50), from_date VARCHAR(100), worder_id VARCHAR(20), job_type VARCHAR(20), note VARCHAR(50), status VARCHAR(20), to_date VARCHAR(20), work_order_code VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Unit table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='unit'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS unit', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS unit(id INTEGER PRIMARY KEY AUTOINCREMENT, company_id VARCHAR(100), unit_id VARCHAR(50), unit_name VARCHAR(250), unit_type VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Service table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='service'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS service', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS service(id INTEGER PRIMARY KEY AUTOINCREMENT, company_id VARCHAR(100), service_id VARCHAR(50), price VARCHAR(250), service_name VARCHAR(50), unit VARCHAR(50), unit_id VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Product table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='product'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS product', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT, company_id VARCHAR(100), product_id VARCHAR(50), price VARCHAR(250), product_name VARCHAR(50), unit VARCHAR(50), unit_id VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Contact Person table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='contact_person'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS contact_person', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS contact_person(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), custom_note VARCHAR(50), customer_id VARCHAR(250), email_id VARCHAR(50), contact_person_id VARCHAR(50), mobile_no VARCHAR(20), name VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Customer table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='customer'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS customer', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS customer(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), billing_address VARCHAR(250), company_id VARCHAR(50), customer_add VARCHAR(250), customer_name VARCHAR(50), customer_id VARCHAR(20), lat VARCHAR(50), longi VARCHAR(50), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Dynamic Forms table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='dynamic_forms'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS dynamic_forms', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS dynamic_forms(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), active VARCHAR(20), camera VARCHAR(20), company_id VARCHAR(20), created_by VARCHAR(20), created_date VARCHAR(50), delete_flag VARCHAR(20), form_data VARCHAR(250), form_name VARCHAR(50), form_id VARCHAR(50), signature VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );

            // For Forms Data table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='forms_data'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS forms_data', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS forms_data(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), active VARCHAR(20), camera_photos VARCHAR(200), client_signature VARCHAR(200), company_id VARCHAR(20), created_date VARCHAR(50), delete_flag VARCHAR(20), dynamic_form_id VARCHAR(50), end_form_time VARCHAR(50), form_status VARCHAR(50), form_values VARCHAR(200), from_data VARCHAR(200), hold_reason VARCHAR(200), forms_id VARCHAR(20), location VARCHAR(250), product VARCHAR(200), product_services VARCHAR(200), repeat_work_order_id VARCHAR(20), restart_end_time VARCHAR(50), restart_form_time VARCHAR(50), services VARCHAR(250), start_form_time VARCHAR(50), submitted_by VARCHAR(20), timercount VARCHAR(50), utc_time VARCHAR(20), work_order_id VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10), BatteryStatus VARCHAR(200))',
                            []
                        );
                    }
                }
            );

            // For Work order repeat data table
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='work_order_repeat'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS work_order_repeat', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS work_order_repeat(id INTEGER PRIMARY KEY AUTOINCREMENT, IsSync VARCHAR(100), delete_flag VARCHAR(20), form_id VARCHAR(50), work_order_repeat_id VARCHAR(50), repeat_date datetime, status VARCHAR(50), work_order_id VARCHAR(20), modify VARCHAR(10), push_flag VARCHAR(10))',
                            []
                        );
                    }
                }
            );
        });
    } catch (error) {
        //console.log(error.message);
    }
}

async function syncDatabase(data) {
    try {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM dynamic_forms', []);
            tx.executeSql('DELETE FROM attendance', []);
            tx.executeSql('DELETE FROM notification', []);
            tx.executeSql('DELETE FROM chat', []);
            tx.executeSql('DELETE FROM company_profile', []);
            tx.executeSql('DELETE FROM work_order', []);
            tx.executeSql('DELETE FROM unit', []);
            tx.executeSql('DELETE FROM service', []);
            tx.executeSql('DELETE FROM product', []);
            tx.executeSql('DELETE FROM contact_person', []);
            tx.executeSql('DELETE FROM customer', []);
            tx.executeSql('DELETE FROM forms_data', []);
            tx.executeSql('DELETE FROM work_order_repeat', []);


            // Insert data into Dynamic Forms
            if (data.dynamic_forms.length > 0) {
                for (let i = 0; i < data.dynamic_forms.length; i++) {
                    tx.executeSql('INSERT INTO dynamic_forms (IsSync, active, camera, company_id, created_by, created_date, delete_flag, form_data, form_name, form_id, signature, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.dynamic_forms[i].IsSync, data.dynamic_forms[i].active, data.dynamic_forms[i].camera, data.dynamic_forms[i].company_id, data.dynamic_forms[i].created_by, data.dynamic_forms[i].created_date, data.dynamic_forms[i].delete_flag, data.dynamic_forms[i].form_data, data.dynamic_forms[i].form_name, data.dynamic_forms[i].id, data.dynamic_forms[i].signature, false, false],
                        (tx, results) => {
                            console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into attendance
            if (data.attendance.length > 0) {
                for (let i = 0; i < data.attendance.length; i++) {
                    tx.executeSql('INSERT INTO attendance (IsSync, company_id, date, datetime, attendance_id, lat, logoutby, longi, odometer, remark, time, type, user_id, utctime, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.attendance[i].IsSync, data.attendance[i].company_id, data.attendance[i].date, data.attendance[i].datetime, data.attendance[i].id, data.attendance[i].lat, data.attendance[i].logoutby, data.attendance[i].longi, data.attendance[i].odometer, data.attendance[i].remark, data.attendance[i].time, data.attendance[i].type, data.attendance[i].user_id, data.attendance[i].utctime, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into notification
            if (data.notification.length > 0) {
                for (let i = 0; i < data.notification.length; i++) {
                    tx.executeSql('INSERT INTO notification (date_created, notification_id, notification, pagename, readstatus, repeat_work_order_id, work_order_id, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?)', [data.notification[i].date_created, data.notification[i].id, data.notification[i].notification, data.notification[i].pagename, data.notification[i].readstatus, data.notification[i].repeat_work_order_id, data.notification[i].work_order_id, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into chat
            if (data.chat.length > 0) {
                for (let i = 0; i < data.chat.length; i++) {
                    tx.executeSql('INSERT INTO chat (description, chat_id, work_order_id, modify, push_flag) VALUES (?,?,?,?,?)', [data.chat[i].description, data.chat[i].id, data.chat[i].work_order_id, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into company_profile
            if (data.companyprofile.length > 0) {
                for (let i = 0; i < data.companyprofile.length; i++) {
                    tx.executeSql('INSERT INTO company_profile (IsSync, code, company, companyid, currency, name, symbol, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?)', [data.companyprofile[i].IsSync, data.companyprofile[i].code, data.companyprofile[i].company, data.companyprofile[i].companyid, data.companyprofile[i].currency, data.companyprofile[i].name, data.companyprofile[i].symbol, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into work order
            if (data.workorderdata.length > 0) {
                for (let i = 0; i < data.workorderdata.length; i++) {
                    tx.executeSql('INSERT INTO work_order (IsSync, company_id, customer_id, delete_flag, form_id, from_date, worder_id, job_type, note, status, to_date, work_order_code, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.workorderdata[i].IsSync, data.workorderdata[i].company_id, data.workorderdata[i].customer_id, data.workorderdata[i].delete_flag, data.workorderdata[i].form_id, data.workorderdata[i].from_date, data.workorderdata[i].id, data.workorderdata[i].job_type, data.workorderdata[i].note, data.workorderdata[i].status, data.workorderdata[i].to_date, data.workorderdata[i].work_order_code, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into unit
            if (data.unit.length > 0) {
                for (let i = 0; i < data.unit.length; i++) {
                    tx.executeSql('INSERT INTO unit (company_id, unit_id, unit_name, unit_type, modify, push_flag) VALUES (?,?,?,?,?,?)', [data.unit[i].company_id, data.unit[i].id, data.unit[i].unit_name, data.unit[i].unit_type, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into service
            if (data.service.length > 0) {
                for (let i = 0; i < data.service.length; i++) {
                    tx.executeSql('INSERT INTO service (company_id, service_id, price, service_name, unit, unit_id, modify, push_flag) VALUES (?,?,?,?,?,?,?,?)', [data.service[i].company_id, data.service[i].id, data.service[i].price, data.service[i].service_name, data.service[i].unit, data.service[i].unit_id, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into product
            if (data.product.length > 0) {
                for (let i = 0; i < data.product.length; i++) {
                    tx.executeSql('INSERT INTO product (company_id, product_id, price, product_name, unit, unit_id, modify, push_flag) VALUES (?,?,?,?,?,?,?,?)', [data.product[i].company_id, data.product[i].id, data.product[i].price, data.product[i].product_name, data.product[i].unit, data.product[i].unit_id, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into Contact Person
            if (data.contactpersondata) {
                if (data.contactpersondata.length > 0) {
                    for (let i = 0; i < data.contactpersondata.length; i++) {
                        tx.executeSql('INSERT INTO contact_person (IsSync, custom_note, customer_id, email_id, contact_person_id, mobile_no, name, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?)', [data.contactpersondata[i].IsSync, data.contactpersondata[i].custom_note, data.contactpersondata[i].customer_id, data.contactpersondata[i].email_id, data.contactpersondata[i].id, data.contactpersondata[i].mobile_no, data.contactpersondata[i].name, false, false],
                            (tx, results) => {
                                // console.log('Results', results);
                            }
                        )
                    }
                }
            }

            // Insert data into Customer
            if (data.customerdata) {
                if (data.customerdata.length > 0) {
                    for (let i = 0; i < data.customerdata.length; i++) {
                        tx.executeSql('INSERT INTO customer (IsSync, billing_address, company_id, customer_add, customer_name, customer_id, lat, longi, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?,?)', [data.customerdata[i].IsSync, data.customerdata[i].billing_address, data.customerdata[i].company_id, data.customerdata[i].customer_add, data.customerdata[i].customer_name, data.customerdata[i].id, data.customerdata[i].lat, data.customerdata[i].longi, false, false],
                            (tx, results) => {
                                // console.log('Results', results);
                            }
                        )
                    }
                }
            }



            // Insert data into Forms Data
            if (data.forms_data.length > 0) {
                for (let i = 0; i < data.forms_data.length; i++) {
                    tx.executeSql('INSERT INTO forms_data (IsSync, camera_photos, client_signature, company_id, created_date, delete_flag, dynamic_form_id, end_form_time, form_status, form_values, from_data, hold_reason, forms_id, location, product, product_services, repeat_work_order_id, restart_end_time, restart_form_time, services, start_form_time, submitted_by, timercount, utc_time, work_order_id, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.forms_data[i].IsSync, data.forms_data[i].camera_photos, data.forms_data[i].client_signature, data.forms_data[i].company_id, data.forms_data[i].created_date, data.forms_data[i].delete_flag, data.forms_data[i].dynamic_form_id, data.forms_data[i].end_form_time, data.forms_data[i].form_status, data.forms_data[i].form_values, data.forms_data[i].from_data, data.forms_data[i].hold_reason, data.forms_data[i].id, data.forms_data[i].location, data.forms_data[i].product, data.forms_data[i].product_services, data.forms_data[i].repeat_work_order_id, data.forms_data[i].restart_end_time, data.forms_data[i].restart_form_time, data.forms_data[i].services, data.forms_data[i].start_form_time, data.forms_data[i].submitted_by, data.forms_data[i].timercount, data.forms_data[i].utc_time, data.forms_data[i].work_order_id, false, false],
                        (tx, results) => {
                            // console.log('Results', results);
                        }
                    )
                }
            }

            // Insert data into Forms Data
            if (data.workorderepeatdata) {
                let obj = data.workorderepeatdata[0];
                if (obj.length > 0) {
                    // console.log(data.workorderepeatdata[0]);
                    for (let i = 0; i < obj.length; i++) {
                        tx.executeSql('INSERT INTO work_order_repeat (IsSync, delete_flag, form_id, work_order_repeat_id, repeat_date, status, work_order_id, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?)', [obj[i].IsSync, obj[i].delete_flag, obj[i].form_id, obj[i].id, obj[i].repeat_date, obj[i].status, obj[i].work_order_id, false, false],
                            (tx, results) => {
                                // console.log('Results', results);
                            }
                        )
                    }
                }
            }
        })
    } catch (error) {
        //console.log(error);
    }
}

function getData(tableName) {
    return new Promise(function (resolve, reject) {
        try {
            db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM ${tableName}`, [],
                    (tx, results) => {
                        resolve(results.rows);
                    }
                )
            })
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

function getCustomeQueryData(query) {
    return new Promise(function (resolve, reject) {
        try {
            db.transaction((tx) => {
                tx.executeSql(`${query}`, [],
                    (tx, results) => {
                        resolve(results.rows);
                    }
                )
            })
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

function insertChat(data) {
    return new Promise(function (resolve, reject) {
        try {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO chat (description, chat_id, work_order_id, modify, push_flag) VALUES (?,?,?,?,?)', [data.sms, '', data.work_id, true, true],
                    (tx, results) => {
                        resolve(results.rowsAffected);
                    }
                )
            })
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

function updateData(query, value) {
    return new Promise(function (resolve, reject) {
        try {
            db.transaction((tx) => {
                tx.executeSql(query, [],
                    (tx, results) => {
                        resolve(results.rowsAffected);
                    }
                )
            })
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

function insertData(query, value) {
    return new Promise(function (resolve, reject) {
        try {
            db.transaction((tx) => {
                tx.executeSql(query, value,
                    (tx, results) => {
                        resolve(results.rowsAffected);
                    }
                )
            })
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

function syncDataToServer() {
    return new Promise(function (resolve, reject) {
        try {
            let formObj = [];
            let chatObj = [];
            let repeatObj = [];
            let notificationObj = [];
            let attendanceObj = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM table_user', [],
                    (t1, res3) => {
                        if (res3.rows.length > 0) {
                            t1.executeSql('SELECT * FROM forms_data where modify=1 AND push_flag=1', [], (ty, res1) => {
                                if (res1.rows.length > 0) {
                                    for (let i = 0; i < res1.rows.length; i++) {
                                        formObj.push({
                                            repeat_work_order_id: res1.rows.item(i).repeat_work_order_id,
                                            dynamic_form_id: res1.rows.item(i).dynamic_form_id,
                                            hold_reason: res1.rows.item(i).hold_reason,
                                            end_form_time: res1.rows.item(i).end_form_time,
                                            work_order_id: res1.rows.item(i).work_order_id,
                                            from_data: res1.rows.item(i).from_data,
                                            form_values: res1.rows.item(i).form_values,
                                            camera_photos: res1.rows.item(i).camera_photos,
                                            client_signature: res1.rows.item(i).client_signature,
                                            product: res1.rows.item(i).product,
                                            service: res1.rows.item(i).services,
                                            created_date: res1.rows.item(i).created_date,
                                            start_form_time: res1.rows.item(i).start_form_time,
                                            timercount: res1.rows.item(i).timercount,
                                            timezone: res1.rows.item(i).utc_time,
                                            form_status: res1.rows.item(i).form_status,
                                            restart_form_time: res1.rows.item(i).restart_form_time,
                                            restart_end_time: res1.rows.item(i).restart_end_time,
                                            location: JSON.parse(res1.rows.item(i).location),
                                            submitted_by: res3.rows.item(0).user_id,
                                            batteryStatus: res1.rows.item(i).BatteryStatus
                                        });
                                    }
                                }
                                ty.executeSql('SELECT * FROM chat where modify=1 AND push_flag=1', [], (tz, res2) => {
                                    if (res2.rows.length > 0) {
                                        for (let i = 0; i < res2.rows.length; i++) {
                                            chatObj.push({
                                                work_order_id: res2.rows.item(i).work_order_id,
                                                description: res2.rows.item(i).description,
                                                timezone: '+05.30',
                                                date_created: '2019-01-24 00:00:00'
                                            });
                                        }
                                    }
                                    tz.executeSql('SELECT * FROM work_order_repeat where modify=1 AND push_flag=1', [], (ta, res4) => {
                                        if (res4.rows.length > 0) {
                                            for (let i = 0; i < res4.rows.length; i++) {
                                                repeatObj.push({
                                                    id: res4.rows.item(i).work_order_repeat_id,
                                                    status: res4.rows.item(i).status
                                                });
                                            }
                                        }
                                        ta.executeSql('SELECT * FROM notification where modify=1 AND push_flag=1', [], (tb, res5) => {
                                            if (res5.rows.length > 0) {
                                                for (let i = 0; i < res5.rows.length; i++) {
                                                    notificationObj.push({
                                                        id: res5.rows.item(i).notification_id,
                                                    });
                                                }
                                            }
                                            tb.executeSql('SELECT * FROM attendance where modify=1 AND push_flag=1', [], (tc, res6) => {
                                                if (res6.rows.length > 0) {
                                                    for (let i = 0; i < res6.rows.length; i++) {
                                                        attendanceObj.push({
                                                            type: res6.rows.item(i).type,
                                                            date: res6.rows.item(i).date,
                                                            time: res6.rows.item(i).time,
                                                            lat: res6.rows.item(i).lat,
                                                            long: res6.rows.item(i).longi,
                                                            timezone: '+05.30',
                                                            logoutby: res6.rows.item(i).logoutby,
                                                            remark: res6.rows.item(i).remark,
                                                            geofence: res6.rows.item(i).geofence,
                                                            batteryStatus: res6.rows.item(i).BatteryStatus
                                                        });
                                                    }
                                                }
                                                let data = JSON.stringify({
                                                    user_id: res3.rows.item(0).user_id,
                                                    company_id: res3.rows.item(0).company_id,
                                                    chatdata: chatObj,
                                                    forms_data: formObj,
                                                    repeat_work_order_data: repeatObj,
                                                    noti_data: notificationObj,
                                                    attendancedata: attendanceObj
                                                });
                                                console.log(data);
                                                if (chatObj.length > 0 || formObj.length > 0 || repeatObj.length > 0 || notificationObj.length > 0 || attendanceObj.length > 0) {
                                                    uploadData(data).then(res => {
                                                        console.log(res);
                                                        syncData(res3.rows.item(0).user_id, '', '')
                                                            .then((response, error) => {
                                                                if (!response.Error) {
                                                                    console.log(response.data);
                                                                    syncDatabase(response.data)
                                                                        .then((response) => {
                                                                            resolve(response);
                                                                        })
                                                                        .catch((error) => {
                                                                            reject(new Error(error));
                                                                        })
                                                                } else {
                                                                    // reject(new Error(error));
                                                                }
                                                            }).catch(error => {
                                                                console.log(error);
                                                                reject(new Error(error));
                                                            });
                                                    }).catch(err => {
                                                        console.log(err);
                                                        reject(new Error(err));
                                                    });
                                                } else {
                                                    console.log("Empty Obje")
                                                    syncData(res3.rows.item(0).user_id, '', '')
                                                        .then((response, error) => {
                                                            if (!response.Error) {
                                                                console.log(response.data);
                                                                syncDatabase(response.data)
                                                                    .then((response) => {
                                                                        resolve(response);
                                                                    })
                                                                    .catch((error) => {
                                                                        reject(new Error(error));
                                                                    })
                                                            } else {
                                                                // reject(new Error(error));
                                                            }
                                                        }).catch(error => {
                                                            reject(new Error(error));
                                                        });
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    })
            })
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

function LogOut() {
    return new Promise(function (resolve, reject) {
        try {
            db.transaction((tx) => {
                tx.executeSql('DELETE FROM table_user', []);
                tx.executeSql('DELETE FROM attendance', []);
                tx.executeSql('DELETE FROM notification', []);
                tx.executeSql('DELETE FROM chat', []);
                tx.executeSql('DELETE FROM company_profile', []);
                tx.executeSql('DELETE FROM work_order', []);
                tx.executeSql('DELETE FROM unit', []);
                tx.executeSql('DELETE FROM service', []);
                tx.executeSql('DELETE FROM product', []);
                tx.executeSql('DELETE FROM contact_person', []);
                tx.executeSql('DELETE FROM customer', []);
                tx.executeSql('DELETE FROM dynamic_forms', []);
                tx.executeSql('DELETE FROM forms_data', []);
                tx.executeSql('DELETE FROM work_order_repeat', []);
                resolve('Success');
            });
        }
        catch (error) {
            reject(new Error(error));
        }
    })
}

export { createDatabase, syncDatabase, getData, getCustomeQueryData, insertChat, updateData, insertData, syncDataToServer, LogOut };