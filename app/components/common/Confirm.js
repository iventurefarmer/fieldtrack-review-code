import React from 'react';
import { Modal, Text, View } from 'react-native';
import { CardSection } from './CardSection';
import { Button } from './Button';

const Confirm = ({ children, visible, onAccept, onDecline }) => {
    const { containerStyle, textStyle, cardSectionStyle } = styles;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => {
            }}
        >
            <View style={containerStyle}>
                <CardSection style={{ borderBottomWidth: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 20 }}>
                    <Text style={textStyle}>
                        {children}
                    </Text>
                </CardSection>

                <CardSection style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                    <Button onPress={onAccept}>Yes</Button>
                    <Button onPress={onDecline}>No</Button>
                </CardSection>
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
        color: '#000',
        fontWeight: 'bold'
    },
    containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        paddingStart: 20,
        paddingEnd: 20
    }
};

export { Confirm };