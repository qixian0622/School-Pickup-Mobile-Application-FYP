import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Button,Alert, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { API} from 'aws-amplify';


const SAUpdateTeacherProfile = () => {
  const navigation = useNavigation();
  const data = useRoute()
  const [ID, setID] = useState('');
  const [role, setRole] = useState('');
  const [contact, setcontact] = useState('');
  const [email, setemail] = useState('');
  const [status, setstatus] = useState('');
  const [name, setname] = useState('');
  const [address, setaddress] = useState('');



  useEffect(() => {
    setID(data.params.ID)
    setRole(data.params.Role1)
    setemail(data.params.Email1)
    setcontact(data.params.Contact1)
    setstatus(data.params.Status1)
    setname(data.params.Name1)
    setaddress(data.params.Address1)
  }, []);


  const handleCancelButtonClick = () => {
    
    navigation.navigate('SAManageProfile');
  };

  const handleSubmitButtonClick = async () => {
    await updateProfile();
    try {
      Alert.alert('Update Successful', 'Profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('SAManageProfile',{message:"Success"}), // Navigate to profile page after user clicks 'OK'
        },
      ]);
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Error updating profile.');
    }
  };

  const updateProfile = async () => {

    const data = {
      body: {
        UserID: ID,
        Address:address,
        Contact: contact,
        Email:email,
        Name: name,
        Role: role,
        Status: status,
      },
    };
    try {
      const apiData = await API.put('api55db091d', '/teacher/updateprofile', data);
      console.log(apiData);
    } catch (error) {
      throw new Error(error.message || 'Error updating DynamoDB profile');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

 

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleStatusChange = (value) => {
    setstatus(value);
  };

  return (
    <BackgroundColor>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

      <View style={styles.container}>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>School Admin Update Teacher Profile</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Id:</Text>
          <TextInput style={styles.textInput} value={ID}
           editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role:</Text>
          <View style={styles.pickerstyle}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => handleRoleChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Teacher" value="Teacher" />
            <Picker.Item label="Form Teacher" value="Form Teacher" />
            <Picker.Item label="CCA Teacher" value="CCA Teacher" />
          </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.textInput}
            value={address}
            editable={true}
            onChangeText={(text) => setaddress(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact:</Text>
          <TextInput
            style={styles.textInput}
            value={contact}
            editable={true}
            onChangeText={(text) => setcontact(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            editable={true}
            onChangeText={(text) => setemail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            editable={true}
            onChangeText={(text) => setname(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status:</Text>
          <View style={styles.pickerstyle}>

          <Picker
            selectedValue={status}
            onValueChange={(value) => handleStatusChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Status"/>
            <Picker.Item label="Active" value="Active" />
            <Picker.Item label="Suspend" value="Suspend" />
          </Picker>
          </View>
        </View>
        

        <View style={styles.buttonContainer}>
          <Button
            title="Update"
            onPress={handleSubmitButtonClick}
            color="black"
          />
          <Button
            title="Cancel"
            onPress={handleCancelButtonClick}
            color="black"
          />
        </View>
      </View>
      </ScrollView>

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
  picker: {

  },
  pickerstyle:{
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    

  },
  scrollViewContent: {
    flexGrow: 1, 
  },
});

export default SAUpdateTeacherProfile;
