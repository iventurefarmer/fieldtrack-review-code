import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import ToolbarHeaderBackMenu from '../components/drawer/ToobarHeaderBackMenu';

class MapScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            latitude: 18.5204,
            longitude: 73.8567,
            error: null,
            coords: [],
            endLat: 18.5204,
            endLong: 73.8567
        };
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params);
        const { lat, longi } = this.props.navigation.state.params;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
                if (lat != null && longi != null) {
                    this.setState({
                        endLat: parseFloat(lat),
                        endLong: parseFloat(longi),
                    });
                    let concatLot = lat + "," + longi;
                    let concatLot1 = position.coords.latitude + "," + position.coords.longitude;
                    this.getDirections(concatLot, concatLot1);
                }
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyAg3OTyQsf52bxLsFWN4ZdFRUlxdw7jheo`)
            let respJson = await resp.json();
            console.log(respJson);
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords })
            return coords
        } catch (error) {
            console.log(error);
            alert(error)
            return error
        }
    }

    onBackPress() {
        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <View style={styles.container}>
                <ToolbarHeaderBackMenu
                    headerText="Map View"
                    call={this.onBackPress.bind(this)}
                    navigation={this.props}
                />
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    followUserLocation={true}
                    zoomEnabled={true}
                    minZoomLevel={5}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 1,
                        longitudeDelta: 1,
                    }}
                >
                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={2}
                        strokeColor="red"
                    />
                    <MapView.Marker
                        coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude
                        }}
                        title={"Start"}
                        pinColor={'#33A8FF'}
                        // description={"description"}
                    />
                    <MapView.Marker
                        coordinate={{
                            latitude: this.state.endLat,
                            longitude: this.state.endLong
                        }}
                        title={"End"}
                        // pinColor={'#33A8FF'}
                        // description={"description"}
                    />
                </MapView>
            </View>
        )
    }
};

MapScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        flexDirection: 'column',
        minHeight: 150
    },
    map: {
        flex: 1,
        // height: 400,
        // marginTop: 80
    }
});

export default MapScreen;