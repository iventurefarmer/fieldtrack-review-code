import React from 'react';
import { Image, View, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'native-base';
import { theme } from '../utilities/color-palette';
import { TextInput } from 'react-native-gesture-handler';
import { forgotPassword } from '../service/LoginService';
import { Loader } from '../components/common';

class ForgotPasswordScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isButtonDisabled: false,
            email: ''
        };
    }

    sendMail = (email) => {
        if (email !== '') {
            this.setState({ loading: true, isButtonDisabled: true });// loading icon show
            forgotPassword(email).then(res => {
                const response = res.data;
                if (response.status === '1') {
                    Alert.alert(
                        'Alert !!!',
                        'Please check your mail for a temporary password.',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    this.setState({ loading: false, isButtonDisabled: false });
                                    this.props.navigation.goBack()
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert(
                        'Alert !!!',
                        response.message,
                        [
                            {
                                text: 'OK', onPress: () => {
                                    this.setState({ loading: false, isButtonDisabled: false });
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }
            }).catch(err => {
                Alert.alert(
                    'Alert !!!',
                    'Something went wrong !!!',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ loading: false, isButtonDisabled: false });
                            }
                        },
                    ],
                    { cancelable: false }
                )
            });
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

    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#eee' }}>
                    <Image
                        source={require('../assets/field-track.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    <View>
                        <Text style={{ alignSelf: 'center', color: '#888', marginTop: 20 }}>
                            Enter Your Registered Email ID.
                        </Text>
                    </View>
                    <View>
                        <Text style={{ marginLeft: 15, marginTop: 20 }}>
                            Email
                        </Text>
                        <TextInput
                            style={styles.inputText}
                            underlineColorAndroid="transparent"
                            placeholder="Email"
                            placeholderTextColor="#9a73ef"
                            autoCapitalize="none"
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        disabled={this.state.isButtonDisabled}
                        onPress={() => this.sendMail(this.state.email)}
                    >
                        <View style={styles.submitButtonLayout}>
                            <Text style={styles.submitButtonText}> Send Temp Password  </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = ({
    container: {
        flex: 1
    },
    logo: {
        height: 100,
        width: '50%',
        resizeMode: 'contain',
        justifyContent: 'center',
        alignSelf: 'center',
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

ForgotPasswordScreen.navigationOptions = {
    header: null
};

export default ForgotPasswordScreen;
