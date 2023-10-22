import React, { useState, useEffect} from 'react';
import { Text,StyleSheet,SafeAreaView, Button, ScrollView,TouchableOpacity} from 'react-native';
import { API,Auth } from 'aws-amplify';
import { DataTable } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';


const CCAGenerateAlist = () => {

  //create array, when call set attendancelist, it passed the value back to attendancelist variable
  const [data,setData] = useState([]);
  const [error,setError] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [CCATeacherID,setCCATeacherID] = useState("");
  const [ccaname,setccaname] = useState("");
  const date1 = new Date();
  const [day, setDay] = useState(moment(date1).format('dddd'));

  const navigation = useNavigation();

  const handlePreviousButtonClick = () => {
    navigation.navigate('CCAAttendHP');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  useEffect(() => {
    fetchUserData();
   },[]);

  useEffect(() => {
    getCCA(CCATeacherID)
   },[CCATeacherID]);


   const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCCATeacherID(user.attributes.sub || '');
    } catch (error) {
      Alert.alert('Error fetching user data, please contact administrator.');
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

  const getData = async (CCASubject) => {
    try {
      const apiData = await API.get('api55db091d', '/ccaAttendance/generate',{queryStringParameters:{
        Date1:date.toISOString().substring(0, 10),
        CCA:CCASubject
      }})
      var newData = apiData.data
      if(day == "Saturday" || day == "Sunday")
        {
          Alert.alert('Today is a weekend');
        }
        else
        {
          if(newData.length == 0)
          {
            Alert.alert("No Attendance Record Found")
          }
          else
          {
            setData(newData)
          }
        }     
    } catch (error) {
      console.error(error);
    }
  }
 

  return (
    <BackgroundColor>
    <SafeAreaView style={{flex:1,marginHorizontal:20,marginVertical:30}}>
      <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
      </TouchableOpacity>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>CCA Generate Attendance List</Text>
      <Text style={styles.selectedDate}>Selected Date: {moment(date).format('DD/MM/YYYY')}</Text>
      {show && (
        <DateTimePicker
          value={date}
          mode='date'
          onChange={onChange}
        />
      )}
       <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Attendance</DataTable.Title>
        </DataTable.Header>
        
        <ScrollView>
        {
          data.map(data1 => {
            return (
              <DataTable.Row
                key={data1.ID}
              >
                <DataTable.Cell>
                  {data1.CName}
                </DataTable.Cell>
                <DataTable.Cell style={styles.messageColumn}>
                  {data1.Date1}
                </DataTable.Cell>
                <DataTable.Cell style={styles.messageColumn}>
                  {data1.Attendance}
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
        </ScrollView>
        <Button style={styles.bottomButton} onPress={showDatepicker} title="Select Date"/>
        <Button style={styles.bottomButton} onPress={() => getData(ccaname)} title="Generate Record"/>
      </DataTable>

      
    </SafeAreaView>
    </BackgroundColor>

    

    
  )
};

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    flex: 1,
    padding: 16,
  },
  selectedDate: {
    fontSize: 18
  },
  bottomButton: {
    position: 'absolute',
    bottom:5,
  },
  nodatafound:{
    paddingTop:20,
  },
  studentlistTable: {
    paddingTop: '9%',
    paddingLeft: '3%',
    maxHeight:'75%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:'5%',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'gray',
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

export default CCAGenerateAlist;
