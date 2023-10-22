import React, { useState, useEffect} from 'react';
import { View,Button, StyleSheet, TouchableOpacity,Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import { API,Auth} from 'aws-amplify';
import { DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import moment from 'moment/moment';


const CCAUpdateAttendance = () => {
  const [CCATeacherID,setCCATeacherID] = useState("");
  const [ccaname, setccaname] = useState('');
  const [UserID, setUserID] = React.useState('');
  const [CName, setCName] = useState('');
  const [ccasubject, setccasubject] = useState('');
  const [data,setData] = useState([]);
  const [status, setStatus] = useState();
  const [childid, setchildid] = useState('');
  const navigation = useNavigation();
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));

  useEffect(() => {
    fetchUserData();
   },[]);

   useEffect(() => {
    getCCA(CCATeacherID)
  },[CCATeacherID]);

  useEffect(() => {
    if(day == "Saturday" || day == "Sunday")
    {
      Alert.alert('Today is a weekend');
    }
    else
    {
      getattendancerecords(ccaname)
    }
   },[ccaname]);

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCCATeacherID(user.attributes.sub || '');
    } catch (error) {
      console.log('Error fetching user data: ', error);
    }
  };

  const getCCA = async (CCATeacherID) => {
    if(CCATeacherID != "")
    {
        try {
            const apiData = await API.get('api55db091d', '/ccacoach/getCCA',{queryStringParameters:{
              UserID:CCATeacherID
            }})
            setccaname(apiData.data[0]?.CCAName)
          } catch (error) {
            console.error(error);
          }
    }
  }

  const getattendancerecords = async (ccaname) => {
    const d = new Date();
    if(ccaname != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/ccaAttendance/getAllRecords',{queryStringParameters:{
          CCA:ccaname,
          Date1:d.toISOString().substring(0, 10)
        }});
        var newData = apiData.data
        newData.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
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
        CCASubject:ccasubject,
        ChildID:childid,
        CName:CName,
        Attendance:status,
        Date1:d.toISOString().substring(0, 10)
      }
    };
    try {
      const apiData = await API.put('api55db091d', '/ccaAttendance/updateAttendance', data);
      if(apiData.message == "Success")
      {
        AttendanceSaved()
        getattendancerecords(ccaname)
      }
    } catch (error) {
      console.error(error.response.data);
    }
  
}

  const AttendanceSaved = () => {
    //navigate to setting page
    Alert.alert('Attendance Updated!');
  };

  const handlePreviousButtonClick = () => {
    navigation.navigate('CCAAttendHP');
  };
  

  return (
    <BackgroundColor>
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
        </TouchableOpacity>
      <View style={styles.studentlistTable}>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>CCA Update Attendance</Text>
      <DataTable>
      <DataTable.Header>
          <DataTable.Title>Attendance</DataTable.Title>
          <DataTable.Title>CCASubject</DataTable.Title>
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
                setccasubject(data1.CCASubject)
                setCName(data1.CName)
                setchildid(data1.ChildID)
                alert("Selected Record!!! Proceed to update record");
              }}
            >
              <DataTable.Cell style={{flex: 1}}>
                {data1.Attendance}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1}}>
                {data1.CCASubject}
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

export default CCAUpdateAttendance;
