import React, { Component } from 'react';
import { FlatList, Text, TouchableNativeFeedback, View, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'native-base';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { NavigationActions } from 'react-navigation';
import { removeAll, retrieveItem } from '../../service/AsyncStorageUtil';
import { Confirm, Loader } from '../common';
import { ProfileImage } from '../common/ProfileImage';
import { getData, LogOut, syncDataToServer } from '../../service/database';
import { logOut } from '../../service/LoginService';

class Drawer extends Component {

    state = { confirmToSignOut: false, username: '', profilepic: '' };
    constructor(props) {
        super(props);
        this.state = { confirmToSignOut: false, loading: false };
    }

    componentDidMount() {
        getData(`table_user`)
            .then((result) => {
                console.log('len', result.length);
                if (result.length > 0) {
                    console.log(result.item(0));
                    this.setState({
                        username: result.item(0).user_name,
                        profilepic: result.item(0).profile_pic,
                        user_id: result.item(0).user_id
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.closeDrawer();
    };

    signOut = () => {
        this.setState({ loading: true, confirmToSignOut: false });
        syncDataToServer()
            .then((result) => {
                console.log(result);
                // this.setState({ loading: false });
                // BackgroundGeolocation.stop(() => {
                //     console.log('- Stop success');
                // });
                console.log('in signoput function');
                removeAll().then(() => {
                    console.log('remove all success');
                    logOut(this.state.user_id).then(res => {
                        console.log(res);
                        LogOut()
                            .then((res1) => {
                                console.log(res1);
                                this.setState({ loading: false });
                                this.props.navigation.replace('SplashScreen');
                            })
                            .catch((err) => {
                                this.setState({ loading: false });
                                console.log(err);
                            })
                    }).catch(err => {
                        console.log(err);
                        Alert.alert(
                            'Alert !!!',
                            'Something went wrong !!!',
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
                }).catch((error) => {
                    this.setState({ loading: false });
                    console.log('remove all error', error);
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
                // alert(error);
            });
    };

    render() {
        const data = [
            { key: 'Work Order', icon: 'note-text', screen: 'WorkOrderScreen', type: 'MaterialCommunityIcons' },
            { key: 'separator1', type: 'separator' },
            { key: 'New Work Order', icon: 'note-text', screen: 'NewWorkOrderScreen', type: 'MaterialCommunityIcons' },
            { key: 'separator8', type: 'separator' },
            { key: 'New Customer', icon: 'note-text', screen: 'NewCustomerScreen', type: 'MaterialCommunityIcons' },
            { key: 'separator9', type: 'separator' },
            { key: 'Work Calendar', icon: 'calendar', screen: 'WorkCalendarScreen', type: 'FontAwesome' },
            { key: 'separator2', type: 'separator' },
            { key: 'Attendance', icon: 'calendar-check-o', screen: 'AttendanceRecordScreenNew', type: 'FontAwesome' },
            { key: 'separator3', type: 'separator' },
            // { key: 'Notification', icon: 'bell', screen: 'NotificationScreen', type: 'FontAwesome' },
            // { key: 'separator4', type: 'separator' },
            { key: 'User Profile', icon: 'user', screen: 'UserProfileScreen', type: 'FontAwesome' },
            { key: 'separator5', type: 'separator' },
            { key: 'Change Password', icon: 'key', screen: 'ChangePasswordScreen', type: 'FontAwesome' },
            { key: 'separator6', type: 'separator' },
            { key: 'Signout', signOut: 'link', icon: 'sign-out', screen: 'Signout', type: 'FontAwesome' },
            { key: 'separator7', type: 'separator' }
        ];
        const {
            drawerFlatList,
            drawerStyle,
            drawerHeader,
            drawerHeaderText,
            drawerItemStyle,
            seperatorStyle,
            drawerMenuStyle
        } = styles;
        // console.log(this.state.profilepic);
        return (
            <View style={drawerStyle}>
                <Loader loading={this.state.loading} />
                <View style={drawerHeader}>
                    <ProfileImage
                        url={this.state.profilepic}
                        placeholder={require('../../assets/user_profile.png')}
                        style={{ width: 80, height: 80 }}
                    />
                    <Text style={drawerHeaderText}>{this.state.username}</Text>
                </View>
                <FlatList
                    style={drawerFlatList}
                    data={data}
                    renderItem={({ item }, index) => {
                        if (item.type === 'separator') {
                            return (
                                <View style={seperatorStyle} />
                            );
                        }
                        if (item.signOut === 'link') {
                            return (
                                <TouchableOpacity onPress={() => this.setState({ confirmToSignOut: true })}>
                                    <View style={drawerItemStyle}>
                                        <Icon name={item.icon} type={item.type} style={{ fontSize: 20, color: '#fd7433' }} />
                                        <Text style={drawerMenuStyle} key={index}>{item.key}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                        return (
                            <TouchableOpacity onPress={this.navigateToScreen(item.screen)}>
                                <View style={drawerItemStyle}>
                                    <Icon name={item.icon} type={item.type} style={{ fontSize: 20, color: '#fd7433' }} />
                                    <Text style={drawerMenuStyle} key={index}>{item.key}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />

                {this.state.confirmToSignOut ? <Confirm
                    onAccept={() => {
                        this.signOut();
                    }}
                    onDecline={() => {
                        this.setState({ confirmToSignOut: false });
                    }}
                >{'Do you want to Signout?'}</Confirm> : null}
            </View>
        );
    }
}

Drawer.navigationOptions = {
    header: null
};

const styles = {
    drawerFlatList: {
        marginBottom: 60,
        paddingBottom: 60
    },
    drawerStyle: {
        flexDirection: 'column',
        marginBottom: 60,
        paddingBottom: 50
    },
    drawerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        flexDirection: 'column',
        // backgroundColor: theme.primary.bgNormal
    },
    drawerHeaderText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
        marginTop: 10,
        fontWeight: 'bold'
    },
    drawerItemStyle: {
        flexDirection: 'row',
        padding: 14,
        alignItems: 'center'
    },
    seperatorStyle: {
        height: 0.5,
        backgroundColor: 'gray'
    },
    drawerMenuStyle: {
        fontSize: 16,
        marginLeft: 15
    }
};

export default Drawer;
