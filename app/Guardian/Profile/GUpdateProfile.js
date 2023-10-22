import React, { useState, useLayoutEffect,useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Button,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {API,Auth} from "aws-amplify";
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';


const UpdateProfile = () => {
  
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [ID,setid] = useState("");
  const [email, setemail] = useState('');
  const [childid, setchildid] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);


  const handleCancelButtonClick = () => {
    navigation.navigate('Profile');
  };


  const handleSubmitButtonClick = async () => {

    if (!isFormValid) {
      return;
    }

    try {
      await updatecognitoprofile() // Update in Cognito first
      await updateprofile() // If Cognito update done, then only update in dyanmo
      Alert.alert('Update Successful', 'Profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'), // Navigate to profile page after user clicks 'OK'
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

  useEffect(() => {
    getchildid(ID)
  }, [ID]);



  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setName(user.attributes.name || '');
      setAddress(user.attributes.address || '');
      setemail(user.attributes.email || '')
      setContact(user.attributes.phone_number || '');
      setid(user.attributes.sub || '');
    } catch (error) {
      Alert.alert("Profile Not Found")
    }
  };

  const getchildid = async (ID) => {
    if(ID != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/guardian/getchildid',{queryStringParameters:{
          UserID:ID
        }})
        console.log(apiData)
        var newData = apiData
        setchildid(newData.data[0].ChildID)
      } catch (error) {
        console.error(error);
      }
    }
    }
  

  const updatecognitoprofile = async () => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        const result = await Auth.updateUserAttributes(user, {
          phone_number: contact,
        });
        console.log(result); // SUCCESS
      } catch(err) {
        console.log(err);
      }
}



  const updateprofile = async () => {
      const data = {
        body: {
          UserID: ID,
          Address:address,
          ChildID:childid,
          Email:email,
          Contact:contact,
          GName:name,
          Role:"Guardian",
          Status:"Active"
        }
      };
      try {
        const apiData = await API.put('api55db091d', '/guardian/updateprofile', data);
        updatecognitoprofile()
        console.log(apiData)
      } catch (error) {
        console.error(error.response.data);
      }
  }

  // Use useLayoutEffect to set the options for hiding the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <BackgroundColor>
    <View style={styles.container}>
    <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center",marginTop: 20}}>Guardian Update Profile</Text>
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
          onChangeText={text => setContact(text)}
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
    paddingTop: 20,
  },
  inputContainer: {
    paddingTop:30,

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
    marginTop:20,
    marginBottom: 20,
    marginRight: 20, 
  },

  
});

export default UpdateProfile;
