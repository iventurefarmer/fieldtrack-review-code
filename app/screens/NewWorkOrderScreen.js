import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, View, Picker, Text, Textarea, Right, Icon, ListItem, Button } from 'native-base';
import { Loader, Button as Button1 } from '../components/common';
import ToolbarHeaderBackMenu from '../components/drawer/ToobarHeaderBackMenu';
import { TextInput, ScrollView, KeyboardAvoidingView, Dimensions, Keyboard } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RadioGroup from 'react-native-radio-buttons-group/lib/RadioButtonsGroup';
import { getCustomerList, saveWorkOrder } from '../service/AddWorkOrder';
import { getData, updateData, syncDataToServer } from '../service/database';
import moment from 'moment';
import MultiSelect from 'react-native-multiple-select';

class NewWorkOrderScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            CustomerData: [],
            CustomerName: '',
            CustomerId: '',
            Address: '',
            CutomerZone: '',
            ContactNo: '',
            email: '',
            dynamicForms: [],
            fromDate: moment(new Date()).format("YYYY-MM-DD"),
            fromDateShow: false,
            fromTime: moment(new Date()).format("HH:mm"),
            fromTimeShow: false,
            toDate: moment(new Date()).format("YYYY-MM-DD"),
            toDateShow: false,
            toTime: moment(new Date().setMinutes((new Date()).getMinutes() + 60)).format("HH:mm"),
            toTimeShow: false,
            userId: '',
            company_id: '',
            RepeatOrderType: '',
            RepeatCount: 0,
            DyanmicForm: [],
            RepeatOrder: 'Do not repeat'
        }
        this.multiSelect;
    }

    componentDidMount() {
        this.getCustomerList();
        this.getDynamicForm();
    }

    getCustomerList() {
        this.setState({ loading: true });
        getData(`table_user`)
            .then((result) => {
                if (result.length > 0) {
                    console.log(result.item(0))
                    getCustomerList(result.item(0).user_id, result.item(0).company_id).then(res => {
                        console.log(res)
                        if (res.data.status == 1) {
                            this.setState({ CustomerData: res.data.result, userId: result.item(0).user_id, company_id: result.item(0).company_id });
                        }
                        this.setState({ loading: false });
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
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    };

    getDynamicForm() {
        getData(`dynamic_forms`)
            .then((result) => {
                console.log(result)
                if (result.length > 0) {
                    let obj = [];
                    console.log(result.item(0));
                    for (let i = 0; i < result.length; i++) {
                        obj.push(result.item(i))
                    }
                    this.setState({ dynamicForms: obj });
                    console.log(this.state.dynamicForms);
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }

    onBackPress() {
        this.props.navigation.goBack(null);
    }

    SelectCustomer(data) {
        console.log(data);
        for (let i = 0; i < this.state.CustomerData.length; i++) {
            if (this.state.CustomerData[i].id == data) {
                let obj = this.state.CustomerData[i];
                this.setState({
                    CustomerId: data,
                    CustomerName: obj.customer_name,
                    Address: obj.customer_add,
                    CutomerZone: obj.zone_id,
                    ContactNo: obj.customer_mobile_no,
                    ContactName: obj.name,
                    email: obj.email
                })
            }
        }
    }

    saveWorkOrder() {
        this.setState({ loading: true })
        if (this.validation(this.state)) {
            saveWorkOrder(this.state).then(res => {
                console.log(res)
                syncDataToServer()
                    .then((result) => {
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
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                    });
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
        if (!data.CustomerId) {
            valid = false;
        } else if (!data.fromDate) {
            valid = false
        } else if (!data.fromTime) {
            valid = false
        } else if (!data.toDate) {
            valid = false
        } else if (!data.toTime) {
            valid = false
        } else if (!data.DyanmicForm) {
            valid = false
        } else if (!data.JobType) {
            valid = false
        }
        return valid;
    }

    onSelectedItemsChange = DyanmicForm => {
        this.setState({ DyanmicForm });
    };

    // scrolldown = () => {
    //     this.refs.scrollView.scrollTo({x: 0, y: 5, animated: true });
    // }

    render() {
        const { labelStyle, inputStyle, textareaContainer, textarea, dropDownStyle, dateStyle } = styles;
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderBackMenu
                    headerText="Add Work Order"
                    call={this.onBackPress.bind(this)}
                    navigation={this.props}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ margin: 10, flex: 1 }} keyboardShouldPersistTaps="handled" ref="scrollView">
                        <View style={{ alignSelf: 'flex-end' }}>
                            <Button small rounded
                                onPress={() => this.props.navigation.navigate('NewCustomerScreen')}
                            >
                                <Text>
                                    Add Customer
                                </Text>
                            </Button>
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Select Customer *
                            </Text>
                            <View style={dropDownStyle}>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.CustomerId}
                                    onValueChange={(data) => this.SelectCustomer(data)}
                                >
                                    <Picker.Item label='---- Select Customer ----' value='' />
                                    {this.state.CustomerData.sort((a, b) => (a.customer_name.toLowerCase() < b.customer_name.toLowerCase()) ? -1 : (a.customer_name.toLowerCase() > b.customer_name.toLowerCase()) ? 1 : 0).map((item, index) => {
                                        return (
                                            <Picker.Item label={item.customer_name} value={item.id} key={index} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Customer Name
                        </Text>
                            <TextInput
                                value={this.state.CustomerName}
                                style={inputStyle}
                                underlineColorAndroid={'transparent'}
                                editable={false}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Address
                        </Text>
                            <Textarea
                                value={this.state.Address}
                                style={textarea}
                                editable={false}
                            />
                        </View>

                        {/* <View>
                            <Text style={labelStyle}>
                                Customer Zone
                        </Text>
                            <TextInput
                                value={this.state.CutomerZone}
                                style={inputStyle}
                                underlineColorAndroid={'transparent'}
                                editable={false}
                            />
                        </View> */}

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
                                value={this.state.ContactName}
                                style={inputStyle}
                                underlineColorAndroid={'transparent'}
                                editable={false}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Phone
                            </Text>
                            <TextInput
                                value={this.state.ContactNo}
                                style={inputStyle}
                                underlineColorAndroid={'transparent'}
                                editable={false}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Email ID
                            </Text>
                            <TextInput
                                value={this.state.email}
                                style={inputStyle}
                                underlineColorAndroid={'transparent'}
                                editable={false}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                From Date *
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({ fromDateShow: true })}>
                                <View style={dateStyle}>
                                    <Text style={{ fontSize: 16, color: '#000', paddingTop: 5 }}>
                                        {this.state.fromDate ? this.state.fromDate : 'From Date'}
                                    </Text>
                                    <Right>
                                        <Icon name="calendar" type="FontAwesome" style={{ fontSize: 18 }} />
                                    </Right>
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.fromDateShow}
                                mode={'date'}
                                minimumDate={new Date()}
                                onConfirm={(date) => {
                                    this.setState({ fromDateShow: false, fromDate: moment(date).format("YYYY-MM-DD") });
                                }}
                                onCancel={() => {
                                    this.setState({ fromDateShow: false });
                                }}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Time *
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({ fromTimeShow: true })}>
                                <View style={dateStyle}>
                                    <Text style={{ fontSize: 16, color: '#000', paddingTop: 5 }}>
                                        {this.state.fromTime ? this.state.fromTime : 'From Time'}
                                    </Text>
                                    <Right>
                                        <Icon name="calendar" type="FontAwesome" style={{ fontSize: 18 }} />
                                    </Right>
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.fromTimeShow}
                                mode={'time'}
                                minuteInterval={10}
                                onConfirm={(date) => {
                                    this.setState({ fromTimeShow: false, fromTime: moment(date).format("HH:mm") });
                                }}
                                onCancel={() => {
                                    this.setState({ fromTimeShow: false });
                                }}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                To Date *
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({ toDateShow: true })}>
                                <View style={dateStyle}>
                                    <Text style={{ fontSize: 16, color: '#000', paddingTop: 5 }}>
                                        {this.state.toDate ? this.state.toDate : 'To Date'}
                                    </Text>
                                    <Right>
                                        <Icon name="calendar" type="FontAwesome" style={{ fontSize: 18 }} />
                                    </Right>
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.toDateShow}
                                mode={'date'}
                                minimumDate={new Date()}
                                onConfirm={(date) => {
                                    this.setState({ toDateShow: false, toDate: moment(date).format("YYYY-MM-DD") });
                                }}
                                onCancel={() => {
                                    this.setState({ toDateShow: false });
                                }}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Time *
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({ toTimeShow: true })}>
                                <View style={dateStyle}>
                                    <Text style={{ fontSize: 16, color: '#000', paddingTop: 5 }}>
                                        {this.state.toTime ? this.state.toTime : 'To Time'}
                                    </Text>
                                    <Right>
                                        <Icon name="calendar" type="FontAwesome" style={{ fontSize: 18 }} />
                                    </Right>
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.toTimeShow}
                                mode={'time'}
                                minuteInterval={30}
                                onConfirm={(date) => {
                                    this.setState({ toTimeShow: false, toTime: moment(date).format("HH:mm") });
                                }}
                                onCancel={() => {
                                    this.setState({ toTimeShow: false });
                                }}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Dyamic form *
                            </Text>
                            <View style={{ flex: 1 }}>
                                <MultiSelect
                                    hideTags
                                    items={this.state.dynamicForms.sort((a, b) => (a.form_name.toLowerCase() < b.form_name.toLowerCase()) ? -1 : (a.form_name.toLowerCase() > b.form_name.toLowerCase()) ? 1 : 0)}
                                    uniqueKey="form_id"
                                    ref={(component) => { this.multiSelect = component }}
                                    onSelectedItemsChange={this.onSelectedItemsChange}
                                    selectedItems={this.state.DyanmicForm}
                                    selectText="Pick Dyamic Form"
                                    searchInputPlaceholderText="Search Dyamic Form..."
                                    onChangeInput={(text) => console.log(text)}
                                    // altFontFamily="ProximaNova-Light"
                                    tagRemoveIconColor="#fd7433"
                                    tagBorderColor="#fd7433"
                                    tagTextColor="#fd7433"
                                    selectedItemTextColor="#fd7433"
                                    selectedItemIconColor="#fd7433"
                                    itemTextColor="#000"
                                    displayKey="form_name"
                                    searchInputStyle={{ color: '#000' }}
                                    submitButtonColor="#fd7433"
                                    submitButtonText="Select"
                                />
                                <View>
                                    {/* {this.multiSelect.getSelectedItemsExt(this.state.DyanmicForm)} */}
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Job type *
                            </Text>
                            <TextInput
                                style={inputStyle}
                                onChangeText={(JobType) => this.setState({ JobType })}
                                underlineColorAndroid={'transparent'}
                            // onFocus={this.scrolldown}
                            />
                        </View>

                        <View>
                            <Text style={labelStyle}>
                                Note
                            </Text>
                            <Textarea
                                onChangeText={(Note) => this.setState({ Note })}
                                style={textarea}
                            />
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                            <Text style={labelStyle}>
                                Repeat Order
                            </Text>
                            <RadioGroup
                                radioButtons={[{ label: 'Do not repeat', value: 'Do not repeat' }, { label: 'Repeat', value: 'Repeat' }]}
                                onPress={(obj) => {
                                    let data = obj.find(e => e.selected == true);
                                    this.setState({ RepeatOrder: data.value })
                                }
                                }
                            />
                        </View>

                        {this.state.RepeatOrder == 'Repeat' ?
                            <View>
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 10, flexDirection: 'row' }}>
                                    <RadioGroup
                                        radioButtons={[{ label: 'Days', value: 'Days' }, { label: 'Weeks', value: 'Weeks' }, { label: 'Months', value: 'Months' }]}
                                        flexDirection='row'
                                        onPress={(obj) => {
                                            let data = obj.find(e => e.selected == true);
                                            this.setState({ RepeatOrderType: data.value })
                                        }
                                        }
                                    />

                                </View>
                                <TextInput
                                    style={inputStyle}
                                    onChangeText={(RepeatCount) => this.setState({ RepeatCount })}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            :
                            <View />
                        }

                        <View style={{ marginTop: 15 }} >
                            <Button1
                                title={'Add Work Order'}
                                onPress={() => this.saveWorkOrder()}
                            >
                                Add Work Order
                            </Button1>
                        </View>
                    </ScrollView>
                </View>
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

export default NewWorkOrderScreen;