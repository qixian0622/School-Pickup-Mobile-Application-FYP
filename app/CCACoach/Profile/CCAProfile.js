import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation , useIsFocused} from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { Auth } from 'aws-amplify';
import { Alert } from 'react-native';

const CCAProfile = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [isFocused]);

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setName(user.attributes.name || '');
      setAddress(user.attributes.address || '');
      setEmail(user.attributes.email || '');
      setContact(user.attributes.phone_number || '');
    } catch (error) {
      Alert.alert("Profile Not Found")
    }
  };

  const handlePreviousButtonClick = () => {
    navigation.goBack();
  };

  const handleLogoutButtonClick = () => {
    signOut()
  };

  const handleUpdatePasswordClick = () => {
    navigation.navigate('CCAUpdatePassword'); // Navigate to the UpdatePassword screen
  };

  const handleUpdateProfileClick = () => {
    navigation.navigate('CCAUpdateProfile'); // Navigate to the UpdatePassword screen
  };

  
  return (
    <BackgroundColor>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
            <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userButton}>
            <Ionicons name="person-outline" size={30} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogoutButtonClick}>
            <Ionicons name="log-out-outline" size={30} style={styles.icon} />
          </TouchableOpacity>
        </View>

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
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact:</Text>
          <TextInput
            style={styles.textInput}
            value={contact}
            editable={false}
          />
        </View>

        <View style={styles.updateProfileButton}>
          <Button
            title="Update Profile"
            onPress={handleUpdateProfileClick}
            color="black"
            style={styles.updateButton}
          />
        </View>

        <Button
          title="Update Password"
          onPress={handleUpdatePasswordClick}
          color="black"
          style={styles.updateButton}
        />
      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
  },
  userButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 15,
  },
  icon: {
    color: 'black',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    color:'black',
    fontWeight:'bold',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  updateProfileButton: {
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default CCAProfile;
