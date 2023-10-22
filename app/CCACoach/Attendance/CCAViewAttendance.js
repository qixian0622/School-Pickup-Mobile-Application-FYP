import React, { useEffect, useState } from 'react'
import { StyleSheet,Text, SafeAreaView,TouchableOpacity, Alert} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API,Auth } from 'aws-amplify';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment/moment';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';


const CCAViewAttendance = () => {

  const navigation = useNavigation();
  const [data,setData] = useState([]);
  const [CCATeacherID,setCCATeacherID] = useState("");
  const [ccaname, setccaname] = useState('');
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));


  const handlePreviousButtonClick = () => {
    navigation.navigate('CCAAttendHP');
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
        gettodayattendance(ccaname)
      } 
  },[ccaname])

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
  const gettodayattendance = async (CCASubject) => {
    if(CCASubject != "")
    {
      const date = new Date()
      try {
        const apiData = await API.get('api55db091d', '/ccaAttendance/generate',{queryStringParameters:{
          Date1:date.toISOString().substring(0, 10),
          CCA:CCASubject
        }})
        setData(apiData.data)
      } catch (error) {
        console.error(error);
      }
    } 
  }



  if (data.length == 0) {
    return (
      <BackgroundColor>
      <SafeAreaView style={styles.main}>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>CCA View Attendance</Text>
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
        <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>CCA View Attendance</Text>
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
};

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    flex: 1,
    padding: 16,
  },
 
  nodatafound:{
    paddingTop:20,
  },
  studentlistTable: {
    paddingTop: '9%',
    paddingLeft: '3%',
    maxHeight:'83%',
  },
 
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    flex: 1,
    marginRight: 8,
    fontSize:20,
  },
  studentStatus: {
    fontWeight: 'bold',
    fontSize:20,

  },
});

export default CCAViewAttendance;
