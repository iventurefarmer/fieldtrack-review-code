import React, { Component } from 'react';
import { Image, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { theme } from '../../utilities/color-palette';
import { Icon } from 'native-base';
import { getCustomeQueryData } from '../../service/database';

class ToolbarHeaderMenuBar extends Component {
    state = {
        notificationCount: 0
    };
    _isMounted = false;

    // componentDidUpdate(){
    //     console.log("in");
    // }
    componentDidUpdate() {
        this._isMounted = true;
        getCustomeQueryData('select * from notification where readstatus = "N"')
            .then((response) => {
                if (this._isMounted) {
                    this.setState({ notificationCount: response.length });
                }
            })
            .catch((error) => 0);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        const { viewStyle, headerView, iconView, textStyle } = styles;

        return (
            <View style={headerView}>
                <TouchableOpacity onPress={() => this.props.call()}>
                    <Icon name="menu" type="SimpleLineIcons" style={{ color: '#fff', marginLeft: 10, fontSize: 20 }} />
                </TouchableOpacity>
                <View style={viewStyle}>
                    <Text style={textStyle}>{this.props.headerText}</Text>
                </View>
                {this.props.isVisible ?
                    <View />
                    :
                    <View style={iconView}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.notificationScreen();
                                }}
                            >
                                <View style={{ borderWidth: 1, borderRadius: 50, padding: 5, backgroundColor: '#fff', borderColor: '#fff' }}>
                                    <Icon name="bell" type="FontAwesome" style={{ color: '#fd7433', fontSize: 15 }} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ position: 'absolute', right: -5, top: -5, borderColor: '#ef6519', borderWidth: 1, backgroundColor: '#fff', borderRadius: 50, width: 20, height: 20, alignItems: 'center' }}>
                                <Text style={{ color: '#8d8a89', fontSize: 12 }}>{this.state.notificationCount}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.syncData();
                            }}
                        >
                            <Icon name="sync" type="MaterialIcons" style={{ color: '#fff', marginLeft: 10, marginRight: 10 }} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
};

const styles = {
    headerView: {
        backgroundColor: '#1da1d1',
        alignItems: 'center',
        height: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 6,
        position: 'relative',
        flexDirection: 'row'
    },
    iconView: {
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
export default ToolbarHeaderMenuBar;
