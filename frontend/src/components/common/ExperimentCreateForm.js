 // src/components/common/LoginOrCreateForm.js
 import React, { Component } from 'react';
 import { Button, View, Text, TextInput, StyleSheet, Picker } from 'react-native';
 import { Navigate } from 'react-router-dom';
 import DatePicker from "react-datepicker";
 import axios from 'axios';

 //Followed Tutorial: https://userfront.com/guide/toolkit/build-login-form-react.html

 class ExperimentCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        score: '',
        start_date: '',
        end_date: '',
        device_id: '',
        pod1: '', 
        pod10: '',
        pod2: '',
        pod3: '',
        pod4: '',
        pod5: '',
        pod6: '',
        pod7: '',
        pod8: '',
        pod9: '',
        recipe_id: '',
        description: ''
    };

    var plantList = []
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    return e => {
      this.setState({
        [property]: e.target.value
      });
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state)
  }

  // renderCreateForm() {
  //   const { fieldStyle, textInputStyle } = style;
  //   if (this.props.create) {
  //     return (
  //         <View style={fieldStyle}>
  //           <TextInput
  //             placeholder="First name"
  //             autoCorrect={false}
  //             onChangeText={this.handleInputChange}
  //             style={textInputStyle}
  //           />
  //           <TextInput
  //             placeholder="Last name"
  //             autoCorrect={false}
  //             onChangeText={this.handleInputChange}
  //             style={textInputStyle}
  //           />
  //           <Picker
  //             selectedValue={this.pod1}
  //             style={{ height: 50, width: 150 }}
  //             // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
  //           >
  //             <Picker.Item label="plant1" value="basil" />
  //             <Picker.Item label="plant2" value="lettuce" />
  //           </Picker>
  //         </View>
  //     );
  //   }
  // }

  render() {
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
                placeholder="Recipe ID"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleInputChange(this)}
                target="recipe_id"
                style={textInputStyle}
              />
              <TextInput
              placeholder="Last name"
              autoCorrect={false}
              onChangeText={this.handleInputChange(this)}
              style={textInputStyle}
            />
            <Picker
              selectedValue={this.pod1}
              style={{ height: 50, width: 150 }}
              // onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="plant1" value="basil" />
              <Picker.Item label="plant2" value="lettuce" />
            </Picker>
            </View>

            <Button title="Submit" onPress={this.handleSubmit.bind(this)}/>
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

export default ExperimentCreateForm;
