 // src/components/common/LoginOrCreateForm.js

 import React, { Component } from 'react';
 import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
 import { Navigate } from 'react-router-dom';
 import axios from 'axios';
 
 
 class LoginOrCreateForm extends Component {
   state = {
     username: '',
     password: '',
     firstName: '',
     lastName: '',
     token: '',
   }
 
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
       <Button title={buttonText} onPress={this.handleRequest.bind(this)}/>
     );
   }
 
   handleRequest() {
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
         localStorage.setItem('token', token);
         axios.defaults.headers.common.Authorization = `Token ${token}`;
         this.setState({token: token})
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
     const {
       formContainerStyle,
       fieldStyle,
       textInputStyle,
       buttonContainerStyle,
       accountCreateContainerStyle
     } = style;
 
     console.log("TOKEN: ", axios.defaults.headers.common.Authorization)
     if (axios.defaults.headers.common.Authorization != null) {
       console.log("go to dashboard")
       return <Navigate to = {{ pathname: "/" }} />;
     } else {
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