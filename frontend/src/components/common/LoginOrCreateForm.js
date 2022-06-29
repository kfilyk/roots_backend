import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import axios from "axios";

const LoginOrCreateForm = (props) => {
    const [login_error, set_login_error] = useState(false);
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [firstName, set_firstName] = useState('');
    const [lastName, set_lastName] = useState('');
    const [form, set_form] = useState('login')

    const {
        formContainerStyle,
        fieldStyle,
        textInputStyle,
        buttonContainerStyle,
        accountCreateContainerStyle
      } = style;


    function auto_login() {
      if (window.localStorage.getItem("token")) {
        // console.log("POST")
  
        // if a token is found, set the authorization and attempt to vlaidate it against the server
        axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem('token')}`
        // console.log(axios.defaults.headers.common.Authorization)
  
        axios
          .post("/auth/token/")
          .then(res => {
  
            if (res.status === 200) {
              window.location.replace("/dashboard")
            }
          })
          .catch(res => console.log(res));
      }
    } 
    
    useEffect(() => {
        auto_login();
    }, []);


    function renderButton(){
        const buttonText = form === "register" ? 'Create Account' : 'Login';

        return (
          <Button title={buttonText} onPress={() => login()}/>
        );
    }

    function renderLoginError() {
        if (login_error) {
          return (
            <View >
              <Text>{"login credentials invalid."}</Text>
            </View>
          );
        }
    }

    function handleKeyPress(event) {
        if(event.key === 'Enter'){
          login()
        }
    }

    function login(){
      const payload = { username: username, password: password } 

      if (form) {
        payload.first_name = firstName
        payload.last_name = lastName
      }
      // console.log("PAYLOAD: ", payload)
      axios
        .post(`/auth/${form}/`, payload)
        .then(response => {
          const { token } = response.data;       
          // We set the returned token as the default authorization header
          localStorage.setItem('token', token)
          axios.defaults.headers.common.Authorization = token;
          window.location.replace("/dashboard")
        })
        .catch(error => {
          set_login_error(true)
        //   console.log("Error Logging In: ", error)
        });
    }

    function renderRegister(){
      if (form === "register"){
        return (
        <View style={formContainerStyle}>
            <View style={fieldStyle}>
              <TextInput
                placeholder="firstName"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => set_firstName(value)}
                onKeyPress={(key) => handleKeyPress(key)}
                style={textInputStyle}
              />
            </View>
            <View style={fieldStyle}>
              <TextInput
                placeholder="lastName"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => set_lastName(value)}
                onKeyPress={(key) => handleKeyPress(key)}
                style={textInputStyle}
              />
            </View>
        </View>
      )
      } else {
        return ("")
      }
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={formContainerStyle}>
            <View style={fieldStyle}>
              <TextInput
                placeholder="username"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => set_username(value)}
                onKeyPress={(key) => handleKeyPress(key)}
                style={textInputStyle}
              />
            </View>
            <View style={fieldStyle}>
              <TextInput
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="password"
                onChangeText={value => set_password(value)}
                onKeyPress={(key) => handleKeyPress(key)}
                style={textInputStyle}
              />
            </View>
            {renderRegister()}
            {renderLoginError()}
          </View>
          <View style={buttonContainerStyle}>
            {renderButton()}
            <Button title={"Switch between Login/Register"} onPress={() => set_form(form === "login" ? "register" : "login")}/>
          </View>
        </View>
      );
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
  

export default LoginOrCreateForm