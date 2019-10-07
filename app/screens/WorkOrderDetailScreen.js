/* eslint-disable global-require */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, Linking } from 'react-native';
import { Card, Tab, Tabs, Icon } from 'native-base';
import moment from 'moment';
import ToolbarHeaderBackMenu from '../components/drawer/ToobarHeaderBackMenu';
import { ScheduleComponent } from '../container/work-order-detail/ScheduleComponent';
import { NoteComponent } from '../container/work-order-detail/NoteComponent';
import { HistoryComponent } from '../container/work-order-detail/HistoryComponent';
import { Loader } from '../components/common';
import Communications from 'react-native-communications';
import { ActivityComponent } from '../container/work-order-detail/ActivityComponent';
import { getData, insertChat, getCustomeQueryData } from '../service/database';

class WorkOrderDetailScreen extends Component {
    orderId = '';
    totalOrders = [];
    taskList = [];
    state = {
        currentOrder: []
    }
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        this.state = {
            index: 0,
            currentOrder: params[0],
            loading: false,
            note: '',
            forms: [],
            DynamicForms: [],
            chat: [],
            repeatworderorder: [],
            selectedDate_Data: [],
            WorkOrderDetails: []
        };
    }

    componentDidMount() {
        // this.get_Data();
        this.props.navigation.addListener('didFocus', () => {
            this.get_Data();
            //Put your Data loading function here instead of my this.LoadData()
        });
    }

    onBackPress() {
        this.props.navigation.goBack(null);
    }

    get_Data(){
        this.setState({ loading: true });
        let Forms_obj = [];
        let dynamicForms_id = JSON.parse(this.state.currentOrder.form_id);
        for( let i = 0; i < dynamicForms_id.length; i++){
            getData(`forms_data WHERE forms_data.repeat_work_order_id=${this.state.currentOrder.work_order_repeat_id} AND dynamic_form_id=${dynamicForms_id[i]}`)
            .then((result) => {
                if(result.length > 0){
                    getCustomeQueryData(`Select df.*, fd.* from dynamic_forms df left join forms_data fd on fd.dynamic_form_id=df.form_id where df.form_id=${dynamicForms_id[i]} and fd.repeat_work_order_id=${this.state.currentOrder.work_order_repeat_id}`)
                    .then((res1) => {
                        res1.item(0).work_order_code = this.state.currentOrder.work_order_code;
                        res1.item(0).work_order_repeat_id = this.state.currentOrder.work_order_repeat_id;
                        res1.item(0).form_id = res1.item(0).dynamic_form_id; 
                        res1.item(0).work_order_lat = this.state.currentOrder.lat;
                        res1.item(0).work_order_longi = this.state.currentOrder.longi; 
                        Forms_obj.push(res1.item(0));
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    })
                }else{
                    getCustomeQueryData(`Select df.*, "Not Started" as form_status from dynamic_forms df where df.form_id=${dynamicForms_id[i]}`)
                    .then((res1) => {
                        res1.item(0).work_order_code = this.state.currentOrder.work_order_code;
                        res1.item(0).work_order_repeat_id = this.state.currentOrder.work_order_repeat_id;
                        res1.item(0).work_order_id = this.state.currentOrder.worder_id;
                        res1.item(0).work_order_lat = this.state.currentOrder.lat;
                        res1.item(0).work_order_longi = this.state.currentOrder.longi; 
                        Forms_obj.push(res1.item(0));
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    })
                }
                getData(`work_order_repeat WHERE work_order_id=${this.state.currentOrder.worder_id}`)
                .then((res3) => {
                    let markedCal = {};
                    if(res3.length > 0){
                        for(let j = 0; j < res3.length; j++){
                            if (moment(res3.item(j).repeat_date).format('YYYY-MM-DD') in markedCal) {
                                markedCal[moment(res3.item(j).repeat_date).format('YYYY-MM-DD')].data.push(res3.item(j));
                            }else{
                                markedCal[moment(res3.item(j).repeat_date).format('YYYY-MM-DD')] = {
                                    data: [res3.item(j)],
                                    marked: true,
                                    selected: moment(res3.item(j).repeat_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'),
                                    dotColor: '#ff6600'
                                };
                            }
                        }
                    }
                    getData(`chat WHERE work_order_id=${this.state.currentOrder.worder_id}`)
                    .then((res2) => {
                        let chat_obj = [];
                        if(res2.length > 0){
                            for(let i = 0; i < res2.length; i++){
                                chat_obj.push(res2.item(i));
                            }
                        }
                        this.setState({ loading: false, forms: Forms_obj, chat: chat_obj, repeatworderorder: markedCal });
                        this.dateChange({dateString: moment().format('YYYY-MM-DD')});
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    });
                })
                .catch((error) => {
                    this.setState({ loading: false });
                });
            })
            .catch((error) => {
                //console.log(error);
            })
        }
    }

    sendMessage(){
        if(this.state.note !== ''){
            this.setState({ loading: true });
            let rootObj = {
                'work_id': this.state.currentOrder.worder_id,
                'company_id': this.state.currentOrder.company_id,
                'sms': this.state.note,
            };
            insertChat(rootObj)
            .then((res1) => {
                this.state.chat.push({ description: this.state.note, work_order_id: this.state.currentOrder.worder_id });
                this.setState({ loading: false, note: '' });
            })
            .catch((error) => {
                this.setState({ loading: false, note: '' });
            })
        }else{
            // console.log("Out");
        }

    }

    openForm(item) {
        this.props.navigation.navigate('DynamicFormScreen', item);
    }

    dateChange(day){
        const d = day.dateString;
        if (d in this.state.repeatworderorder) {
            //remove old selected date true
            const oldValueMap = this.state.repeatworderorder;
            const newMap = {};
            Object.entries(oldValueMap).forEach(([key, value]) => {
                newMap[key] = {
                    data: value.data,
                    marked: value.marked,
                    selected: key === d
                };
            });
            //set new date info to show details
            const selectedCalObject = this.state.repeatworderorder[d];
            this.setState({
                lastSelectedDate: d,
                repeatworderorder: newMap,
                selectedDate_Data: selectedCalObject.data ? selectedCalObject.data : []
            });
        } else {
            //remove old selected date true
            const oldValueMap = this.state.repeatworderorder;
            const newMap = {};
            Object.entries(oldValueMap).forEach(([key, value]) => {
                newMap[key] = {
                    data: value.data,
                    marked: value.marked,
                    selected: false
                };
            });
            //set selected for new date
            newMap[d] = {
                marked: false,
                selected: true
            };
            this.setState({ repeatworderorder: newMap, selectedDate_Data: [] });
        }
    }

    openGps(lat, lng) {
        let f = Platform.select({
            ios: () => {
                Linking.openURL(`http://maps.apple.com/maps?daddr=${lat},${lng}`);
            },
            android: () => {
                console.log('ANDROID')
                Linking.openURL(`http://maps.google.com/maps?daddr=${lat},${lng}`).catch(err => console.error('An error occurred', err));;
            }
        });
    
        f();
    }

    render() {
        const { billing_address, contact_person_name, mobile_no, lat, longi } = this.state.currentOrder;
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderBackMenu
                    headerText="Work Order Detail"
                    call={this.onBackPress.bind(this)}
                    navigation={this.props}
                />

                <Card style={{ margin: 10, padding: 10 }}>
                    <View style={{ flexDirection: 'row', margin: 3 }}>
                        <Icon 
                            name="location-on" type="MaterialIcons" 
                            style={{ color: '#ff6600', fontSize: 20 }} 
                            // onPress={() => this.props.navigation.navigate('MapScreen', {lat, longi})}
                            onPress={() => this.openGps(lat, longi)} 
                        />    
                        <Text style={{ alignSelf: 'center', marginLeft: 10, fontSize: 14 }}>{(billing_address !== null || billing_address !== "") ? billing_address : 'NA'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', margin: 3 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name="user-o" type="FontAwesome" style={{ color: '#ff6600', fontSize: 20 }} /> 
                            <Text style={{ alignSelf: 'center', marginLeft: 10, fontSize: 14 }}>{(contact_person_name !== null || contact_person_name !== "") ? contact_person_name : 'NA'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <Icon 
                                name="phone" type="FontAwesome" 
                                style={{ color: '#ff6600', fontSize: 20 }} 
                                onPress={() => Communications.phonecall(mobile_no, true)}
                            />  
                            <Text
                                style={{ alignSelf: 'center', marginLeft: 10, fontSize: 14 }}>{(mobile_no !== null || mobile_no !== "") ? mobile_no : 'NA'}</Text>
                        </View>
                    </View>
                </Card>
                
                <Tabs>
                    <Tab 
                        tabStyle={{ backgroundColor: '#fff' }} 
                        textStyle={{ color: '#000' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}
                        heading="Activity"
                    >
                        <ActivityComponent 
                            currentOrder={this.state.currentOrder}
                            forms={this.state.forms}
                            dynamicForms={this.state.DynamicForms}
                            openForm={(item) => this.openForm(item)}
                        />
                    </Tab>
                    <Tab 
                        tabStyle={{ backgroundColor: '#fff' }} 
                        textStyle={{ color: '#000' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}  
                        heading="Schedule"
                    >
                        <ScheduleComponent 
                            repeatworderorder={this.state.repeatworderorder}
                            dateChange={(day) => this.dateChange(day)}
                            selectedDate_Data={this.state.selectedDate_Data}
                            orderDetails={this.state.currentOrder}
                        />
                    </Tab>
                    <Tab 
                        tabStyle={{ backgroundColor: '#fff' }} 
                        textStyle={{ color: '#000' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}
                        heading="Note"
                    >
                        <NoteComponent 
                            onValueChange={(note) => this.setState({note: note})}
                            sendMessage={() => this.sendMessage.bind(this)}
                            notes={this.state.note}
                            priviousMessage={this.state.chat}
                        />
                    </Tab>
                    <Tab 
                        tabStyle={{ backgroundColor: '#fff' }} 
                        textStyle={{ color: '#000' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}
                        heading="History"
                    >
                        <HistoryComponent 
                            HistoryData={this.state.repeatworderorder}
                            orderDetails={this.state.currentOrder}
                        />
                    </Tab>
                </Tabs>
            </View>
        );
    }
}

WorkOrderDetailScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        flexDirection: 'column'
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: 10//StatusBar.currentHeight
    },
    tabItem: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10
    }
});

export default WorkOrderDetailScreen;
