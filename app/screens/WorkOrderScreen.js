/* eslint-disable global-require */
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform, Linking } from 'react-native';
import { DrawerActions, NavigationActions } from 'react-navigation';
import { Card as BaseCard } from 'native-base';
import moment from 'moment';
import { Card, CardSection, Confirm, Header, Loader } from '../components/common';
import ToolbarHeaderMenuBar from '../components/drawer/ToolbarHeaderMenuBar';
import { theme } from '../utilities/color-palette';
import WorkOrderItem from '../components/WorkOrderItem';
import Communications from 'react-native-communications';
import { syncDataToServer, getCustomeQueryData } from '../service/database';

import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'UserDatabase.db' });

class WorkOrderScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listTitle: 'Today\'s work order',
            currentFlatListData: [],
            todayWork: '0',
            pendingWork: '0',
            holdWork: '0',
            completedWork: '0',
            todayWorkList: [],
            pendingWorkList: [],
            holdWorkList: [],
            completeWorkList: [],
            selectedOrder: null,
            syncUpData: null,
            confirmToSync: false,
            loading: false
        };
        this.openHomeDrawer = this.openHomeDrawer.bind(this);
    };

    componentDidMount() {
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            this.getData();
            // this.syncDataFromServer();
            //Put your Data loading function here instead of my this.LoadData()
        });
        this.syncDataFromServer();
    };

    componentWillUnmount() {
        this.didFocusSubscription.remove();
    }

    onOrderItemCLick(item) {
        this.props.navigation.navigate('WorkOrderDetailScreen', [item]);
    }

    openHomeDrawer() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    };

    closeDrawer() {
        this.props.navigation.dispatch(DrawerActions.closeDrawer());
    };

    changeListTitle(title, data) {
        this.setState({ listTitle: title, currentFlatListData: data });
    };

    navigateScreen(route) {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    getData() {
        this.setState({ loading: true });
        getCustomeQueryData(`SELECT wo.worder_id, wo.job_type, wo.work_order_code, wo.form_id, cust.customer_name, cust.lat, cust.longi, cust.billing_address, r_work_order.work_order_repeat_id,r_work_order.status AS work_status, r_work_order.repeat_date AS repeat_date,ccp.mobile_no, r_work_order.delete_flag as flag, ccp.name as contact_person_name FROM work_order wo LEFT JOIN customer cust ON cust.customer_id = wo.customer_id LEFT JOIN work_order_repeat r_work_order ON r_work_order.work_order_id = wo.worder_id LEFT JOIN contact_person ccp ON ccp.customer_id = wo.customer_id WHERE wo.delete_flag="N" AND r_work_order.delete_flag="N" AND date(r_work_order.repeat_date) <= '${moment().format('YYYY-MM-DD')}' order by repeat_date desc`)
            .then((result) => {
                let tWL = [];
                let pWL = [];
                let hWL = [];
                let cWL = [];
                for (let i = 0; i < result.length; i++) {
                    if ((moment(result.item(i).repeat_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && (result.item(i).work_status === 'Started' || result.item(i).work_status === 'Not Started' || result.item(i).work_status === 'ReStarted')) && result.item(i).work_status !== 'Finished' && result.item(i).work_status !== 'Hold') {
                        tWL.push(result.item(i));
                    } else if (result.item(i).work_status === 'Finished') {
                        cWL.push(result.item(i));
                    } else if (result.item(i).work_status === 'Hold') {
                        hWL.push(result.item(i));
                    } else {
                        pWL.push(result.item(i));
                    }
                }
                this.setState({
                    todayWorkList: tWL,
                    currentFlatListData: tWL,
                    pendingWorkList: pWL,
                    holdWorkList: hWL,
                    completeWorkList: cWL,
                    todayWork: tWL.length,
                    pendingWork: pWL.length,
                    holdWork: hWL.length,
                    completedWork: cWL.length,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({
                    todayWorkList: [],
                    pendingWorkList: [],
                    holdWorkList: [],
                    completeWorkList: [],
                    loading: false
                });
            })
    }

    syncDataFromServer() {
        this.setState({ loading: true });
        syncDataToServer()
            .then((result) => {
                this.setState({ loading: false });
                this.getData();
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
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
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderMenuBar
                    headerText="Work Order List"
                    call={this.openHomeDrawer.bind(this)}
                    notificationScreen={() => {
                        this.navigateScreen('NotificationScreen');
                    }}
                    syncData={() => {
                        this.syncDataFromServer();
                        // this.setState({ confirmToSync: true });
                    }}
                    navigation={this.props}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => this.changeListTitle('Today\'s Work order', this.state.todayWorkList)}
                        >
                            <Card style={styles.cardStyle}>
                                <CardSection style={styles.cardSectionTextStyle}>
                                    <Text>{this.state.todayWork}</Text>
                                </CardSection>
                                <CardSection style={styles.cardSectionStyle}>
                                    <Image style={styles.imageStyle} source={require('../assets/todaywork.png')} />
                                    <Text style={styles.labelTextStyle}>Today's Work</Text>
                                </CardSection>
                            </Card>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => this.changeListTitle('Pending Work order', this.state.pendingWorkList)}>
                            <Card style={styles.cardStyle}>
                                <CardSection style={styles.cardSectionTextStyle}>
                                    <Text>{this.state.pendingWork}</Text>
                                </CardSection>
                                <CardSection style={styles.cardSectionStyle}>
                                    <Image style={styles.imageStyle} source={require('../assets/missedwork.png')} />
                                    <Text style={styles.labelTextStyle}>Pending Work</Text>
                                </CardSection>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => this.changeListTitle('Hold Work order', this.state.holdWorkList)}>
                            <Card style={styles.cardStyle}>
                                <CardSection style={styles.cardSectionTextStyle}>
                                    <Text>{this.state.holdWork}</Text>
                                </CardSection>
                                <CardSection style={styles.cardSectionStyle}>
                                    <Image style={styles.imageStyle} source={require('../assets/holdwork.png')} />
                                    <Text style={styles.labelTextStyle}>Hold Work</Text>
                                </CardSection>
                            </Card>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => this.changeListTitle('Completed Work order', this.state.completeWorkList)}>
                            <Card style={styles.cardStyle}>
                                <CardSection style={styles.cardSectionTextStyle}>
                                    <Text>{this.state.completedWork}</Text>
                                </CardSection>
                                <CardSection style={styles.cardSectionStyle}>
                                    <Image style={styles.imageStyle} source={require('../assets/completedwork.png')} />
                                    <Text style={styles.labelTextStyle}>Completed Work</Text>
                                </CardSection>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </View>

                <Header headerText={this.state.listTitle} />

                {this.state.currentFlatListData.length > 0 ?
                    <FlatList
                        data={this.state.currentFlatListData}
                        renderItem={({ item }) =>
                            // <TouchableOpacity onPress={() => this.onOrderItemCLick(item)}>
                            <WorkOrderItem
                                item={item}
                                cutomerCall={(value) => Communications.phonecall(value, true)}
                                // locationClick={(lat, longi) => this.props.navigation.navigate('MapScreen', { lat, longi })}
                                locationClick={(lat, longi) => this.openGps(lat, longi)}
                                orderClick={() => this.onOrderItemCLick(item)}
                            />
                            // </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => '' + index}
                    />
                    :
                    <BaseCard style={{ padding: 10, marginStart: 10 }}>
                        <Text style={{ alignSelf: 'center' }}>No Data</Text>
                    </BaseCard>
                }

                {this.state.confirmToSync && <Confirm
                    onAccept={() => {
                        this.syncDataFromServer();
                        this.setState({ confirmToSync: false });
                    }}
                    onDecline={() => {
                        this.setState({ confirmToSync: false });
                    }}
                >{'Do you want to Refresh page?'}</Confirm>}
            </View>
        );
    }
}

WorkOrderScreen.navigationOptions = ({ navigation }) => ({
    header: null
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    cardStyle: {
        flexDirection: 'column',
        flex: 1
    },
    cardSectionStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primary.bgNormal
    },
    imageStyle: {
        width: 30,
        height: 30
    },
    labelTextStyle: {
        color: '#FFF'
    },
    cardSectionTextStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1
    }
});

export default WorkOrderScreen;
