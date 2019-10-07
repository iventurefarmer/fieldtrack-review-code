import React from 'react';
import { Modal, Text, View } from 'react-native';
import { Button } from './Button';
import { CardSection } from './CardSection';
import { Input, Body } from 'native-base';


const InputAlertModal = ({ children, visible, onAccept, onDecline, value, onChangeText }) => {

  const { containerStyle, textStyle, cardSectionStyle } = styles;
  return (
    <Modal
        animationType="slide"
        onRequestClose={() => {
        }}
        transparent
        visible={visible}
    >
        <View style={containerStyle}>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <CardSection style={[cardSectionStyle, { borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <Text style={textStyle}>{children}</Text>
                </CardSection>

                <CardSection style={cardSectionStyle}>
                    <Input 
                        style={{ borderWidth: 1, borderColor: '#050505', borderRadius: 5 }}
                        value={value}
                        onChangeText={onChangeText}
                    />
                </CardSection>

                <CardSection style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <Button onPress={onAccept}>Yes</Button>
                    <Button onPress={onDecline}>No</Button>
                </CardSection>
            </View>
        </View>
    </Modal>
  );
};

const styles = {
    cardSectionStyle: {
        justifyContent: 'center',
        borderBottomWidth: 0
    },
    textStyle: {
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 40,
        color: '#000'
    },

    containerStyle: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        position: 'relative',
        justifyContent: 'center',
        flex: 1
    }
};

export { InputAlertModal };