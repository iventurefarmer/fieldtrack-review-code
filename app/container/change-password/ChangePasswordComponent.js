/* eslint-disable global-require */
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { Button } from 'native-base';


const ChangePasswordComponent = (props) => {
    const { container, label, button, buttontext, inputtext } = styles;

    return (
        <View style={container}>
            <Text style={label}>Old Password</Text>
            <TextInput 
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                placeholder="Enter Old Password"
                style={inputtext}
                onChangeText={props.onOldPasswordChange.bind(this)}
                secureTextEntry={true}
                autoFocus={true}
            />

            <Text style={label}>New Password</Text>
            <TextInput 
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                placeholder="Enter New Password"
                style={inputtext}
                onChangeText={props.onNewPasswordChange.bind(this)}
                secureTextEntry={true}
            />

            <Text style={label}>Confirm Password</Text>
            <TextInput 
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                placeholder="Confirm Password "
                style={inputtext}
                onChangeText={props.onConfirmPasswordChange.bind(this)}
                secureTextEntry={true}
            />

            <Button
                block
                style={button}
                onPress={props.updatePassword.bind(this)}
            >
                <Text style={buttontext}> Save Changes</Text>
            </Button>
        </View>
    );
};

export default ChangePasswordComponent;
