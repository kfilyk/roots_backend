// src/components/common/LoginOrCreateForm.js
import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


class LoginOrCreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    }
  }

  componentDidMount() {
    if (window.localStorage.getItem("token")) {
      console.log("POST")

      // if a token is found, set the authorization and attempt to vlaidate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem('token')}`
      console.log(axios.defaults.headers.common.Authorization)

      axios
        .post("/auth/token/")
        .then(res => {

          if (res.status === 200) {
            console.log("RESPONSE 1: ", res)
            //window.location.href = window.location.toString() + "/home";
            this.setState({ isLoggedIn: true})
          }
        })
        .catch(res => console.log(res));
    }
  };
 
  onUsernameChange(text) {
    this.setState({ username: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  onFirstNameChange(text) {
    this.setState({ firstName: text });
  }

  onLastNameChange(text) {
    this.setState({ lastName: text });
  }

  renderCreateForm() {
    const { fieldStyle, textInputStyle } = style;
    if (this.props.create) {
      return (
          <View style={fieldStyle}>
            <TextInput
              placeholder="First name"
              autoCorrect={false}
              onChangeText={this.onFirstNameChange.bind(this)}
              style={textInputStyle}
            />
            <TextInput
              placeholder="Last name"
              autoCorrect={false}
              onChangeText={this.onLastNameChange.bind(this)}
              style={textInputStyle}
            />
          </View>
      );
    }
  }

  renderButton() {
    const buttonText = this.props.create ? 'Create' : 'Login';

    return (
      <Button title={buttonText} onPress={this.login.bind(this)}/>
    );
  }

  login() {
    const endpoint = this.props.create ? 'register' : 'login';
    const payload = { username: this.state.username, password: this.state.password } 

    if (this.props.create) {
      payload.first_name = this.state.firstName;
      payload.last_name = this.state.lastName;
    }
    axios
      .post(`/auth/${endpoint}/`, payload)

      .then(response => {
        const { token } = response.data;       
        // We set the returned token as the default authorization header
        localStorage.setItem('token', token)
        console.log("TOKEN: " + localStorage.getItem("token"));
        axios.defaults.headers.common.Authorization = token;
        this.setState({ isLoggedIn:true })
      })
      .catch(error => console.log(error));
  }
 
  renderCreateLink() {
    if (!this.props.create) {
      const { accountCreateTextStyle } = style;
      return (
        <Text style={accountCreateTextStyle}>
          Or 
          <Text style={{ color: 'blue' }} onPress={() => <Navigate to = {{ pathname: "/register" }} />}>
            {' Sign-up'}
          </Text>
        </Text>
      );
    }
  }
 
  render() {
    if(this.state.isLoggedIn){
      return <Navigate to = {{ pathname: "/dashboard" }} />;
    }

    const {
      formContainerStyle,
      fieldStyle,
      textInputStyle,
      buttonContainerStyle,
      accountCreateContainerStyle
    } = style;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={formContainerStyle}>
          <View style={fieldStyle}>
            <TextInput
              placeholder="username"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={this.onUsernameChange.bind(this)}
              style={textInputStyle}
            />
          </View>
          <View style={fieldStyle}>
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="password"
              onChangeText={this.onPasswordChange.bind(this)}
              style={textInputStyle}
            />
          </View>
          {this.renderCreateForm()}
        </View>
        <View style={buttonContainerStyle}>
          {this.renderButton()}
          <View style={accountCreateContainerStyle}>
            {this.renderCreateLink()}
          </View>
        </View>
      </View>
    );
  }
}
 
 
const style = StyleSheet.create({
  formContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    flex: 1,
    padding: 15
  },
  fieldStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: 25
  },
  accountCreateTextStyle: {
    color: 'black'
  },
  accountCreateContainerStyle: {
    padding: 25,
    alignItems: 'center'
  }
});

 
export default LoginOrCreateForm;
