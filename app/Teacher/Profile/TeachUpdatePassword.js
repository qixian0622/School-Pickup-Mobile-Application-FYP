import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../BackgroundColor';
import { Auth } from 'aws-amplify';

const TeachUpdatePassword = () => {
  const navigation = useNavigation();
  const [currentpassword, setcurrentpassword] = useState('');
  const [newpassword, setnewpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');

  const handleCancelButtonClick = () => {
    navigation.navigate('TeachProfile');
  };

  const handleSubmitButtonClick = () => {
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    updatepassword(currentpassword, newpassword, confirmpassword);
  };

  const isFormValid = () => {
    return (
      currentpassword.trim() !== '' && newpassword.trim() !== '' && confirmpassword.trim() !== ''
    );
  };

  const updatepassword = async (currentpassword, newpassword, confirmpassword) => {
    if (newpassword !== confirmpassword) {
      Alert.alert('Validation Error', 'New password and Confirm password do not match.');
      return;
    }

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, currentpassword, newpassword);
      Alert.alert('Update Successful', 'Password has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('TeachProfile'), // Navigate to profile page after user clicks 'OK'
        },
      ]);
    } catch (err) {
      const errorMessage =
        err.message === 'Incorrect username or password.' ? 'Incorrect existing password.' : err.message;
      Alert.alert('Update Failed', errorMessage || 'Error updating password.');
    }
  };

  return (
    <BackgroundColor>
      <View style={styles.container}>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center",marginTop: 20}}>Form Teacher/Teacher Update Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            onChangeText={(text) => setcurrentpassword(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            onChangeText={(text) => setnewpassword(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password:</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            onChangeText={(text) => setconfirmpassword(text)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Update"
            onPress={handleSubmitButtonClick}
            color="black"
            style={styles.submitbutton}
            disabled={!isFormValid()}
          />
          <Button
            title="Cancel"
            onPress={handleCancelButtonClick}
            color="black"
            style={styles.cancelbutton}
          />
        </View>
      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputContainer: {
    paddingTop:30,   
     marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default TeachUpdatePassword;
