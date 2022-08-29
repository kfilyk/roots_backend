import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import LoginOrCreateForm from './common/LoginOrCreateForm'

/*
OVERALL FILE PURPOSE: 
Renders the login page.
See src/components/common/LoginOrCreateForm.js
*/
const Login = () => {
    return (
      <View style={{ flex: 1 }}>
        <LoginOrCreateForm form={'register'}/>
      </View>
    );
}

export default Login