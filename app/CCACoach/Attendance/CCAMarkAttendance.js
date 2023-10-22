import React, { useState, useEffect} from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API,Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import moment from 'moment/moment';


const CCAMarkAttendance = () => {
  const [selectedAttendance, setSelectedAttendance] = useState([]);
  const navigation = useNavigation();
  const [CCATeacherID,setCCATeacherID] = useState("");
  const [ccaname, setccaname] = useState('');
  const [childname, setchildname] = useState([]);
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));

  const updateStatus = async (studentId, status) => {
    setSelectedAttendance({...selectedAttendance,[studentId]:status})
  };

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
      getchild(ccaname)
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

  const gethighestid = async () => {
    try {
      const apiData = await API.get('api55db091d', '/ccaAttendance/gethighestid');
      var newData = apiData.data
      if(newData.length == 0)
      {   
        markattendance123("0")
      }
      else
      {        
        newData.sort((a, b) => (a.ID > b.ID ? -1 : 1))
        markattendance123(newData[0]?.ID)
      }
   
    } catch (error) {
      console.error(error);
    }
  }

  const markattendance123 = async (highestid) => {
    const d = new Date();
    if(ccaname.length != 0)
    {
      const data = {
        body: {
          ID:highestid,
          ccalist: childname,
          CCASubject:ccaname,
          attendancelist: selectedAttendance,
          Date:d.toISOString().substring(0, 10),
          CCASubject: ccaname,
        }
      };
      try {
        const apiData = await API.post('api55db091d', '/ccaAttendance/markAttendance', data);
        if(apiData.message == "Success")
        {
          AttendanceSaved()
          setSelectedAttendance([])
        }
      } catch (error) {
        console.error(error.response.data);
      }
    } 
    
    
}


  
  const getchild = async (CCAname) => {
      if(CCAname != "")
      {
          try {
              const apiData = await API.get('api55db091d', '/childcca/getchildid',{queryStringParameters:{
                CCA:CCAname
              }})
              var newData = apiData.data
              setchildname(newData)
            } catch (error) {
              console.error(error);
            }
      }
      
  }

 
  const AttendanceSaved = () => {
    Alert.alert('Attendance Saved!');
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
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>CCA Mark Attendance</Text>
        <FlatList
          data={childname}
          keyExtractor={(item) => item.ChildID}
          renderItem={({ item }) => (

            <View style={styles.itemContainer}>

              <Text style={styles.studentName}>{item.CName}</Text>


              <Picker
                style={styles.attendancePicker}
                selectedValue={selectedAttendance[item.ChildID]}
                //status means value selected in the dropdown box
                onValueChange={(status) => updateStatus(item.ChildID, status)}
              >
                <Picker.Item label="Select Status"/>
                <Picker.Item label="Present" value="Present" />
                <Picker.Item label="Absent" value="Absent" />
                <Picker.Item label="Late" value="Late" />

              </Picker>
            </View>
          )}
        />
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

export default CCAMarkAttendance;
