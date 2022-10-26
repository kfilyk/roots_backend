import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import axios from "axios";



/*
OVERALL FILE PURPOSE: The Login/Register Page that users are directed to when they're not yet logged in.
Contains all the logic to register for another account or login.
*/

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

    

    /*
    Input from: window.localStorage.getItem("token")
    Outputs to: LoginOrCreateForm.js/useEffect()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Automatically logs user in if they have the correct token
    */
    function auto_login() {
      if (window.localStorage.getItem("token")) {
        // console.log("POST")
  
        // if a token is found, set the authorization and attempt to vlaidate it against the server
        axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem('token')}`
        // console.log(axios.defaults.headers.common.Authorization)
  
        axios
          .post("/auth/token/")
          .then(res => {
            console.log(res.data.username)
            if (res.data.username && res.status === 200) {
              window.location.replace("/"+res.data.username+"/experiments")
            }
          })
          .catch(res => console.log(res));
      }
    } 
    
    useEffect(() => {
        auto_login();
    }, []);


    /*
    Input from: None
    Outputs to: LoginOrCreateForm.js/return()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Renders button text to say either create account or login depending on state
    */
    function renderButton(){
        const buttonText = form === "register" ? 'Create Account' : 'Login';

        return (
          <Button title={buttonText} onPress={() => login()}/>
        );
    }

    /*
    Input from: None
    Outputs to: LoginOrCreateForm.js/return()
    Created by: Stella T 08/19/2022
    Last Edit: Stella T 08/19/2022
    Purpose: Renders login error message
    */
    function renderLoginError() {
        if (login_error) {
          if (form === "login"){
            return (
              <View >
                <Text>{"login credentials invalid."}</Text>
              </View>
            );
          } else {
            return (
              <View >
                <Text>{"Error during registration process"}</Text>
              </View>
            );
          }

        }
    }

    /*
    Input from: None
    Outputs to: LoginOrCreateForm.js/return()
    Created by: Kelvin F 08/19/2022
    Last Edit: Kelvin F 08/19/2022
    Purpose: Treats keyboard enter as equivalent to clicking login button
    */
    function handleKeyPress(event) {
        if(event.key === 'Enter'){
          login()
        }
    }

    /*
    Input from: None
    Outputs to: LoginOrCreateForm.js/return()
    Created by: Kelvin F 08/19/2022
    Last Edit: Kelvin F 08/19/2022
    Purpose: Sends API call to backend to verify user login credentials
    */
    function login(){
      const payload = { username: username, password: password } 

      if (form) {
        payload.first_name = firstName
        payload.last_name = lastName
      }
      // console.log("PAYLOAD: ", payload)
      axios
        .post(`/auth/${form}/`, payload)
        .then(res => {
          const { token } = res.data;       
          // We set the returned token as the default authorization header
          localStorage.setItem('token', token)
          axios.defaults.headers.common.Authorization = token;
          window.location.replace("/"+username+"/experiments")
          
        })
        .catch(error => {
          if(error.response.status === 409){
            alert("Username already taken.")
          }
          set_login_error(true)
            console.log("Error Logging In: ", error)
        });
    }

    /*
    Input from: None
    Outputs to: LoginOrCreateForm.js/return()
    Created by: Kelvin F 08/19/2022
    Last Edit: Kelvin F 08/19/2022
    Purpose: Renders register input fields
    */
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


    /*
    Input from: None
    Outputs to: LoginOrCreateForm.js/return()
    Created by: Kelvin F 08/19/2022
    Last Edit: Kelvin F 08/19/2022
    Purpose: Returns LoginOrCreateForm page to be rendered 
    */
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
            <Button title={"Switch between Login/Register"} onPress={() => {set_form(form === "login" ? "register" : "login"); set_login_error(false)}}/>
          </View>
        </View>
      );
}


   /*
    Input from: None
    Outputs to: None
    Created by: Kelvin F 08/19/2022
    Last Edit: Kelvin F 08/19/2022
    Purpose: Styling for components on this page
    */
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