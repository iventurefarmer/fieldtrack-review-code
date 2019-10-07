import React from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import loginService from '../../service/LoginService';
import { storeItem } from '../../service/AsyncStorageUtil';
import styles from './styles';
import { LOGIN_CLICKED, LOGIN_FAILED, LOGIN_SUCCESS } from '../../actions/ActionType';

class LoginComponent extends React.Component {

  handleEmail = (text) => {
    //this.setState({ emailText: text });
  };

  handlePassword = (text) => {
    //this.setState({ passwordText: text });
  };

  login = (email, pass) => {

    this.props.dispatch({ type: LOGIN_CLICKED });

    loginService(email, pass).then(res => {
      const response = res.data;
      if (response.action === 'success_login') {
        this.props.dispatch({ type: LOGIN_SUCCESS, payload: response });
        //this.loginSuccess(response);
      } else {
        alert('Something went wrong !!!');
        this.props.dispatch({ type: LOGIN_FAILED });
      }
    }).catch(err => {
      alert('Something went wrong !!!');
      this.props.dispatch({ type: LOGIN_FAILED });
    });
  };

  loginSuccess(response) {
    try {
      storeItem('LOGIN_RESPONSE', JSON.stringify(response)).then((res) => {
        this.props.navigation.replace('SplashInfoScreen');
      }).catch((error) => {
        //console.log(`Promise is rejected with error: ${  error}`);
      });
    } catch (error) {
      this.props.dispatch({ type: LOGIN_FAILED });
    }
  }

  render() {
    const {
      emailText,
      passwordText,
      isButtonDisabled,
      loading,
      loginText
    } = this.state;

    
    const { logo, container, inputText, submitButton, submitButtonLayout, submitButtonText } = styles;

    return (
      <View style={container}>

        <Image
          style={logo}
          source={require('../../assets/field-track.png')}/>

        <TextInput style={inputText}
                   underlineColorAndroid="transparent"
                   placeholder="Email"
                   placeholderTextColor="#9a73ef"
                   autoCapitalize="none"
                   value={emailText}
                   onChangeText={this.handleEmail}/>

        <TextInput style={inputText}
                   underlineColorAndroid="transparent"
                   placeholder="Password"
                   placeholderTextColor="#9a73ef"
                   autoCapitalize="none"
                   value={passwordText}
                   onChangeText={this.handlePassword}/>

        <TouchableOpacity
          style={submitButton}
          disabled={isButtonDisabled}
          onPress={
            () => this.login(emailText, passwordText)
          }>
          <View style={submitButtonLayout}>
            {loading && (
              <ActivityIndicator
                color="#FFF"
                size="small"
              />
            )}
            <Text style={submitButtonText}> {loginText} </Text>
          </View>
        </TouchableOpacity>
      </View>);
  }
}

function mapStateToProps(store) {
  //const { loginState } = storeState;
  return { store };
}

// function mapDispatchToProps(dispatch) {
//   return { actions: bindActionCreators(loginActions, dispatch) };
// }

export default connect(mapStateToProps)(LoginComponent);