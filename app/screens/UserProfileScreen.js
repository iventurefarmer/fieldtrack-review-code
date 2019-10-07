/* eslint-disable global-require */
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { DrawerActions } from 'react-navigation';
import ToolbarHeaderMenuBar from '../components/drawer/ToolbarHeaderMenuBar';
import { updateUserProfile } from '../service/UserProfileService';
import { ProfileImage } from '../components/common/ProfileImage';
import ImagePicker from 'react-native-image-picker';
import { Loader } from '../components/common';
import { Button } from 'native-base';
import { getData, updateData } from '../service/database';
import VersionNumber from 'react-native-version-number';

class UserProfileScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // userProfile: {
            name: '',
            company_name: '',
            zone: '',
            subzone: '',
            route: '',
            version: '',
            profilepic: '',
            newProfilePicData: '',
            profileUpdate: false,
            loading: false
            // }
        };
    }

    componentDidMount() {
        this.checkUserProfile();
    }

    checkUserProfile() {
        this.setState({ loading: true });
        getData(`table_user LEFT JOIN company_profile ON table_user.company_id = company_profile.companyid`)
            .then((result) => {
                if (result.length > 0) {
                    console.log(result.item(0))
                    this.setState({
                        user_id: result.item(0).user_id,
                        name: result.item(0).user_name,
                        company_name: result.item(0).company,
                        email_id: result.item(0).email_id,
                        mobile_number: result.item(0).mobile_number,
                        zone: result.item(0).zone_id,
                        subzone: result.item(0).subzone_id,
                        route: result.item(0).route_id,
                        version: VersionNumber.appVersion,
                        profilepic: result.item(0).profile_pic,
                        newProfilePicData: result.item(0).profile_pic,
                        loading: false
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    }

    updateProfile() {
        this.setState({ loading: true });
        updateUserProfile(this.state.user_id, this.state.newProfilePicData).then(res => {
            updateData(`UPDATE table_user SET profile_pic='${this.state.newProfilePicData}', modify='1', push_flag='1' WHERE user_id=${this.state.user_id}`)
                .then((res2) => {
                    this.setState({ loading: false });
                    this.props.navigation.replace('AppDrawerNavigator')
                })
                .catch((error) => {
                    this.setState({ loading: false });
                })
        }).catch(err => {
            Alert.alert(
                'Alert !!!',
                'Something went wrong !!!',
                [
                    { text: 'OK', onPress: () => {
                        this.setState({ loading: false });
                    } 
                },
                ],
                { cancelable: false }
            )
        });
    };

    openHomeDrawer() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    openGallery() {
        // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
            title: 'Select Images',
            quality: 1,
            maxWidth: 250,
            maxHeight: 250,
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {


            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                //console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    // userProfile: {
                    profilepic: response.uri,
                    newProfilePicData: response.data,
                    profileUpdate: true
                    // }
                });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderMenuBar
                    headerText="User Profile"
                    call={this.openHomeDrawer.bind(this)}
                    navigation={this.props}
                    isVisible='false'
                />

                <ProfileImage
                    placeholder={require('../assets/user_profile.png')}
                    editOption={true}
                    openGallery={this.openGallery.bind(this)}
                    url={this.state.newProfilePicData}
                />

                <ScrollView>
                    <Text style={styles.label}>User Name</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        editable={false}
                        value={this.state.name}
                    />
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.company_name}
                        editable={false}
                    />

                    <Text style={styles.label}>Email Id</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.email_id}
                        editable={false}
                    />

                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.mobile_number}
                        editable={false}
                    />
                    <Text style={styles.label}>Zone</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.zone}
                        editable={false}
                    />

                    <Text style={styles.label}>Sub Zone</Text>

                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.subzone}
                        editable={false}
                    />

                    <Text style={styles.label}>Route</Text>

                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.route}
                        editable={false}
                    />
                    <Text style={styles.label}>Version</Text>

                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="black"
                        autoCapitalize="none"
                        style={styles.input}
                        value={this.state.version}
                        editable={false}
                    />

                    <Button
                        style={styles.button}
                        onPress={() => this.updateProfile()}
                    >
                        <Text>Update Profile</Text>
                    </Button>
                </ScrollView>
            </View>
        );
    }
}

UserProfileScreen.navigationOptions = {
    title: 'User Profile'
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    label: {
        color: '#ffad33',
        marginLeft: 15,
        marginTop: 10,
        fontSize: 12
    },
    input: {
        marginTop: -10,
        marginLeft: 12,
        marginRight: 10,
        borderBottomColor: 'black',
        borderWidth: 0.5,
        color: 'black',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent'
    },
    button: {
        backgroundColor: '#3973ac',
        borderRadius: 5,
        marginBottom: 30,
        marginTop: 20,
        alignSelf: 'center',
        padding: 20
    }
});

export default UserProfileScreen;
