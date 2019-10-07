import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card, Input, Item, Label, Button, Icon } from 'native-base';
import { InputTextBox } from '../../components/common/InputTextBox';


export const NoteComponent = (props) => {
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1, marginTop: 10 }}>
            {props.priviousMessage.map((item, index) => {
                return (
                    <View style={{ alignSelf: 'flex-end', backgroundColor: '#7CDC8C', padding: 10 , borderRadius: 10, margin: 5, paddingLeft: 20, paddingRight: 20 }} key={index}>
                        <Text style={{ alignSelf: 'center' }}>{item.description}</Text>
                    </View>
                )
            })}
            
            <View style={{ flex:1, flexDirection: 'row', margin: 10, borderRadius: 20, borderWidth: 2, position: 'absolute', bottom: 0, borderColor: '#ddd' }}>
                <Input
                    value={props.notes} 
                    onChangeText={(note) => props.onValueChange(note)}
                />
                <Button transparent onPress={props.sendMessage()}>
                    <Icon style={{ color: '#ff6600', fontSize: 30 }} name='send' />
                </Button>
            </View>
        </View>
    );
};

