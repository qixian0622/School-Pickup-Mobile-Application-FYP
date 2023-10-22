import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API, Auth} from 'aws-amplify';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';


const TeachUpdateProfile = () => {
  const navigation = useNavigation();
  const [ID, setID] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [email, setemail] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleCancelButtonClick = () => {
    navigation.navigate('TeachProfile');
  };

  const handleSubmitButtonClick = async () => {
    if (!isFormValid) {
      return;
    }

    try {
      await updateCognitoProfile(); // Update in Cognito first
      await updateProfile(); // If Cognito update done, then only update in dyanmo
      Alert.alert('Update Successful', 'Profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('TeachProfile'), // Navigate to profile page after user clicks 'OK'
        },
      ]);
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Error updating profile.');
    }
  };

  useEffect(() => {
    // if all fields not empty then only enable submit button
    setIsFormValid(name.trim() !== '' && contact.trim() !== '' && address.trim() !== '');
  }, [name, contact, address]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateCognitoProfile = async () => {

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        phone_number: contact,
        
      });
    } catch (err) {
      throw new Error(err.message || 'Error updating Cognito profile');
    }
  };

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setName(user.attributes.name || '');
      setContact(user.attributes.phone_number || '');
      setAddress(user.attributes.address || '');
      setID(user.attributes.sub || '');
      setemail(user.attributes.email || '');
    } catch (error) {
      Alert.alert("Profile Not Found")
    }
  };

  const updateProfile = async () => {
    if (!isFormValid) {
      return;
    }

    const data = {
      body: {
        UserID: ID,
        Address:address,
        Email:email,
        Contact: contact,
        Name: name,
        Role: 'teacher',
        Status: 'Active',
      },
    };
    try {
      const apiData = await API.put('api55db091d', '/teacher/updateprofile', data);
      console.log(apiData);
    } catch (error) {
      throw new Error(error.message || 'Error updating DynamoDB profile');
    }
  };

  return (
    <BackgroundColor>
       <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center",marginTop: 50}}>Form Teacher/Teacher Update Profile</Text>
    <View style={styles.container}>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.textInput}
          value={address}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact:</Text>
        <TextInput
          style={styles.textInput}
          value={contact}
          onChangeText={(text) => setContact(text)}
        />
      </View>

     <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.textInput}
          value={email}
          editable={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Update"
          onPress={handleSubmitButtonClick}
          color="black"
          style={styles.submitbutton}
          disabled={!isFormValid}
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
    marginRight: 20,
  },
});

export default TeachUpdateProfile;
