import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { Content } from 'native-base';
import BackgroundGeolocation from 'react-native-background-geolocation';
import DeviceInfo from 'react-native-device-info';
import { Calendar } from 'react-native-calendars';
import { retrieveItem, storeItem } from '../service/AsyncStorageUtil';
import { DrawerActions, NavigationActions } from 'react-navigation';
import ToolbarHeaderMenuBar from '../components/drawer/ToolbarHeaderMenuBar';
import { Header, InputAlertModal, Confirm, Loader } from '../components/common';
import moment from 'moment';
import postUserLocation from '../service/UpdateLocationService';
import { getData, syncDataToServer, insertData } from '../service/database';

class AttendanceRecordScreenNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDialogVisible: false,
            nearBy: null,
            reason: '',
            lastLocation: {
                latitude: '',
                longitude: '',
                odometer: 0.0,
                batteryStatus: 0
            },
            indicatorModalVisible: true,
            type: '',
            checkInDisable: true,
            checkOutDisable: true,
            noRecordFound: true,
            markedDates: {},
            loginTime: '',
            logoutTime: '',
            lastSelectedDate: null,
            loading: false,
            attendaceData: [],
            user_id: '',
            company_id: ''
        };
    }

    componentDidMount() {
        this.checkInOutToggleFromLocal1();
        this.getUserData();
    }

    checkInOutToggleFromLocal(val1, val2) {
        storeItem('ATTENDANCE_CHECK_IN_DISABLE', JSON.stringify({ 'checkinDisable': val1 }))
            .then((res) => {
                this.setState({
                    checkInDisable: val1, checkOutDisable: val2
                });
            }).catch((error) => {
                //console.log(`Promise is rejected with error: ${error}`);
            });
    }

    checkInOutToggleFromLocal1(val1, val2) {
        retrieveItem('ATTENDANCE_CHECK_IN_DISABLE')
            .then((res) => {
                console.log(res);
                this.setState({
                    checkInDisable: res.checkinDisable, checkOutDisable: !res.checkinDisable
                });
            }).catch((error) => {
                this.setState({
                    checkInDisable: false, checkOutDisable: true
                });
            });
    }

    syncDataFromServer() {
        this.setState({ loading: true });
        syncDataToServer()
            .then((result) => {
                this.setState({ loading: false });
                this.getMonthAttendanceList();
            })
            .catch((error) => {
                this.setState({ loading: false });
                // alert(error);
            });
    }

    getUserData() {
        this.setState({ loading: true });
        getData('table_user')
            .then((res1) => {
                console.log(res1.item(0))
                if (res1.length > 0) {
                    this.setState({ user_id: res1.item(0).user_id, company_id: res1.item(0).company_id });
                    this.getMonthAttendanceList();
                }
            })
            .catch((err) => {
                this.setState({ noRecordFound: true, loading: false });
            })
    }

    getMonthAttendanceList() {
        this.setState({ loading: true });
        getData('attendance')
            .then((result) => {
                if (result.length > 0) {
                    // console.log(result.item(0))
                    let markedCal = {};
                    for (let i = 0; i < result.length; i++) {
                        if (moment(result.item(i).datetime).format('YYYY-MM-DD') in markedCal) {
                            markedCal[moment(result.item(i).datetime).format('YYYY-MM-DD')].data.push(result.item(i));
                        } else {
                            markedCal[moment(result.item(i).datetime).format('YYYY-MM-DD')] = {
                                data: [result.item(i)],
                                marked: true,
                                selected: moment(result.item(i).datetime).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'),
                                dotColor: '#ff6600'
                            };
                        }
                    }
                    this.setState({ markedDates: markedCal, loading: false });
                    this.dateChange({ dateString: moment().format('YYYY-MM-DD') });
                } else {
                    this.setState({ loading: false });
                }
            }).catch((error) => {
                this.setState({ noRecordFound: true, loading: false });
            });
    }



    getMonthOrDate(value) {
        return value < 10 ? '0' + value : value; // ('' + month) for string result
    }

    startLocation() {
        this.setState({ loading: true });
        BackgroundGeolocation.getCurrentPosition({ persist: false, samples: 1 },
            (position) => {
                this.setState({
                    lastLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        odometer: position.odometer,
                        batteryStatus: position.battery.level
                    }
                });
                getData('table_user')
                    .then((result) => {
                        const lat2 = position.coords.latitude;
                        const lon2 = position.coords.longitude;

                        if (result.item(0).home_lat_long !== '') {
                            const lat1 = result.item(0).home_lat_long.split(',')[0];
                            const lon1 = result.item(0).home_lat_long.split(',')[1];

                            const R = 6371e3; // earth radius in meters
                            const φ1 = lat1 * (Math.PI / 180);
                            const φ2 = lat2 * (Math.PI / 180);
                            const Δφ = (lat2 - lat1) * (Math.PI / 180);
                            const Δλ = (lon2 - lon1) * (Math.PI / 180);

                            const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
                                ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                            const distance = R * c;
                            if (distance < 300) {
                                this.setState({ isDialogVisible: true, nearBy: 'Near By Home', loading: false });
                            }
                        }

                        // if office lat-lng != ''
                        if (result.item(0).office_lat_long !== '') {

                            const lat3 = result.item(0).office_lat_long.split(',')[0];
                            const lon3 = result.item(0).office_lat_long.split(',')[1];

                            const R = 6371e3; // earth radius in meters
                            const φ1 = lat3 * (Math.PI / 180);
                            const φ2 = lat2 * (Math.PI / 180);
                            const Δφ = (lat2 - lat3) * (Math.PI / 180);
                            const Δλ = (lon2 - lon3) * (Math.PI / 180);

                            const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
                                ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                            const distance = R * c;
                            if (distance > 300) {
                                this.setState({ isDialogVisible: true, nearBy: 'Out Of Office', loading: false });
                            }

                            if (!this.state.isDialogVisible) {
                                this.backgroundLocationStart();
                            }
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    })
            },
            (error) => {
                console.log(error);
                Alert.alert(
                    'Alert !!!',
                    'Please turn on GPS',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ loading: false });
                            }
                        },
                    ],
                    { cancelable: false }
                )
            });
    }

    backgroundLocationStart() {
        updateLocationToServer(this.state.lastLocation.latitude, this.state.lastLocation.longitude, 'login', this.state.lastLocation.odometer, this.state.user_id, this.state.company_id, this.state.nearBy, this.state.lastLocation.batteryStatus);
        let query = `INSERT INTO attendance (company_id, date, datetime, attendance_id, lat, logoutby, longi, odometer, remark, time, type, user_id, utctime, modify, push_flag, geofence, BatteryStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        let value = [this.state.company_id, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD hh:mm:ss'), '', this.state.lastLocation.latitude, '', this.state.lastLocation.longitude, this.state.lastLocation.odometer, this.state.reason, moment().format('hh:mm:ss'), 'login', this.state.user_id, '+05.30', true, true, this.state.nearBy, this.state.lastLocation.batteryStatus];
        insertData(query, value)
            .then((result) => {
                this.setState({ reason: '', loading: false });
                this.getMonthAttendanceList();
                syncDataToServer();
                this.checkInOutToggleFromLocal(true, false);
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }

    stopLocation() {
        this.setState({ loading: true });
        BackgroundGeolocation.getCurrentPosition({ persist: false, samples: 1 },
            (position) => {
                this.setState({
                    lastLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        odometer: position.odometer,
                        batteryStatus: position.battery.level
                    }
                });
                getData('table_user')
                    .then((result) => {
                        const lat2 = position.coords.latitude;
                        const lon2 = position.coords.longitude;

                        if (result.item(0).home_lat_long !== '') {
                            const lat1 = result.item(0).home_lat_long.split(',')[0];
                            const lon1 = result.item(0).home_lat_long.split(',')[1];

                            const R = 6371e3; // earth radius in meters
                            const φ1 = lat1 * (Math.PI / 180);
                            const φ2 = lat2 * (Math.PI / 180);
                            const Δφ = (lat2 - lat1) * (Math.PI / 180);
                            const Δλ = (lon2 - lon1) * (Math.PI / 180);

                            const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
                                ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                            const distance = R * c;
                            if (distance < 300) {
                                this.setState({ isDialogVisible: true, nearBy: 'Near By Home', loading: false });
                            }
                        }

                        // if office lat-lng != ''
                        if (result.item(0).office_lat_long !== '') {

                            const lat3 = result.item(0).office_lat_long.split(',')[0];
                            const lon3 = result.item(0).office_lat_long.split(',')[1];

                            const R = 6371e3; // earth radius in meters
                            const φ1 = lat3 * (Math.PI / 180);
                            const φ2 = lat2 * (Math.PI / 180);
                            const Δφ = (lat2 - lat3) * (Math.PI / 180);
                            const Δλ = (lon2 - lon3) * (Math.PI / 180);

                            const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
                                ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                            const distance = R * c;
                            if (distance > 300) {
                                this.setState({ isDialogVisible: true, nearBy: 'Out Of Office', loading: false });
                            }

                            if (!this.state.isDialogVisible) {
                                // this.setState({ loading: false });
                                this.stopBackgroundLocation();
                            }
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    })
            },
            (error) => {
                console.log(error);
                Alert.alert(
                    'Alert !!!',
                    'Please turn on GPS',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ loading: false });
                            }
                        },
                    ],
                    { cancelable: false }
                )
            });
    }

    stopBackgroundLocation() {
        let query = `INSERT INTO attendance (company_id, date, datetime, attendance_id, lat, logoutby, longi, odometer, remark, time, type, user_id, utctime, modify, push_flag, geofence, BatteryStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        let value = [this.state.company_id, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD hh:mm:ss'), '', this.state.lastLocation.latitude, 'user', this.state.lastLocation.longitude, this.state.lastLocation.odometer, this.state.reason, moment().format('hh:mm:ss'), 'logout', this.state.user_id, '+05.30', true, true, this.state.nearBy, this.state.lastLocation.batteryStatus];
        insertData(query, value)
            .then((result) => {
                console.log(result);
                this.setState({ reason: '', loading: false });
                this.getMonthAttendanceList();
                syncDataToServer();
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
        updateLocationToServer(
            this.state.lastLocation.latitude,
            this.state.lastLocation.longitude,
            'logout',
            this.state.lastLocation.odometer,
            this.state.user_id,
            this.state.company_id,
            this.state.nearBy,
            this.state.lastLocation.batteryStatus
        );
        this.checkInOutToggleFromLocal(false, true);
    }

    openHomeDrawer() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    renderAlert() {
        if (this.state.isDialogVisible) {
            return (
                <InputAlertModal
                    children={`You are ${this.state.nearBy}`}
                    value={this.state.reason}
                    onChangeText={(reason) => this.setState({ reason })}
                    onAccept={() => {
                        this.setState({ isDialogVisible: false });
                        if (this.state.checkOutDisable) {
                            this.backgroundLocationStart();
                        } else {
                            this.stopBackgroundLocation();
                        }
                    }}
                    onDecline={() => {
                        this.setState({ isDialogVisible: false });
                    }}
                />
            )
        }
    }

    dateChange(day) {
        const d = day.dateString;
        if (d in this.state.markedDates) {
            //remove old selected date true
            const oldValueMap = this.state.markedDates;
            const newMap = {};
            Object.entries(oldValueMap).forEach(([key, value]) => {
                newMap[key] = {
                    data: value.data,
                    login: value.login,
                    logout: value.logout,
                    marked: value.marked,
                    selected: key === d
                };
            });
            //set new date info to show details
            const selectedCalObject = this.state.markedDates[d];
            this.setState({
                noRecordFound: !selectedCalObject.marked,//if date marked then only show login/logout
                loginTime: selectedCalObject.login,
                logoutTime: selectedCalObject.logout,
                lastSelectedDate: d,
                markedDates: newMap,
                attendaceData: selectedCalObject.data
            });
        } else {
            //remove old selected date true
            const oldValueMap = this.state.markedDates;
            const newMap = {};
            Object.entries(oldValueMap).forEach(([key, value]) => {
                newMap[key] = {
                    data: value.data,
                    login: value.login,
                    logout: value.logout,
                    marked: value.marked,
                    selected: false
                };
            });
            //set selected for new date
            newMap[d] = {
                login: '',
                logout: '',
                marked: false,
                selected: true
            };
            this.setState({ noRecordFound: true, loginTime: '', logoutTime: '', markedDates: newMap, attendaceData: [] });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderMenuBar
                    headerText="Attendance"
                    call={this.openHomeDrawer.bind(this)}
                    notificationScreen={() => {
                        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'NotificationScreen' }));
                    }}
                    syncData={() => {
                        this.syncDataFromServer();
                        // this.setState({ confirmToSync: true });
                    }}
                    navigation={this.props}
                />
                <View style={styles.btnContainer}>
                    <Button
                        style={styles.buttonLeft}
                        disabled={this.state.checkInDisable}
                        title="Check In  "
                        onPress={() => this.startLocation()}
                    />
                    <Button
                        style={styles.buttonRight}
                        title="Check Out  "
                        disabled={this.state.checkOutDisable}
                        onPress={() => this.stopLocation()}
                    />
                </View>

                {/*<Text style={styles.headerStyle}>Attendance History</Text>*/}
                <Header headerText={'Attendance History'} />
                <Calendar
                    // Initially visible month. Default = Date()
                    //current={'2012-03-01'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    //minDate={'2012-05-10'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    // maxDate={'2019-01-14'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {
                        this.dateChange(day);
                    }}
                    // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={(day) => {
                        this.dateChange(day);
                    }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMMM yyyy'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(m) => {
                        // this.getMonthAttendanceList(m.month, m.year);
                    }}
                    // Hide month navigation arrows. Default = false
                    hideArrows={false}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    //renderArrow={(direction) => (<Arrow/>)}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={true}
                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={substractMonth => substractMonth()}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                    onPressArrowRight={addMonth => addMonth()}

                    markedDates={this.state.markedDates}//format  {'2018-12-17': { marked: true }}

                    // Specify style for calendar container element. Default = {}
                    style={styles.calender}
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#ff6600',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        monthTextColor: '#ff6600',
                        // textDayFontFamily: 'monospace',
                        // textMonthFontFamily: 'monospace',
                        // textDayHeaderFontFamily: 'monospace',
                        textMonthFontWeight: 'bold',
                        textDayFontSize: 14,
                        textMonthFontSize: 14,
                        textDayHeaderFontSize: 14
                    }}
                />
                <Content>
                    {this.state.noRecordFound
                        ?
                        <Header headerText={'No Events'} />
                        :
                        <View style={{ alignItems: 'center', backgroundColor: '#fff', borderColor: '#333', borderWidth: 1, borderRadius: 5, margin: 5 }}>
                            {this.state.attendaceData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        {item.type === 'login' ?
                                            <Text style={{ fontSize: 14, margin: 5, fontWeight: '500' }}>Login: {item.time}</Text>
                                            :
                                            <Text style={{ fontSize: 14, margin: 5, fontWeight: '500' }}>Logout: {item.time}</Text>
                                        }
                                    </View>
                                )
                            })}
                        </View>
                    }

                    {this.renderAlert()}
                    {this.state.confirmToSync && <Confirm
                        onAccept={() => {
                            this.syncDataFromServer();
                            this.setState({ confirmToSync: false });
                        }}
                        onDecline={() => {
                            this.setState({ confirmToSync: false });
                        }}
                    >{'Do you want to Refresh page?'}</Confirm>}
                </Content>
            </View>
        );
    }
}

function updateLocationToServer(lat, lng, type, odometer, user_id, company_id, geofence, batteryStatus) {
    postUserLocation(lat, lng, type, odometer, user_id, company_id, geofence, batteryStatus)
        .then(res => {
            console.log('response', type);
            console.log('response', res);
        })
        .catch(err => {
            console.log('response error', err);
        });
};


AttendanceRecordScreenNew.navigationOptions = {
    title: 'Attendance Record Log'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        flexDirection: 'column'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
        marginBottom: 5
    },
    buttonRight: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        alignSelf: 'flex-end'
    },
    buttonLeft: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        alignSelf: 'flex-start'
    },
    headerStyle: {
        fontSize: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 10,
        marginTop: 10
    },
    calender: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 300
    }
});

export default AttendanceRecordScreenNew;
