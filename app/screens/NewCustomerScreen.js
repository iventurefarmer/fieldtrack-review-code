import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, View, Picker, Text, Textarea, Right, Icon, CheckBox, Body, ListItem } from 'native-base';
import { Loader, Button as Button1 } from '../components/common';
import ToolbarHeaderBackMenu from '../components/drawer/ToobarHeaderBackMenu';
import { TextInput, ScrollView } from 'react-native';
import { saveCustomer, getCountryList, getZoneList } from '../service/NewCustomer';
import { getData, updateData } from '../service/database';
import moment from 'moment';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


class NewCustomerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            CustomerName: '',
            EmailID: '',
            Address: '',
            City: '',
            State: '',
            PostalCode: '',
            Country: 1,
            PrimaryNumber: '',
            BillingAddress: '',
            Name: '',
            Designation: '',
            PersonEmail: '',
            MobileNo: '',
            CustomerNote: '',
            userId: '',
            company_id: '',
            checked: false,
            CountryList: [],
            ZoneList: [],
            showPlacesList: false
        }
    }

    componentDidMount() {
        this.getCustomerList();
    }

    getCustomerList() {
        this.setState({ loading: true });
        getData(`table_user`)
            .then((result) => {
                if (result.length > 0) {
                    console.log(result.item(0));
                    getZoneList(result.item(0).company_id, 1).then(res1 => {
                        console.log(res1)
                        this.setState({ ZoneList: res1.data, loading: false });
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
                    this.setState({ userId: result.item(0).user_id, company_id: result.item(0).company_id, loading: false });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    };

    onBackPress() {
        this.props.navigation.goBack(null);
    }

    saveCustomer() {
        this.setState({ loading: true })
        if (this.validation(this.state)) {
            saveCustomer(this.state).then(res => {
                console.log(res)
                Alert.alert(
                    'Alert !!!',
                    res.data.message,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({ loading: false });
                                this.props.navigation.goBack(null);
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
        if (!data.CustomerName) {
            valid = false;
        } else if (!data.EmailID) {
            valid = false
        } else if (!data.Address) {
            valid = false
        }
        // else if (!data.City) {
        //     valid = false
        // } else if (!data.State) {
        //     valid = false
        // } else if (!data.PostalCode) {
        //     valid = false
        // } 
        else if (!data.PrimaryNumber) {
            valid = false
        }
        // else if (!data.BillingAddress) {
        //     valid = false
        // }
        return valid;
    }

    addressSelect(data) {
        this.setState({ City: '', State: '', PostalCode: '' });
        for (let i = 0; i < data.length; i++) {
            if (data[i].types[0] == "administrative_area_level_2") {
                this.setState({ City: data[i].long_name });
            }
            if (data[i].types[0] == "administrative_area_level_1") {
                this.setState({ State: data[i].long_name });
            }
            if (data[i].types[0] == "postal_code") {
                this.setState({ PostalCode: data[i].long_name });
            }
        }
    }

    render() {
        const { labelStyle, inputStyle, textareaContainer, textarea, dropDownStyle, dateStyle } = styles;
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderBackMenu
                    headerText="Add Customer"
                    call={this.onBackPress.bind(this)}
                    navigation={this.props}
                />
                <ScrollView style={{ margin: 10 }}>
                    <View>
                        <Text style={labelStyle}>
                            Customer Name *
                        </Text>
                        <TextInput
                            value={this.state.CustomerName}
                            onChangeText={(CustomerName) => this.setState({ CustomerName })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Email ID *
                        </Text>
                        <TextInput
                            value={this.state.EmailID}
                            onChangeText={(EmailID) => this.setState({ EmailID })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Address *
                        </Text>
                        {/* <Textarea
                            value={this.state.Address}
                            onChangeText={(Address) => this.setState({ Address })}
                            style={textarea}
                        /> */}
                        <GooglePlacesAutocomplete
                            placeholder='Enter Location'
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'default'}
                            keyboardAppearance={'light'}
                            listViewDisplayed='auto'
                            fetchDetails={true}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyAg3OTyQsf52bxLsFWN4ZdFRUlxdw7jheo',
                                language: 'en', // language of the results
                                // types: '(cities)' // default: 'geocode'
                                // types : [ "locality", "political", "geocode" ]
                            }}
                            styles={{
                                textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0
                                },
                                textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    color: '#5d5d5d',
                                    fontSize: 16
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },
                            }}
                            currentLocation={false}
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                console.log(data);
                                console.log(details);
                                this.setState({ Address: data.description, showPlacesList: false })
                                this.addressSelect(details.address_components);
                            }}
                            listViewDisplayed={this.state.showPlacesList}
                            textInputProps={{
                                onFocus: () => this.setState({ showPlacesList: true })
                            }}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            City *
                        </Text>
                        <TextInput
                            value={this.state.City}
                            onChangeText={(City) => this.setState({ City })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            State *
                        </Text>
                        <TextInput
                            value={this.state.State}
                            onChangeText={(State) => this.setState({ State })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Select Zone *
                            </Text>
                        <View style={dropDownStyle}>
                            <Picker
                                mode="dropdown"
                                selectedValue={this.state.Zone}
                                onValueChange={(Zone) => this.setState({ Zone })}
                            >
                                <Picker.Item label='---- Select Zone ----' value='' />
                                {this.state.ZoneList.sort((a, b) => (a.zone_name.toLowerCase() < b.zone_name.toLowerCase()) ? -1 : (a.zone_name.toLowerCase() > b.zone_name.toLowerCase()) ? 1 : 0).map((item, index) => {
                                    return (
                                        <Picker.Item label={item.zone_name} value={item.id} key={index} />
                                    )
                                })}
                            </Picker>
                        </View>
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Postal Code *
                        </Text>
                        <TextInput
                            value={this.state.PostalCode}
                            onChangeText={(PostalCode) => this.setState({ PostalCode })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                        />
                    </View>

                    {/* <View>
                        <Text style={labelStyle}>
                            Country
                        </Text>
                        <View style={dropDownStyle}>
                            <Picker
                                mode="dropdown"
                                selectedValue={this.state.Country}
                                onValueChange={(Country) => this.setState({ Country })}
                            >
                                <Picker.Item label='---- Select Country ----' value='' />
                                {this.state.CountryList.sort((a, b) => (a.country_name.toLowerCase() < b.country_name.toLowerCase()) ? -1 : (a.country_name.toLowerCase() > b.country_name.toLowerCase()) ? 1 : 0).map((item, index) => {
                                    return (
                                        <Picker.Item label={item.country_name} value={item.id} key={index} />
                                    )
                                })}
                            </Picker>
                        </View>
                    </View> */}

                    <View>
                        <Text style={labelStyle}>
                            Primary Number *
                        </Text>
                        <TextInput
                            value={this.state.PrimaryNumber}
                            onChangeText={(PrimaryNumber) => this.setState({ PrimaryNumber })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                        />
                    </View>

                    <View>
                        <Text style={{ color: '#fd7433', fontSize: 15, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>
                            Contact Details
                        </Text>
                    </View>


                    <View>
                        <Text style={labelStyle}>
                            Name
                        </Text>
                        <TextInput
                            value={this.state.Name}
                            onChangeText={(Name) => this.setState({ Name })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Designation
                        </Text>
                        <TextInput
                            value={this.state.Designation}
                            onChangeText={(Designation) => this.setState({ Designation })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Email Id
                        </Text>
                        <TextInput
                            value={this.state.PersonEmail}
                            onChangeText={(PersonEmail) => this.setState({ PersonEmail })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Mobile No
                        </Text>
                        <TextInput
                            value={this.state.MobileNo}
                            onChangeText={(MobileNo) => this.setState({ MobileNo })}
                            style={inputStyle}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'numeric'}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Customer Note
                        </Text>
                        <Textarea
                            value={this.state.CustomerNote}
                            onChangeText={(CustomerNote) => this.setState({ CustomerNote })}
                            style={textarea}
                        />
                    </View>

                    <View>
                        <ListItem>
                            <CheckBox
                                checked={this.state.checked}
                                onPress={() => {
                                    if (!this.state.checked) {
                                        if (this.state.Address !== '') {
                                            this.setState({ checked: true, BillingAddress: this.state.Address });
                                        } else {
                                            alert('Please fill address field')
                                        }
                                    } else {
                                        this.setState({ checked: false, BillingAddress: '' });
                                    }
                                }}
                            />
                            <Body>
                                <Text>
                                    Billing Address Same As Customer Address
                                </Text>
                            </Body>
                        </ListItem>

                    </View>

                    <View>
                        <Text style={labelStyle}>
                            Billing Address *
                        </Text>
                        <Textarea
                            value={this.state.BillingAddress}
                            onChangeText={(BillingAddress) => this.setState({ BillingAddress })}
                            style={textarea}
                        />
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Button1
                            title={'Save'}
                            onPress={() => this.saveCustomer()}
                        >
                            Save
                    </Button1>
                    </View>

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        flexDirection: 'column'
    },
    labelStyle: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10
    }, inputStyle: {
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 8,
        // height: 35,
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        backgroundColor: '#fff'
    }, textarea: {
        textAlignVertical: 'top',  // hack android
        height: 55,
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 8,
        paddingLeft: 10,
        backgroundColor: '#fff'
    },
    dropDownStyle: {
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 8,
        // height: 35,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        width: undefined
    },
    dateStyle: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#bbb',
        flex: 1,
        flexDirection: 'row',
        height: 35,
        paddingLeft: 10,
        paddingRight: 10
    }
});

export default NewCustomerScreen;