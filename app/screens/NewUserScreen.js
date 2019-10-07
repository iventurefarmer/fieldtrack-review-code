import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { View, Picker, Text } from 'native-base';
import { Loader, Button as Button1 } from '../components/common';
import { TextInput } from 'react-native';
import { getIndustryList, saveNewUser } from '../service/NewUserService';
import { theme } from '../utilities/color-palette';
import { ScrollView } from 'react-native-gesture-handler';


class NewUserScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isButtonDisabled: false,
            email: '',
            companyName: '',
            phone: '',
            Industry: '',
            IndustryList: []
        }
    }

    componentDidMount() {
        this.getCustomerList();
    }

    getCustomerList() {
        this.setState({ loading: true });
        getIndustryList()
            .then((result) => {
                console.log(result);
                this.setState({ loading: false, IndustryList: result.data.result });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    };

    saveUser() {
        this.setState({ loading: true })
        if (this.validation(this.state)) {
            saveNewUser(this.state).then(res => {
                console.log(res)
                Alert.alert(
                    'Alert !!!',
                    'Please check your mail for a temporary password.',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ loading: false });
                                this.props.navigation.goBack()
                            }
                        },
                    ],
                    { cancelable: false }
                )
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
        } else {
            Alert.alert(
                'Alert !!!',
                'Please fill mandtory fields',
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
    }

    validation(data) {
        let valid = true;
        if (!data.email) {
            valid = false;
        } else if (!data.companyName) {
            valid = false
        } else if (!data.Industry) {
            valid = false
        }
        return valid;
    }

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
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <ScrollView>
                        <View>
                            <Text style={{ alignSelf: 'center', color: '#888', marginTop: 20 }}>
                                Lets get you up and running.
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
                        <View>
                            <Text style={{ marginLeft: 15 }}>
                                Company Name
                        </Text>
                            <TextInput
                                style={styles.inputText}
                                underlineColorAndroid="transparent"
                                placeholder="Company Name"
                                placeholderTextColor="#9a73ef"
                                autoCapitalize="none"
                                value={this.state.companyName}
                                onChangeText={(companyName) => this.setState({ companyName })}
                            />
                        </View>
                        <View>
                            <Text style={{ marginLeft: 15 }}>
                                Industry
                        </Text>
                            <View style={styles.dropdown}>
                                <Picker
                                    mode="dropdown"
                                    style={{ paddingLeft: 0 }}
                                    selectedValue={this.state.Industry}
                                    onValueChange={(Industry) => this.setState({ Industry })}
                                >
                                    <Picker.Item label='---- Select Industry ----' value=''
                                        color='#9a73ef'
                                    />
                                    {this.state.IndustryList.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0).map((item, index) => {
                                        return (
                                            <Picker.Item label={item.name} value={item.id} key={index} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View>
                            <Text style={{ marginLeft: 15 }}>
                                Phone
                        </Text>
                            <TextInput
                                style={styles.inputText}
                                underlineColorAndroid="transparent"
                                placeholder="Phone"
                                placeholderTextColor="#9a73ef"
                                autoCapitalize="none"
                                keyboardType={'numeric'}
                                value={this.state.phone}
                                onChangeText={(phone) => this.setState({ phone })}
                            />
                        </View>


                        <TouchableOpacity
                            style={styles.submitButton}
                            disabled={this.state.isButtonDisabled}
                            onPress={() => this.saveUser()}
                        >
                            <View style={styles.submitButtonLayout}>
                                <Text style={styles.submitButtonText}> Start Using It for Free  </Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    dropdown: {
        margin: 15,
        // height: 40,
        borderColor: theme.primary.bgNormal,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 0
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

export default NewUserScreen;