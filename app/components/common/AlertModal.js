import React from 'react';
import { Modal, Text, View } from 'react-native';
import { Button } from './Button';
import { CardSection } from './CardSection';


const AlertModal = ({ children, visible, onAccept, onDecline }) => {
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
                <CardSection style={cardSectionStyle}>
                    <Text style={textStyle}>{children}</Text>
                </CardSection>

                <CardSection>
                    <Button onPress={onAccept}>Ok</Button>
                {/* <Button onPress={onDecline}>No</Button> */}
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

export { AlertModal };