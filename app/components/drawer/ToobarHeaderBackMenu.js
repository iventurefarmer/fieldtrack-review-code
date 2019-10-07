import React from 'react';
import { Image, Text, TouchableNativeFeedback, View, TouchableOpacity } from 'react-native';
import { theme } from '../../utilities/color-palette';
import { Icon } from 'native-base';

const ToolbarHeaderBackMenu = (props) => {
    const { viewStyle, headerView, textStyle } = styles;
    return (
        <View style={headerView}>
            <TouchableOpacity onPress={() => props.call()}>
                <Icon name="arrow-left" type="FontAwesome" style={{ color: '#fff', marginLeft: 10, fontSize: 22 }} />
            </TouchableOpacity>
            <View style={viewStyle}>
                <Text style={textStyle}>{props.headerText}</Text>
            </View>
        </View>
    );
};

const styles = {
    headerView: {
        backgroundColor: theme.primary.bgNormal,
        alignItems: 'center',
        height: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 6,
        position: 'relative',
        flexDirection: 'row'
    },
    viewStyle: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 20
    },
    textStyle: {
        fontSize: 18,
        color: '#000'
    }
};
export default ToolbarHeaderBackMenu;
