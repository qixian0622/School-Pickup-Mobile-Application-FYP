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
  const [ClassID, setclassid] = useState('');
  const [ClassID1, setclassid1] = useState('');
  const [role, setRole] = useState('');
  const [contact, setcontact] = useState('');
  const [email, setemail] = useState('');
  const [status, setstatus] = useState('');
  const [name, setname] = useState('');
  const [address, setaddress] = useState('');
  const[teachsubjid,setteachsubjid] = useState('');



  useEffect(() => {
    setID(data.params.ID)
    setRole(data.params.Role1)
    setemail(data.params.Email1)
    setaddress(data.params.Address1)
    setcontact(data.params.Contact1)
    setstatus(data.params.Status1)
    setname(data.params.Name1)
    getClassid(data.params.ID)
  }, []);

  const getClassid = async (TeacherID) => {
    try {
      const apiData = await API.get('api55db091d', '/teacherclass/getclassid', {queryStringParameters:{
        TeacherID:TeacherID
      }});
      var newData = apiData.data[0]?.ClassID
      var newData1 = apiData.data[0]?.ID
      setclassid(newData)
      if(!newData)
      {
        gethighestid()
        console.log(newData1)
        setteachsubjid(newData1)
        console.log(newData)
      }
      else
      {
        console.log(newData1)
        setteachsubjid(newData1)
        console.log(newData)
      }
    } catch (error) {
      console.error(error);
    }
  }


  const handleCancelButtonClick = () => {
    
    navigation.navigate('SAManageProfile');
  };

  const handleSubmitButtonClick = async () => {
    await updateProfile(); 

   if(!ClassID1)
   {
    await updateclassid()
   }
   else
   {
    await addclassid(ClassID1)
   }
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

  const updateclassid = async () => {
    const data = {
      body: {
        ID: teachsubjid,
        ClassID:ClassID,
        TeacherID:ID
      },
    };
    try {
      const apiData = await API.put('api55db091d', '/teacherclass/updateclassid', data);
      console.log(apiData);
    } catch (error) {
      throw new Error(error.message || 'Error updating DynamoDB profile');
    }
  };

  const gethighestid = async () => {
    try {
      const apiData = await API.get('api55db091d', '/teacherclass/gethighestid');
      var newData = apiData.data
      console.log(newData)
      if(newData.length == 0)
      {   
        setclassid1("0")
      }
      else
      {        
        newData.sort((a, b) => (a.ID > b.ID ? -1 : 1))
        setclassid1(newData[0]?.ID)
      }
   
    } catch (error) {
      console.error(error);
    }
  }

  const addclassid = async (ID1) => {
    ID1++
    const data = {
      body: {
        ID: ID1,
        ClassID:ClassID,
        TeacherID:ID
      },
    };
    try {
      const apiData = await API.put('api55db091d', '/teacherclass/updateclassid', data);
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
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>School Admin Update Form Teacher Profile</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Id:</Text>
          <TextInput style={styles.textInput} value={ID}
           editable={false} />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ClassID</Text>
          <TextInput style={styles.textInput} value={ClassID} editable={true}  
           onChangeText={(text) => setclassid(text)}/>

        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role:</Text>
          <View style={styles.pickerstyle}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => handleRoleChange(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Status"/>
            <Picker.Item label="Teacher" value="Teacher" />
            <Picker.Item label="Form Teacher" value="Form Teacher" />
            <Picker.Item label="CCA Teacher" value="CCA Teacher" />
          </Picker>
          </View>
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
