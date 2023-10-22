import React, { useState } from 'react';
import { Alert, View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { Picker } from '@react-native-picker/picker';
import { Auth, API } from 'aws-amplify';


const InputField = ({ label, value, onChangeText, placeholder = '', isSecure = false }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={isSecure}
      />
    </View>
  );
};

const SARegisterProfile = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState('teacher');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianUsername, setGuardianUsername] = useState('');

  const [guardianAddress, setGuardianAddress] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [childName, setChildName] = useState('');
  const [childUsername, setChildUsername] = useState('');

  const [childAddress, setChildAddress] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childContact, setChildContact] = useState('');
  const [childClassID, setChildClassID] = useState('');
  const [teacherClassID, setTeacherClassID] = useState('');
  const [teacherRole, setTeacherRole] = useState('Teacher');
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    if (role === 'teacher') {
      return name.trim() !== '' &&  username.trim() && address.trim() !== '' && email.trim() !== '' && contact.trim() !== '';
    } else if (role === 'guardian') {
      return (
        guardianName.trim() !== '' &&
        guardianUsername.trim() !== '' &&
        guardianAddress.trim() !== '' &&
        guardianEmail.trim() !== '' &&
        guardianContact.trim() !== '' &&
        childName.trim() !== '' &&
        childUsername.trim() !== '' &&
        childAddress.trim() !== '' &&
        childEmail.trim() !== '' &&
        childContact.trim() !== '' &&
        childClassID.trim() !== ''
      );
    }
    return false;
  };

 


  const isValidPhoneNumber = (phoneNumber) => {
    // Phone number must start with '+65' and be at least 8 digits
    return /^\+65\d{8,}$/.test(phoneNumber);
  };
  
  const isValidEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      return false;
    }
    else {
      return true;
    }
  };
  
  //check if username existed in cognito
  async function checkUsernameExists(username) {
    try {
      
      await Auth.signIn(username, 'dummyPassword');
  
      return true;
    } catch (error) {
      // If the username doesn't exist
      if (error.code === 'UserNotFoundException') {
        return false;
      }

      if (error.code === 'UserNotConfirmedException') {
        return true;
      }

      if (error.code === 'NotAuthorizedException') {
        return true;
      }

  
      console.error('Error checking username:', error);
      throw error;
    }
  }

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleTeacherRoleChange = (value) => {
    setTeacherRole(value);
  };

  const clearFields = () => {
    setRole('teacher');
    setName('');
    setAddress('');
    setEmail('');
    setContact('');
    setGuardianName('');
    setGuardianAddress('');
    setGuardianEmail('');
    setGuardianContact('');
    setChildName('');
    setChildAddress('');
    setChildEmail('');
    setChildContact('');
    setChildClassID('');
    setTeacherClassID('');
    setTeacherRole('normal');
  };

  const createTeacherCognito = async () => {
    try {
      // Create teacher in Cognito
      const teacherCognitoData = {
        name,
        email,
        address,
        phone_number: contact,
        profile: teacherRole,
      };
      const teacherUser = await Auth.signUp({
        username: name.replace(/\s/g, '').toLowerCase(),
        password: 'Testing35#',
        attributes: teacherCognitoData,
      });

      return teacherUser.userSub; // Return the teacher Cognito ID
    } catch (error) {
      const errorMessage = error.message || 'An error occurred.';
      Alert.alert('Error', `Teacher's ${errorMessage}`);
      throw error;
    }
  };

  const createTeacherDynamoDB = async (teacherId) => {
    try {
      // Create teacher data in DynamoDB
      const data = {
        body: {
          UserID: teacherId,
          Name: name,
          Contact: contact,
          Role: teacherRole,
          Status: 'Active',
          Email: email
        },
      };

      const apiData = await API.post('api55db091d', '/teacher/adddata', data);
      console.log(apiData);

      return true; 
    } catch (error) {
      const errorMessage = (error.response && error.response.data) ? Object.values(error.response.data).join('\n') : 'An error occurred.';
      Alert.alert('Error', `Teacher's ${errorMessage}`);
    }
  };

  const addGuardian = async (data) => {
    try {
      const apiData = await API.post('api55db091d', '/guardian/addRecord', data);
      console.log({ apiData });
      return apiData;
    } catch (error) {
      //console.error(error.response.data);
      throw error;
    }
  };

  const addChild = async (data) => {
    try {
      const apiData = await API.post('api55db091d', '/child/addRecord', data);
      console.log({ apiData });
      return apiData;
    } catch (error) {
      //console.error(error.response.data);
      throw error;
    }
  };

  const createGuardianChild = async () => {
    try {
      //  Create the guardian in Cognito
      const guardianCognitoData = {
        name: guardianName,
        email: guardianEmail,
        phone_number: guardianContact,
        address: guardianAddress,
        profile: 'Guardian',
      };
      const guardianUser = await Auth.signUp({
        username: guardianUsername,
        password: 'Testing35#',
        attributes: guardianCognitoData,
      });

      // Use the guardian Cognito ID for creating the child in Cognito
      const guardianCognitoId = guardianUser.userSub;

      //  Create the child in Cognito
      const childCognitoData = {
        name: childName,
        email: childEmail,
        phone_number: childContact,
        address: guardianAddress,
        profile: 'Student',
      };
      const childUser = await Auth.signUp({
        username: childUsername,
        password: 'Testing35#',
        attributes: childCognitoData,
      });

      // Use the child Cognito ID for creating the child's record in DynamoDB
      const childCognitoId = childUser.userSub;

      //  Create the child's record in DynamoDB child table using guardian Cognito ID
      const childData = {
        UserID: childCognitoId,
        GuardianID: guardianCognitoId, 
        ClassID: childClassID,
        CName: childName,
        Address: childAddress,
        Email: childEmail,
        Contact: childContact,
        Status: 'Active',
        Role: 'Child',
      };
      await addChild({ body: childData });

      //  Create the guardian's record in DynamoDB guardian table using child Cognito ID
      const guardianData = {
        UserID: guardianCognitoId,
        ChildID: childCognitoId, // Use the child Cognito ID here
        GName: guardianName,
        Address: guardianAddress,
        Email: guardianEmail,
        Contact: guardianContact,
        Status: 'Active',
        Role: 'Guardian',

      };
      await addGuardian({ body: guardianData });

      return true; // Return true to indicate success
    } catch (error) {
      let errorMessage = 'An error occurred.';
      if (error.code) {
        // Cognito error
        errorMessage = `Guardian's ${error.message || errorMessage}`;
      } else if (error.response && error.response.data) {
        // DynamoDB error
        errorMessage = `Guardian's ${Object.values(error.response.data).join('\n')}`;
      }
      Alert.alert('Error', errorMessage);
      throw error;
    }
  };

  const SARegisterSubmitButtonClick = async () => {
    try {
      if (loading) return; 

      if (!isFormValid()) {
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      if (role === 'teacher') {

        
        if (await checkUsernameExists(username)) {
          Alert.alert('Validation Error', 'Username existed! Please use a different username.');
          return;
        }


        if (!isValidEmail(email)) {
          Alert.alert('Validation Error', 'Please enter a valid email.');
          return;
        }

        if (!isValidPhoneNumber(contact)) {
          Alert.alert('Validation Error', 'Please enter a valid phone number (e.g., +6512345678).');
          return;
        }
      }

      if (role === 'guardian') {

        if (await checkUsernameExists(guardianUsername)) {
          Alert.alert('Validation Error', 'Guardian Username existed! Please use a different username.');
          return;
        }


        if (!isValidEmail(guardianEmail)) {
          Alert.alert('Validation Error', 'Please enter a valid guardian email.');
          return;
        }

        if (!isValidPhoneNumber(guardianContact)) {
          Alert.alert('Validation Error', 'Please enter a valid guardian phone number (e.g., +6512345678).');
          return;
        }

        if (await checkUsernameExists(childUsername)) {
          Alert.alert('Validation Error', 'Child Username existed! Please use a different username.');
          return;
        }


        if (!isValidEmail(childEmail)) {
          Alert.alert('Validation Error', 'Please enter a valid child email.');
          return;
        }

        if (!isValidPhoneNumber(childContact)) {
          Alert.alert('Validation Error', 'Please enter a valid child phone number (e.g., +6512345678).');
          return;
        }
      }




      setLoading(true); // Set loading state to true when starting the submission

      let teacherId;
      if (role === 'teacher') {
        teacherId = await createTeacherCognito();
        if (!teacherId) {
          setLoading(false); // Set loading state to false if an error occurs
          return;
        }
      }

      if (role === 'guardian') {
        await createGuardianChild();
      } else if (teacherId) {
        await createTeacherDynamoDB(teacherId);
      }

      setLoading(false); // Set loading state to false after successful submission
      Alert.alert('Success', 'Registration successful!');
      clearFields();
    } catch (error) {
      setLoading(false);
      //console.error(error); 
    }
  };

  const SACancelButton = () => {
    navigation.navigate('Home');
  };

  return (
    <BackgroundColor>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.background}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role:</Text>
            <View style={styles.pickerstyle}>
              <Picker
                selectedValue={role}
                onValueChange={(value) => handleRoleChange(value)}
                style={styles.picker}
              >
                <Picker.Item label="Teacher" value="teacher" />
                <Picker.Item label="Guardian & Child" value="guardian" />
              </Picker>
            </View>
          </View>

          {role === 'teacher' && (
            <View>
              <Text style={styles.label}>Teacher Information:</Text>
              <InputField label="Teacher's Name:" value={name} onChangeText={setName} />
              <InputField label="Teacher's Username:" value={username} onChangeText={setUsername} />
              <InputField label="Teacher's Address:" value={address} onChangeText={setAddress} />
              <InputField label="Teacher's Email:" value={email} onChangeText={setEmail} />
              <InputField label="Teacher's Contact:" value={contact} onChangeText={setContact} />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Teacher Role:</Text>
                <View style={styles.pickerstyle}>
                  <Picker
                    selectedValue={teacherRole}
                    onValueChange={(value) => handleTeacherRoleChange(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Normal Teacher" value="Teacher" />
                    <Picker.Item label="CCA Coach" value="CCA Teacher" />
                    <Picker.Item label="Form Teacher" value="Form Teacher" />
                  </Picker>
                </View>
              </View>


            </View>
          )}

          {role === 'guardian' && (
            <View>
              <Text style={styles.label}>Guardian Information:</Text>
              <InputField label="Guardian's Name:" value={guardianName} onChangeText={setGuardianName} />
              <InputField label="Guardian's Username:" value={guardianUsername} onChangeText={setGuardianUsername} />
              <InputField label="Guardian's Address:" value={guardianAddress} onChangeText={setGuardianAddress} />
              <InputField label="Guardian's Email:" value={guardianEmail} onChangeText={setGuardianEmail} />
              <InputField label="Guardian's Contact:" value={guardianContact} onChangeText={setGuardianContact} />

              <Text style={styles.label}>Child Information:</Text>
              <InputField label="Child's Name:" value={childName} onChangeText={setChildName} />
              <InputField label="Child's Username:" value={childUsername} onChangeText={setChildUsername} />
              <InputField label="Child's Address:" value={childAddress} onChangeText={setChildAddress} />
              <InputField label="Child's Email:" value={childEmail} onChangeText={setChildEmail} />
              <InputField label="Child's Contact:" value={childContact} onChangeText={setChildContact} />
              <InputField label="Child's Class ID:" value={childClassID} onChangeText={setChildClassID} />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              onPress={SARegisterSubmitButtonClick}
              color="black"
              disabled={!isFormValid() || loading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={SACancelButton} color="black" />
          </View>
        </View>
      </ScrollView>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  pickerstyle: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default SARegisterProfile;