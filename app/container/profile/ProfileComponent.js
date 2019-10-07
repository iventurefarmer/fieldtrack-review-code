import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProfileImage } from '../../components/common/ProfileImage';
import React from 'react';
import styles from './styles';

const ProfileComponent = (props) => {
  const { container, label, input, buttonText, button } = styles;
  const { profile_pic, name, company_name, zone, subzone, route, version } = state.userProfile;
  return (
    <View style={container}>

      <ProfileImage placeholder={require('../../assets/user_profile.png')}
                    url={profile_pic}/>

      <Text style={label}>User Name</Text>
      <TextInput
        underlineColorAndroid="transparent"
        placeholderTextColor="black"
        autoCapitalize="none"
        style={input}
        value={name}
        onChangeText={this.handleUname}/>
      <Text style={label}>Company Name</Text>
      <TextInput
        underlineColorAndroid="transparent"
        placeholderTextColor="black"
        autoCapitalize="none"
        style={input}
        value={company_name}
        onChangeText={this.handleCompany}/>
      <Text style={label}>Zone</Text>
      <TextInput
        underlineColorAndroid="transparent"
        placeholderTextColor="black"
        autoCapitalize="none"
        style={input}
        value={zone}
        onChangeText={this.handleZone}/>

      <Text style={label}>Sub Zone</Text>

      <TextInput
        underlineColorAndroid="transparent"
        placeholderTextColor="black"
        autoCapitalize="none"
        style={input}
        value={subzone}
        onChangeText={this.handleSubZone}/>

      <Text style={label}>Route</Text>

      <TextInput
        underlineColorAndroid="transparent"
        placeholderTextColor="black"
        autoCapitalize="none"
        style={input}
        value={route}
        onChangeText={this.handleRoute}/>
      <Text style={label}>Version</Text>

      <TextInput
        underlineColorAndroid="transparent"
        placeholderTextColor="black"
        autoCapitalize="none"
        style={input}
        value={version}
        onChangeText={this.handleVersion}/>

      <TouchableOpacity style={button}
                        onPress={() => {
                          props.call();
                        }}>
        <Text style={buttonText}>Update Profile</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ProfileComponent;