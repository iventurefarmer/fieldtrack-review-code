/* eslint-disable global-require */
import React from 'react';
import { DrawerActions, NavigationActions } from 'react-navigation';
import ChangePasswordComponent from '../container/change-password/ChangePasswordComponent';
import ToolbarHeaderMenuBar from '../components/drawer/ToolbarHeaderMenuBar';
import { View, NetInfo, Alert } from 'react-native';
import { connect } from 'react-redux';
import { confirmPasswordChange, newPasswordChange, oldPasswordChange, updatePassword } from '../actions';
import changePassword from '../service/ChangePasswordService';
import { getData } from '../service/database';
import { Loader } from '../components/common';

class ChangePasswordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            loading: false
        };
    }

    onOldPasswordChange = (oldPassword) => {
        // this.props.oldPasswordChange(oldPassword);
        this.setState({ oldPassword });
    };

    onNewPasswordChange = (newPassword) => {
        // this.props.newPasswordChange(newPassword);
        this.setState({ newPassword });
    };

    onConfirmPasswordChange = (confirmPassword) => {
        // this.props.confirmPasswordChange(confirmPassword);
        this.setState({ confirmPassword });
    };

    updatePassword = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state;
        if (newPassword !== '' && confirmPassword !== '' && oldPassword !== '') {
            if (newPassword === confirmPassword) {
                this.setState({ loading: true });
                getData('table_user')
                    .then((result) => {
                        if (result.length > 0) {
                            NetInfo.isConnected.fetch().then(isConnected => {
                                if (isConnected) {
                                    console.log('Internet is connected');
                                    changePassword(result.item(0).user_id, oldPassword, newPassword)
                                        .then(res => {
                                            this.setState({
                                                oldPassword: '',
                                                newPassword: '',
                                                confirmPassword: '',
                                                loading: false
                                            }, () => {
                                                Alert.alert(
                                                    'Alert !!!',
                                                    res.data.result,
                                                    [
                                                        {
                                                            text: 'OK', onPress: () => {
                                                                this.props.navigation.replace('AppDrawerNavigator');
                                                            }
                                                        },
                                                    ],
                                                    { cancelable: false }
                                                )
                                            });
                                        }).catch(err => {
                                            Alert.alert(
                                                'Alert !!!',
                                                err,
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
                                } else {
                                    Alert.alert(
                                        'Alert !!!',
                                        'No internet connection !!! ',
                                        [
                                            {
                                                text: 'OK', onPress: () => {
                                                    this.setState({ loading: false });
                                                }
                                            },
                                        ],
                                        { cancelable: false }
                                    )
                                }
                            })
                        }
                    })
                    .catch((error) => {
                        Alert.alert(
                            'Alert !!!',
                            error,
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        this.setState({ loading: false });
                                    }
                                },
                            ],
                            { cancelable: false }
                        )
                    })
            } else {
                Alert.alert(
                    'Alert !!!',
                    'Password doesn\'t match',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ loading: false });
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
        } else {
            Alert.alert(
                'Alert !!!',
                'All fields are mandatory',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.setState({ loading: false });
                        }
                    },
                ],
                { cancelable: false }
            )
        }
    };

    openHomeDrawer() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderMenuBar
                    headerText="Change Password"
                    call={this.openHomeDrawer.bind(this)}
                    notificationScreen={() => {
                        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'NotificationScreen' }));
                    }}
                    navigation={this.props}
                    isVisible='false'
                />

                <ChangePasswordComponent
                    onOldPasswordChange={this.onOldPasswordChange.bind(this)}
                    onNewPasswordChange={this.onNewPasswordChange.bind(this)}
                    onConfirmPasswordChange={this.onConfirmPasswordChange.bind(this)}
                    updatePassword={this.updatePassword.bind(this)}
                />
            </View>
        );
    }
}

ChangePasswordScreen.navigationOptions = {
    header: null
};

const mapStateToProps = (state) => {
    const {
        oldPassword,
        newPassword,
        confirmPassword,
        loading
    } = state;
    return {
        oldPassword,
        newPassword,
        confirmPassword,
        loading
    };
};

export default connect(mapStateToProps, {
    oldPasswordChange,
    newPasswordChange,
    confirmPasswordChange,
    updatePassword
})(ChangePasswordScreen);
