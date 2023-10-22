import React, { useState, useEffect} from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API,Auth} from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { DataTable } from 'react-native-paper';
import moment from 'moment/moment';


const UpdateAttendance = () => {
  const navigation = useNavigation();
  const [data,setData] = useState([]);
  const [TeacherID,setTeacherID] = useState("");
  const [ClassID,setClassID] = useState("");
  const [tempClassID,settempClassID] = useState("");
  const [UserID, setUserID] = React.useState('');
  const [CName, setCName] = React.useState('');
  const [status, setStatus] = useState();
  const [ChildID,setChildID] = useState("");
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));


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
      getattendancerecords(ClassID)
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
      console.log(newData)
      setClassID(newData)
    } catch (error) {
      console.error(error);
    }
    }

  }

  const getattendancerecords = async (ClassID123) => {
    const d = new Date();
    if(ClassID123 != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/attendance/getAllRecords',{queryStringParameters:{
          ClassID:ClassID123,
          Date1:d.toISOString().substring(0, 10)
        }});
        var newData = apiData.data
        newData.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
        console.log("NewData: ",newData)
        setData(newData)
      } catch (error) {
        console.error(error);
      }
    }

  }

  const updateattendance123 = async () => {
      const d = new Date();
      const data = {
        body: {
          ID:UserID,
          ChildID,ChildID,
          CName:CName,
          ClassID:ClassID,
          Attendance:status,
          Date1:d.toISOString().substring(0, 10)
        }
      };
      try {
        const apiData = await API.put('api55db091d', '/attendance/updateAttendance', data);
        console.log(apiData)
        if(apiData.message == "Success")
        {
          AttendanceUpdated()
          getattendancerecords(ClassID)
        }
      } catch (error) {
        console.error(error.response.data);
      }
    
  }




 
  const AttendanceUpdated = () => {
    Alert.alert('Attendance Updated!');
  };
 
  const handlePreviousButtonClick = () => {
    navigation.navigate('AttendHP');
  };




  return (
    <BackgroundColor>
    <View style={styles.container}>
    <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>Form Teacher Update Attendance</Text>
      <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
        </TouchableOpacity>
      <View style={styles.studentlistTable}>
      <DataTable>
      <DataTable.Header>
          <DataTable.Title>Attendance</DataTable.Title>
          <DataTable.Title>ClassID</DataTable.Title>
          <DataTable.Title>CName</DataTable.Title>
          <DataTable.Title>Date1</DataTable.Title>
        </DataTable.Header>
       {
          data.map(data1 => {
          return (
            <DataTable.Row
              key={data1.ID}
              onPress={() => {
                setUserID(data1.ID)
                settempClassID(data1.ClassID)
                setCName(data1.CName)
                setChildID(data1.ChildID)
                alert("Selected Record!!! Proceed to update record");
              }}
            >
              <DataTable.Cell style={{flex: 1}}>
                {data1.Attendance}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1}}>
                {data1.ClassID}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1}}>
                {data1.CName}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1}}>
                {data1.Date1}
              </DataTable.Cell>
            </DataTable.Row>
        )})}
      </DataTable>
      <Picker
        selectedValue={status}
        style={{ height: 50, width: 200,alignSelf: 'center'}}
        onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
      >
        <Picker.Item label="Select Status" value="Select Status" />
        <Picker.Item label="Present" value="Present" />
        <Picker.Item label="Late" value="Late" />
        <Picker.Item label="Absent" value="Absent" />
      </Picker>
      </View>
        <View style={styles.saveButton}>
          <Button color="black" title="Update Attendance" onPress={() => updateattendance123()}/>

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

export default UpdateAttendance;