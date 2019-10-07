import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { loginUser, addToken } from '../service/LoginService';
import { retrieveItem, storeItem } from '../service/AsyncStorageUtil';
import { theme } from '../utilities/color-palette';
import { Loader } from '../components/common';
import { syncDataToServer } from '../service/database';
// import FCM from 'react-native-fcm';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import { openDatabase } from 'react-native-sqlite-storage';
import VersionNumber from 'react-native-version-number';
let db = openDatabase({ name: 'UserDatabase.db' });

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            emailText: '',
            passwordText: '',
            loginText: 'Login',
            loading: false,
            isButtonDisabled: false
        };

        console.log(VersionNumber);
    }

    handleEmail = (text) => {
        this.setState({ emailText: text });
    };

    handlePassword = (text) => {
        this.setState({ passwordText: text });
    };

    login = (email, pass) => {
        this.setState({ loading: true, loginText: '', isButtonDisabled: true });// loading icon show

        loginUser(email, pass, DeviceInfo.getSystemName(), DeviceInfo.getModel(), VersionNumber.appVersion).then(res => {
            const response = res.data;
            if (response.action === 'success_login') {
                this.getToken(response, res.data.user_id);
                // FCM.getFCMToken().then(token => {
                //     console.log("TOKEN (getFCMToken)", token);
                //     addToken(token, res.data.user_id)
                //         .then(res1 => {
                //             this.loginSuccess(response);
                //             console.log(res1);
                //         }).catch(err => {
                //             console.log(err);
                //             alert('Something went wrong !!!');
                //             this.loginFailed();
                //         });
                // }).catch(err => {
                //     console.log(err);
                //     alert('Something went wrong !!!');
                //     this.loginFailed();
                // });
                // FCM.subscribeToTopic('all');
            } else {
                console.log(res);
                console.log(res.data);
                Alert.alert(
                    'Alert !!!',
                    res.data,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.loginFailed();
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
        }).catch(err => {
            console.log(err);
            Alert.alert(
                'Alert !!!',
                'Something went wrong !!!',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.loginFailed();
                        }
                    },
                ],
                { cancelable: false }
            )
        });
    };

    async getToken(response, userId) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            addToken(fcmToken, userId)
                .then(res1 => {
                    this.loginSuccess(response);
                    console.log(res1);
                }).catch(err => {
                    console.log(err);
                    Alert.alert(
                        'Alert !!!',
                        'Something went wrong !!!',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    this.loginFailed();
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                });
        } else {
            console.log(err);
            Alert.alert(
                'Alert !!!',
                'Something went wrong !!!',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.loginFailed();
                        }
                    },
                ],
                { cancelable: false }
            )
            
        }
    }

    loginSuccess(response) {
        try {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO table_user (action, address, city, company_id, email_id, home_lat_long, mobile_number, office_lat_long, profile_pic, register_date, roll_id, route_id, subzone_id, user_id, user_name, zone_id, modify, push_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [response.action, response.address, response.city, response.company_id, response.email_id, response.home_lat_long, response.mobile_number, response.office_lat_long, response.profile_pic, response.register_date, response.roll_id, response.route_id, response.subzone_id, response.user_id, response.user_name, response.zone_id, false, false],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            storeItem('IS_LOGIN', 'true')
                                .then((res) => {
                                    syncDataToServer()
                                        .then((result) => {
                                            this.loginFailed();
                                            this.props.navigation.replace('SplashInfoScreen');
                                        })
                                        .catch((error) => {
                                            this.loginFailed();
                                        });
                                }).catch((error) => {
                                    this.loginFailed();
                                });
                        } else {
                            this.loginFailed();
                        }
                    }
                )
            })
        } catch (error) {
            this.loginFailed();
        }
    }

    checkInfoScreenRequired() {
        retrieveItem('SPLASH_INFO_SCREEN_FIRST_TIME').then((result, error) => {
            if (error == null || error !== undefined) {
                return true;
            }
            return false;
        })
            .catch((error) => false);
    }

    loginFailed() {
        this.setState({ loading: false, loginText: 'Login', isButtonDisabled: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eee' }}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/field-track.png')}
                    />
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    <TextInput
                        style={styles.inputText}
                        underlineColorAndroid="transparent"
                        placeholder="Email"
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        value={this.state.emailText}
                        onChangeText={this.handleEmail}
                    />

                    <TextInput
                        style={styles.inputText}
                        underlineColorAndroid="transparent"
                        placeholder="Password"
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        value={this.state.passwordText}
                        onChangeText={this.handlePassword}
                        secureTextEntry
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{ margin: 10, alignSelf: 'flex-start', flex: 1 }}
                            onPress={() => this.props.navigation.navigate('NewUserScreen')}
                        >
                            New User
                        </Text>

                        <Text
                            style={{ margin: 10, alignSelf: 'flex-end' }}
                            onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}
                        >
                            Forgot Password?
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        disabled={this.state.isButtonDisabled}
                        onPress={() => this.login(this.state.emailText, this.state.passwordText)}
                    >
                        <View style={styles.submitButtonLayout}>
                            <Text style={styles.submitButtonText}> {this.state.loginText} </Text>
                        </View>
                    </TouchableOpacity>
                    <Text
                        style={{ margin: 10, alignSelf: 'center' }}
                    >
                        {VersionNumber.appVersion}
                    </Text>
                </View>
            </View>
        );
    }
}

LoginScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    logo: {
        height: 100,
        width: '50%',
        resizeMode: 'contain',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1
    },
    inputText: {
        margin: 15,
        height: 40,
        borderColor: theme.primary.bgNormal,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10
    },
    submitButton: {
        backgroundColor: theme.primary.bgNormal,
        padding: 10,
        margin: 15,
        height: 40,
        borderRadius: 5
    },
    submitButtonText: {
        color: 'white',
        alignSelf: 'center'
    },
    submitButtonLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default LoginScreen;
