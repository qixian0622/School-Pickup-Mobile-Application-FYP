import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Text, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { API } from 'aws-amplify';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Auth } from 'aws-amplify';

const SAUpdateClass = () => {
  const navigation = useNavigation();
  const data = useRoute();

  const [isUpdating, setIsUpdating] = useState(false);
  const [ID, setID] = useState('');
  const [classID, setClassID] = useState('');
  const [day, setDay] = useState('Monday');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [startTime, setStartTime] = useState('12:00 AM');
  // const [subject, setSubject] = useState('Music');
  const [teacherID, setTeacherID] = useState('');
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [subjectPickerTouched, setSubjectPickerTouched] = useState(false); 


  useEffect(() => {
    setID(data.params.id.toString());
    setClassID(data.params.classid);
    setDay(data.params.day);
    setEndTime(data.params.endtime);
    setStartTime(data.params.starttime);
    setSelectedSubject(data.params.subject);
    setTeacherID(data.params.teacherid);

    fetchTeacherNames(data.params.subject);
  }, [data.params.subject]);

  useEffect(() => {
    fetchTeacherNames(selectedSubject);
  }, [selectedSubject]);

  const fetchTeacherNames = async (subject) => {
    setIsLoading(true); // Start loading
    try {
      const teacherData = await API.get('api55db091d', '/teacherSubject/getinfo', {
        queryStringParameters: {
          subject: subject,
        },
      });

      const teacherIds = teacherData.data.map((teacher) => teacher.TeacherID);

      const teacherNamesPromises = teacherIds.map(async (teacherId) => {
        try {
          const teacherInfo = await API.get('api55db091d', '/teacher/getName', {
            queryStringParameters: {
              TeacherID: teacherId,
            },
          });

          const teacherName = teacherInfo.data[0]?.Name || 'Unknown';
          return teacherName;
        } catch (error) {
          console.log(`Error fetching teacher name for ID ${teacherId}:`, error.message);
          return 'Unknown';
        }
      });

      const teacherNames = await Promise.all(teacherNamesPromises);

      const teacherOptions = teacherData.data.map((teacher, index) => ({
        TeacherID: teacher.TeacherID,
        TeacherName: teacherNames[index],
      }));

      setTeacherOptions(teacherOptions);
      setIsLoading(false); 
    } catch (error) {
      console.log('An error occurred:', error.message);
      setIsLoading(false); 
    }
  };

  const handleCancelButtonClick = () => {
    navigation.goBack();
  };

  const handleSubmitButtonClick = async () => {
    setIsUpdating(true);
    try {
      await updateClassProfile();

      Alert.alert('Update Successful', 'Class profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () =>  navigation.navigate('SAManageClass',{message:"Success"}),
        },
      ]);
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Error updating class profile.');
    }

    setIsUpdating(false);
  };

  const updateClassProfile = async () => {
    let endpointPath = '/class/updateprofile';
    let idd = "";

    if (classID === '1A' || classID === '1B') {
      endpointPath = '/class/updateprofile';
      idd = parseInt(ID) ;
    } else if (classID === '2A') {
      endpointPath = '/classp2/updateprofile';
      idd = ID ;
    } else if (classID === '3A') {
      endpointPath = '/classp3/updateprofile';
      idd = ID ;

    } else if (classID === '4A') {
      endpointPath = '/classp4/updateprofile';
      idd = ID ;

    }

    else if (classID === '5A') {
      endpointPath = '/classp5/updateprofile';
      idd = parseInt(ID) ;

    }

    else if (classID === '6A') {
      endpointPath = '/classp6/updateprofile';
      idd = parseInt(ID) ;

    }

    const data = {
      body: {
        ID: idd ,
        ClassID: classID,
        Day: day,
        EndTime: endTime,
        StartTime: startTime,
        Subject: selectedSubject,
        TeacherID: teacherID,
      },
    };

    try {
      const apiData = await API.put('api55db091d', endpointPath, data);
      console.log(apiData);
    } catch (error) {
      throw new Error(error.message || 'Error updating class profile');
    }
  };

  return (
    <BackgroundColor>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID:</Text>
            <TextInput style={styles.textInput} value={ID.toString()} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ClassID:</Text>
            <TextInput
              style={styles.textInput}
              value={classID}
              editable={true}
              onChangeText={(text) => setClassID(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Day:</Text>
            <Picker
              style={styles.picker}
              selectedValue={day}
              onValueChange={(itemValue, itemIndex) => setDay(itemValue)}
            >
              <Picker.Item label="Monday" value="Monday" />
              <Picker.Item label="Tuesday" value="Tuesday" />
              <Picker.Item label="Wednesday" value="Wednesday" />
              <Picker.Item label="Thursday" value="Thursday" />
              <Picker.Item label="Friday" value="Friday" />
              <Picker.Item label="Saturday" value="Saturday" />
              <Picker.Item label="Sunday" value="Sunday" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>StartTime:</Text>
            <Picker
              style={styles.picker}
              selectedValue={startTime}
              onValueChange={(itemValue, itemIndex) => setStartTime(itemValue)}
              enabled={false}

            >
              <Picker.Item label="7:00 AM" value="7:00am" />
              <Picker.Item label="7:30 AM" value="7:30am" />
              <Picker.Item label="8:00 AM" value="8:00am" />
              <Picker.Item label="8:30 AM" value="8:30am" />
              <Picker.Item label="9:00 AM" value="9:00am" />
              <Picker.Item label="9:30 AM" value="9:30am" />
              <Picker.Item label="10:00 AM" value="10:00am" />
              <Picker.Item label="10:30 AM" value="10:30am" />
              <Picker.Item label="11:00 AM" value="11:00am" />
              <Picker.Item label="11:30 AM" value="11:30am" />
              <Picker.Item label="12:00 PM" value="12:00pm" />
              <Picker.Item label="12:30 PM" value="12:30pm" />
              <Picker.Item label="1:00 PM" value="1:00pm" />
              <Picker.Item label="1:30 PM" value="1:30pm" />
              <Picker.Item label="2:00 PM" value="2:00pm" />
              <Picker.Item label="2:30 PM" value="2:30pm" />
              <Picker.Item label="3:00 PM" value="3:00pm" />
              <Picker.Item label="3:30 PM" value="3:30pm" />
              <Picker.Item label="4:00 PM" value="4:00pm" />
              <Picker.Item label="4:30 PM" value="4:30pm" />
              <Picker.Item label="5:00 PM" value="5:00pm" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>EndTime:</Text>
            <Picker
              style={styles.picker}
              selectedValue={endTime}
              onValueChange={(itemValue, itemIndex) => setEndTime(itemValue)}
              enabled={false}
            >
              <Picker.Item label="7:00 AM" value="7:00am" />
              <Picker.Item label="7:30 AM" value="7:30am" />
              <Picker.Item label="8:00 AM" value="8:00am" />
              <Picker.Item label="8:30 AM" value="8:30am" />
              <Picker.Item label="9:00 AM" value="9:00am" />
              <Picker.Item label="9:30 AM" value="9:30am" />
              <Picker.Item label="10:00 AM" value="10:00am" />
              <Picker.Item label="10:30 AM" value="10:30am" />
              <Picker.Item label="11:00 AM" value="11:00am" />
              <Picker.Item label="11:30 AM" value="11:30am" />
              <Picker.Item label="12:00 PM" value="12:00pm" />
              <Picker.Item label="12:30 PM" value="12:30pm" />
              <Picker.Item label="1:00 PM" value="1:00pm" />
              <Picker.Item label="1:30 PM" value="1:30pm" />
              <Picker.Item label="2:00 PM" value="2:00pm" />
              <Picker.Item label="2:30 PM" value="2:30pm" />
              <Picker.Item label="3:00 PM" value="3:00pm" />
              <Picker.Item label="3:30 PM" value="3:30pm" />
              <Picker.Item label="4:00 PM" value="4:00pm" />
              <Picker.Item label="4:30 PM" value="4:30pm" />
              <Picker.Item label="5:00 PM" value="5:00pm" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject:</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedSubject}
              onValueChange={(itemValue, itemIndex) => {
                setSubjectPickerTouched(true);
               // setSubject(itemValue);
                setSelectedSubject(itemValue);
              }}
            >
               <Picker.Item label="Music" value="Music" />
              <Picker.Item label="Mother Tongue" value="Mother Tongue" />
              <Picker.Item label="Mathematics" value="Mathematics" />
              <Picker.Item label="English Language" value="English Language" />
              <Picker.Item label="Art" value="Art" />
              <Picker.Item label="Physical Education" value="Physical Education" />
              <Picker.Item label="Science" value="Science" />
              <Picker.Item label="Social Studies" value="Social Studies" />
              <Picker.Item label="Advanced Mathematics" value="Advanced Mathematics" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>TeacherID:</Text>
            <Picker
              style={styles.picker}
              selectedValue={teacherID}
              onValueChange={(itemValue, itemIndex) => setTeacherID(itemValue)}
              enabled={selectedSubject !== ''}
            >
              {teacherOptions.map((teacher) => (
                <Picker.Item key={teacher.TeacherID} label={teacher.TeacherName} value={teacher.TeacherID} />
              ))}
            </Picker>
            {isLoading && <ActivityIndicator size="small" color="black" style={styles.loader} />}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Update"
              onPress={handleSubmitButtonClick}
              color="black"
              disabled={ isUpdating  || isLoading || teacherID === ''} // Disable submit button until subject picker is touched, in order to retrieve the teacher names for the subjects
            />
            <Button title="Cancel" onPress={handleCancelButtonClick} color="black" />
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
    paddingTop: 10,
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
  picker: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 20,
  },
  loader: {
    position: 'absolute',
    right: 0,
    top: 20,
  },
});

export default SAUpdateClass;