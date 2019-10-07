import React, { Component } from 'react';
import { Button, Dimensions, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { storeItem } from '../service/AsyncStorageUtil';


const dimensions = Dimensions.get('window');
const images = {
    0: require('../assets/slide1.jpg'),
    1: require('../assets/slide2.jpg'),
    2: require('../assets/slide3.jpg'),
    3: require('../assets/slide4.jpg')
};


const Screen = props => {
    const { navigation, index } = props;
    return (
        <View>
            <ImageBackground source={images[props.index]}
                resizeMode="cover"
                style={{
                    flex: 1,
                    height: dimensions.height,
                    width: dimensions.width
                }}
            />

            {index == 3 ?
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Button title="GET STARTED " onPress={() => {
                        //navigation.replace('AttendanceRecordScreenNew');
                        //navigation.replace('DashboardScreen');
                        navigation.replace('AppDrawerNavigator')
                    }} />
                </View> :
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Button title="Skip " onPress={() => {
                        navigation.replace('AppDrawerNavigator')
                    }} />
                </View>
            }

        </View>
    );
};

class SplashInfoScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation
        };
    }

    componentDidMount() {

        storeItem('SPLASH_INFO_SCREEN_FIRST_TIME', ''+false).then((res) => {
            // this callback is executed when your Promise is resolved
        }).catch((error) => {
            // this callback is executed when your Promise is rejected
            //console.log(`Promise is rejected with error: ${error}`);
            alert('Something went wrong!!!');
        });
    }


    render() {
        return (
            <ScrollView
                style={{ width: '100%' }}
                pagingEnabled
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                horizontal>
                <Screen index={0} navigation={this.state.navigation} />
                <Screen index={1} navigation={this.state.navigation} />
                <Screen index={2} navigation={this.state.navigation} />
                <Screen index={3} navigation={this.state.navigation} />
            </ScrollView>
        );
    }
}

export default SplashInfoScreen;

SplashInfoScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    scrollView: {
        flexDirection: 'row'
    }
});