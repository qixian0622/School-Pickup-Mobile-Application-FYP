import React, { useState, useEffect} from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API,Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../BackgroundColor';
import moment from 'moment/moment';


const MarkAttendance = () => {
  const [selectedAttendance, setSelectedAttendance] = useState([]);
  const navigation = useNavigation();
  const [studentList,setstudentList] = useState([]);
  const [data,setData] = useState([]);
  const [TeacherID,setTeacherID] = useState("");
  const [ClassID,setClassID] = useState("");
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));

  const updateStatus = async (studentId, status) => {
    setSelectedAttendance({...selectedAttendance,[studentId]:status})
  };

  useEffect(() => {
    fetchUserData();
    
   },[]);

   useEffect(() => {
    getClassid(TeacherID)
   },[TeacherID]);

   useEffect(() => {
    if(day == "Saturday" || day == "Sunday")
    {
      Alert.alert('Today is a weekend');
    }
    else
    {
      getData(ClassID)
    }
   },[ClassID]);






   const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setTeacherID(user.attributes.sub || '');
    } catch (error) {
      console.log('Error fetching user data: ', error);
    }
  };

  const getClassid = async (TeacherID) => {
    if(TeacherID != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/teacherclass/getclassid', {queryStringParameters:{
          TeacherID:TeacherID
        }});
        var newData = apiData.data[0]?.ClassID
        setClassID(newData)
      } catch (error) {
        console.error(error);
      }
    }
  }




  const getData = async (ClassID123) => {
    if(ClassID123 != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/child/getAllRecords', {queryStringParameters:{
          ClassID:ClassID123
        }});
        var newData = apiData.data
        console.log("NewData: ",newData)
        setData(newData)    
        setstudentList((prevState)=> {
          prevState.push(...newData)
          prevState.sort((a, b) => { return a.UserID - b.UserID; })
          return [...prevState];
        })
       
      } catch (error) {
        console.error(error);
      }
    }
    
  }

  const gethighestid = async () => {
    try {
      const apiData = await API.get('api55db091d', '/attendance/gethighestid');
      var newData = apiData.data
      if(newData.length == 0)
      {
        console.log("Here1 Highestid: ",newData)
        markattendance123("0")
      }
      else
      {        
        newData.sort((a, b) => (a.ID > b.ID ? -1 : 1))
        console.log("Here2 Highestid: ",newData)
        markattendance123(newData[0]?.ID)
      }
   
    } catch (error) {
      console.error(error);
    }
  }

  const markattendance123 = async (highestid) => {
    const d = new Date();
    
    console.log("StudentList:",studentList)
      const data = {
        body: {
          ID:highestid,
          studentlist: studentList,
          attendancelist: selectedAttendance,
          Date:d.toISOString().substring(0, 10)
        }
      };
      try {
        const apiData = await API.post('api55db091d', '/attendance/markAttendance', data);
        console.log(apiData)
        if(apiData.message == "Success")
        {
          AttendanceSaved()
          setSelectedAttendance([])
        }
      } catch (error) {
        console.error(error.response.data);
      }
    
}




 
  const AttendanceSaved = () => {
    Alert.alert('Attendance Saved!');
  };
 
  const handlePreviousButtonClick = () => {
    navigation.navigate('AttendHP');
  };




  return (
    <BackgroundColor>
    <View style={styles.container}>
    <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>Form Teacher Mark Attendance</Text>
      <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
        </TouchableOpacity>
      <View style={styles.studentlistTable}>
       { <FlatList
          data={studentList}
          keyExtractor={(item, index) => {return item.UserID;}}
          renderItem={({ item }) => (

            <View style={styles.itemContainer}>

              <Text style={styles.studentName}>{item.CName}</Text>


              <Picker
                style={styles.attendancePicker}
                selectedValue={selectedAttendance[item.UserID]}
                //status means value selected in the dropdown box
                onValueChange={(status) => updateStatus(item.UserID, status)}
              >
                <Picker.Item label="Select Status"/>
                <Picker.Item label="Present" value="Present" />
                <Picker.Item label="Absent" value="Absent" />
                <Picker.Item label="Late" value="Late" />

              </Picker>
            </View>
          )}
        />}
      </View>
        <View style={styles.saveButton}>
          <Button   color="black" title="Save Attendance" onPress={() => gethighestid()}/>

        </View>

       
    </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    padding: 16,
  },
  studentlistTable: {
    paddingTop: '2%',
    paddingLeft: '3%',
    maxHeight:'88%',

  },


  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    flex: 1,
    marginRight: 8,
  },
  attendancePicker: {
    width: 150,
  },
  saveButton:{
    paddingLeft: '3%',
    paddingTop: '1%',
    maxWidth:'95%',
  },

});

export default MarkAttendance;
