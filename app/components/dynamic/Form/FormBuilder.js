import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import Textarea from 'react-native-textarea';
import Checkbox from 'react-native-modest-checkbox';
import { _ } from 'lodash';
import { Right, Icon, Picker } from 'native-base';


export const FormBuilder = ({ form, onChangeHandler, openDatePicker, openTimePicker, inputValue, disabledVal }) => {
    const { labelStyle, inputStyle, textareaContainer, textarea, dateStyle, dropDownStyle } = styles;
    return (
        <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10 }}>
            {
                form.map((input, i) => {
                    switch (input.type) {
                        case 'text': 
                            return (
                                <View key={i}>
                                    <Text style={labelStyle} >
                                        {input.label}
                                    </Text>
                                    <TextInput
                                        value={inputValue[input.label]} 
                                        onChangeText={(data) => onChangeHandler(data, input)}
                                        style={inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        editable={!disabledVal}
                                    />
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                      
                        case 'textarea': 
                            return (
                                <View key={i}>
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    <Textarea
                                        value={inputValue[input.label]} 
                                        onChangeText={(data) => onChangeHandler(data, input)}
                                        maxLength={300}
                                        placeholder={'Please type here'}
                                        placeholderTextColor={'#000'}
                                        underlineColorAndroid={'transparent'}
                                        containerStyle={textareaContainer}
                                        style={textarea}
                                        editable={!disabledVal}
                                    />
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                        
                        case 'checkbox': 
                            return (
                                <View key={i}>
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    {
                                      input.items.map((item, itemIndex) => {
                                        return (<View key={itemIndex}>
                                            <Text>{item.label}</Text>
                                            <Checkbox 
                                                key={itemIndex}
                                                checked={(inputValue[input.label] ? inputValue[input.label].indexOf(item) != -1 : false)}
                                                onChange={(checked) => {
                                                    console.log('checkobx', checked);
                                                    if(!disabledVal){
                                                        onChangeHandler(item, input);
                                                    }
                                                }}
                                                label={item}
                                            />
                                          </View>
                                        );
                                      })
                                    }
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label]? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                      
                        case 'dropdown': 
                            // console.log(input.items);
                            return (
                                <View key={i}>
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    <View style={dropDownStyle}>
                                        <Picker
                                            mode="dropdown"
                                            selectedValue={inputValue[input.label]}
                                            onValueChange={(data) => onChangeHandler(data, input)}
                                        >
                                            <Picker.Item label='---- Select ----' value='' />
                                            {input.items.map((item, Pickerindex) => {
                                                return (
                                                    <Picker.Item 
                                                        label={item} 
                                                        value={item} 
                                                        key={Pickerindex} 
                                                    />
                                                );
                                            })}
                                        </Picker>
                                    </View>
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                        case 'radio': 
                            // console.log(inputValue[input.label]);                                            
                            let data = [];
                            input.items.map((item, itemIndex) => {
                                if(inputValue[input.label]){
                                    data[itemIndex] = { label: item, value: input, selected: item === inputValue[input.label].label? true : false};
                                }else{
                                    data[itemIndex] = { label: item, value: input };
                                }
                                
                            });
                            return (
                                <View 
                                    key={i} 
                                    style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}
                                >
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    <RadioGroup 
                                        radioButtons={data} 
                                        style={{ alignSelf: 'flex-start', flex: 0 }}
                                        onValueChange={() => console.log("in")}
                                        onPress={(res) => {
                                            res.map((data1) => {
                                                if (data1.selected) {
                                                    onChangeHandler(data1, input);
                                                }
                                            });
                                        }}
                                    />
                                    {/* <View style={{flex: 1, flexDirection: 'row' }}>
                                        {input.items.map((item, itemIndex) => {
                                            return (
                                                <View 
                                                    key={itemIndex} 
                                                    style={{ flex: 1, flexDirection: 'row' }}
                                                >
                                                    <Text style={{ marginRight: 10 }}>{item}</Text>
                                                    <Radio
                                                        color={"#f0ad4e"}
                                                        selectedColor={"#5cb85c"}
                                                        selected={false}
                                                    />
                                                </View>
                                            )
                                        })}
                                    </View> */}
                                    {/* <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text> */}
                                </View>
                            );
                        case 'date': 
                            return (
                                <View 
                                    key={i} 
                                >
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                            if(!disabledVal){
                                                openDatePicker(input);
                                            }else{
                                                console.log('Not access')
                                            }
                                        }
                                    }>
                                        <View style={dateStyle}>
                                            <Text style={{ fontSize: 16, color: '#000', paddingTop: 5 }}>
                                                {inputValue[input.label] ? inputValue[input.label]: 'Select Date' }
                                            </Text>
                                            <Right>
                                                <Icon name="calendar" type="FontAwesome" style={{ fontSize: 18 }} />
                                            </Right>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                        case 'time': 
                            return (
                                <View 
                                    key={i} 
                                >
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                            if(!disabledVal){
                                                openTimePicker(input);
                                            }else{
                                                console.log('Not access')
                                            }
                                        }
                                    }>
                                        <View style={dateStyle}>
                                            <Text style={{ fontSize: 16, color: '#000', paddingTop: 5 }}> 
                                                {inputValue[input.label] ? inputValue[input.label]:  'Select Time' } 
                                            </Text>
                                            <Right>
                                                <Icon name="calendar" type="FontAwesome" style={{ fontSize: 18 }} />
                                            </Right>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                        case 'number': 
                            return (
                                <View 
                                    key={i} 
                                    style={{ flex: 1 }}
                                >
                                    <Text style={labelStyle}>
                                        {input.label}
                                    </Text>
                                    <TextInput
                                        value={inputValue[input.label]} 
                                        style={inputStyle}
                                        maxLength={10}  //setting limit of input
                                        keyboardType='numeric'
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={(data) => {
                                            onChangeHandler(data, input);
                                        }}
                                        editable={!disabledVal}
                                    />
                                    <Text style={{ color: 'red' }}>{input.mandatory && !inputValue[input.label] ? `${input.label} is mandatory *` : ''}</Text>
                                </View>
                            );
                    }
                })
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textareaContainer: {
        height: 85
    },
    textarea: {
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
    inputStyle: {
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 8,
        // height: 35,
        paddingLeft: 10,
        // fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#fff'
    },
    labelStyle: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10
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
    }
});