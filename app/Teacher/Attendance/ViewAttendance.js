import { StyleSheet, Text, SafeAreaView,TouchableOpacity,Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { API,Auth } from 'aws-amplify';
import moment from 'moment/moment';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';




const ViewAttendance = () => {

    const [data,setData] = useState([]);
    const [TeacherID,setTeacherID] = useState("");
    const [ClassID,setClassID] = useState("");
    const [role, setRole] = useState();
    const date1 = new Date();
    const [day, setDay] = useState(moment(date1).format('dddd'));
    const navigation = useNavigation();

    const handlePreviousButtonClick = () => {
      navigation.navigate('AttendHP');
    };

   const gettodayattendance = async (ClassID123) => {
    if(ClassID123 != "")
    {
      const date = new Date()
      try {
        const apiData = await API.get('api55db091d', '/attendance/generate',{queryStringParameters:{
          Date1:date.toISOString().substring(0, 10),
          ClassID:ClassID123
        }})
        setData(apiData.data)
      } catch (error) {
        console.error(error);
      }
    }
    }

    const fetchUserData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setTeacherID(user.attributes.sub || '');
        setRole(user.attributes.profile)
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
    

    useEffect(() => {
      fetchUserData();
     },[]);

     useEffect(() => {
      getClassid(TeacherID)
     },[TeacherID])

    useEffect(() => {
      if(day == "Saturday" || day == "Sunday")
      {
        Alert.alert('Today is a weekend');
      }
      else
      {
        gettodayattendance(ClassID)
      } 
    },[ClassID])

  if (data?.length == 0) {
    return (
      <BackgroundColor>
      <SafeAreaView style={styles.main}>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>Form Teacher/Teacher View Attendance</Text>
        <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
          </TouchableOpacity>
        <Text>No record!</Text>
      </SafeAreaView>
      </BackgroundColor>
    )
  } else {
      return (
        <BackgroundColor>
        <SafeAreaView style={styles.main}>
          <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
          </TouchableOpacity>
          <Text>Attendance of Today</Text>
          <ScrollView>
          <DataTable>
          <DataTable.Header>
              <DataTable.Title>CName</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Attendance</DataTable.Title>
            </DataTable.Header>
          
            {
              data.map(data1 => {                  
                return (
                  <DataTable.Row
                    key={data1.ID}
                  >
                    <DataTable.Cell>
                      {data1.CName}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {data1.Date1}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {data1.Attendance}
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              })}    
          </DataTable>
          </ScrollView>
        </SafeAreaView>
        </BackgroundColor>
      )
    }
}

export default ViewAttendance;

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    main: {
    flex: 1,
    justifyContent: "flex-start",
    maxWidth: 960,
    margin:20,
    marginHorizontal: "auto",
  },
})
