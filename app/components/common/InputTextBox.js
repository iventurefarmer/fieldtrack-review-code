import { Dimensions, Text, TextInput, View } from 'react-native';
import React from 'react';

export const InputTextBox = () => {

  const maxLength = 300;
  var textLength = 0;

  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin:10
    }}>
      <View>
        <TextInput style={{
          height: 100,
          width: Dimensions.get('window').width,
          borderColor: 'lightgray',
          borderWidth: 1,
          padding: 3,
          borderRadius: 3,
          fontSize: 13
        }}
                   maxLength={maxLength}
                   placeholder='Enter Your Note'
                   multiline={true}
                   onChangeText={(text) => {
                     textLength = maxLength - text.length;
                   }}
        />
        <Text style={{
          fontSize: 10,
          color: 'lightgrey',
          textAlign: 'right'
        }}>
         {textLength}/{maxLength}
        </Text>
      </View>
    </View>
  );
};