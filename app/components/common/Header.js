import React from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'native-base';

const Header = (props) => {
    const { textStyle, viewStyle } = styles;

    return (
        <ListItem style={viewStyle}>
            <Text style={textStyle}>
                {props.headerText}
            </Text>
        </ListItem>
    );
};

const styles = {
    viewStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        marginLeft: 0,
        marginTop: 10,
        paddingLeft: 10,
        paddingTop: 8,
        paddingBottom: 8
    },
    textStyle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1F7392'
    }
};

export { Header };