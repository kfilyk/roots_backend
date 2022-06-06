import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
// import LoginOrCreateForm from './common/OLD_LoginOrCreateForm'
import LoginOrCreateForm from './common/LoginOrCreateForm'

const Login = () => {
    return (
      <View style={{ flex: 1 }}>
        <LoginOrCreateForm />
      </View>
    );
}

export default Login