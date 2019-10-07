/* eslint-disable global-require */
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import ToolbarHeaderMenuBar from '../components/drawer/ToolbarHeaderMenuBar';
import { DrawerActions } from 'react-navigation';
import { Loader, Confirm } from '../components/common';
import { Right, Card } from 'native-base';
import moment from 'moment';
import { getData, syncDataToServer, updateData, getCustomeQueryData } from '../service/database';

class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            notoficationArry: [],
            confirmToSync: false,
            stickyHeaderIndices: []
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            // this.getData();
            this.syncDataFromServer();
        });
    }

    componentWillMount() {
        // this.stickyHeaderIndices();
    }

    openHomeDrawer() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
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
                // alert(error);
            });
    }

    getData() {
        this.setState({ loading: true });
        getData('notification')
            .then((result) => {
                if (result.length > 0) {
                    let dataobj = [];
                    for (let i = 0; i < result.length; i++) {
                        dataobj.push(result.item(i));
                    }
                    let obj = [];
                    if (dataobj.length > 0) {
                        dataobj.sort((a, b) => moment(b) - moment(a)).map((item, index, arr) => {
                            if (index != 0) {
                                if (moment(item.date_created).format('DD-MM-YYYY') === moment(arr[index - 1].date_created).format('DD-MM-YYYY')) {
                                    obj.push(item)
                                } else {
                                    obj.push({ date_created: moment(item.date_created).format('DD-MM-YYYY'), header: true }, item);
                                }
                            } else {
                                obj.push({ date_created: moment(item.date_created).format('DD-MM-YYYY'), header: true }, item);
                            }
                        })
                    }
                    this.setState({ loading: false, notoficationArry: obj });
                    console.log(this.state);
                    this.stickyHeaderIndices();
                    // updateData(`UPDATE notification SET readstatus='Y', modify='1', push_flag='1'`)
                    //     .then((res2) => {
                    //         this.setState({ loading: false });
                    //     })
                    //     .catch((error) => {
                    //         this.setState({ loading: false });
                    //     })
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            })
    }

    stickyHeaderIndices() {
        let arr = [];
        this.state.notoficationArry.map(obj => {
            if (obj.header) {
                arr.push(this.state.notoficationArry.indexOf(obj));
            }
        });
        arr.push(0);
        this.setState({
            stickyHeaderIndices: arr
        });
    }

    gotoDetails(data) {
        console.log(data);
        this.setState({ loading: true });
        getCustomeQueryData(`SELECT wo.worder_id, wo.job_type, wo.work_order_code, wo.form_id, cust.customer_name, cust.lat, cust.longi, cust.billing_address, r_work_order.work_order_repeat_id,r_work_order.status AS work_status, r_work_order.repeat_date AS repeat_date,ccp.mobile_no, r_work_order.delete_flag as flag, ccp.name as contact_person_name FROM work_order wo LEFT JOIN customer cust ON cust.customer_id = wo.customer_id LEFT JOIN work_order_repeat r_work_order ON r_work_order.work_order_id = wo.worder_id LEFT JOIN contact_person ccp ON ccp.customer_id = wo.customer_id WHERE wo.delete_flag="N" AND r_work_order.delete_flag="N" AND wo.worder_id = '${data.work_order_id}'`)
            .then((result) => {
                if (result.length > 0) {
                    updateData(`UPDATE notification SET readstatus='Y', modify='1', push_flag='1' where notification_id=${data.notification_id}`)
                    .then((res2) => {
                        this.setState({ loading: false });
                        syncDataToServer();
                        this.props.navigation.navigate('WorkOrderDetailScreen', [result.item(0)]);
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            })
    }

    _renderItem = ({ item }) => {
        if (item.header) {
            return (
                <Text style={styles.listHeader}>
                    {item.date_created}
                </Text>
            );
        } else if (!item.header) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => this.gotoDetails(item)}
                >
                    <Card
                        style={[styles.cardStyle, { backgroundColor: item.readstatus === 'N' ? '#ddd' : '#fff' }]}
                    >
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>
                            {item.notification}
                        </Text>
                        {/* <Text style={{ color: '#000' }}>
                        Work Order Id:- {item.work_order_id}
                    </Text> */}
                        <Right style={{ alignSelf: 'flex-end' }}>
                            <Text>
                                {moment(item.date_created).format('hh:mm')}
                            </Text>
                        </Right>
                    </Card>
                </TouchableWithoutFeedback>
            );
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderMenuBar
                    headerText="Notification"
                    call={this.openHomeDrawer.bind(this)}
                    navigation={this.props}
                    notificationScreen={() => console.log("Notification Click ")}
                    syncData={() => {
                        this.syncDataFromServer();
                        // this.setState({ confirmToSync: true });
                    }}
                />

                <FlatList
                    data={this.state.notoficationArry}
                    keyExtractor={(item, index) => '' + index}
                    renderItem={this._renderItem}
                    stickyHeaderIndices={this.state.stickyHeaderIndices}
                />

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
        )
    }
}

NotificationScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    listHeader: {
        alignSelf: 'center',
        backgroundColor: '#ddd',
        fontWeight: "bold",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#000'
    },
    cardStyle: {
        borderRadius: 10,
        padding: 10,
        borderColor: '#ff6600',
        marginLeft: 10,
        marginRight: 10
    }
});

export default NotificationScreen;
