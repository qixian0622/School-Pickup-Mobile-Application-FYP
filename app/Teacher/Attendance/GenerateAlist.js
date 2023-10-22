import React, { useState, useEffect} from 'react';
import {Text,StyleSheet,SafeAreaView, Button, ScrollView,Alert,TouchableOpacity} from 'react-native';
import { API, Amplify,Auth } from 'aws-amplify';
import { DataTable } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import awsExports from "../../../src/aws-exports";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SelectDropdown from '../../../node_modules/react-native-select-dropdown';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';

Amplify.configure(awsExports);

const GenerateAlist = () => {
    const [data,setData] = useState([]);
    const [error,setError] = useState(null);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [TeacherID,setTeacherID] = useState("");
    const [role, setRole] = useState();
    const [selectedClassID, setSelectedClassID] = useState();
    const [ClassID,setClassID] = useState("");
    const date1 = new Date();
    const [day, setDay] = useState(moment(date1).format('dddd'));
    const navigation = useNavigation();
    const countries = ["Egypt", "Canada", "Australia", "Ireland"]
    const [classList,setClassList] = useState([]);

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
    };
  
    const showDatepicker = () => {
      setShow(true);
    };

    const fetchUserData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setTeacherID(user.attributes.sub || '');
        setRole(user.attributes.profile)
      } catch (error) {
        console.log('Error fetching user data: ', error);
      }
    };

    useEffect(() => {
      fetchUserData();
      getUniqueClassID();
     },[]);

    useEffect(() => {
      getClassid(TeacherID)
     },[TeacherID]);

     const handlePreviousButtonClick = () => {
      navigation.navigate('AttendHP');
    };

    const getUniqueClassID = async () => {
      try {
        const apiData1 = await API.get('api55db091d', '/class/getAllClassID');
        const apiData2 = await API.get('api55db091d', '/classp2/getAllClassID');
        const apiData3 = await API.get('api55db091d', '/classp3/getAllClassID');
        const apiData4 = await API.get('api55db091d', '/classp4/getAllClassID');
        const apiData5 = await API.get('api55db091d', '/classp5/getAllClassID');
        const apiData6 = await API.get('api55db091d', '/classp6/getAllClassID');

        const combinedRecords = [
          ...apiData1.data.map((item) => ({ ...item})),
          ...apiData2.data.map((item) => ({ ...item})),
          ...apiData3.data.map((item) => ({ ...item})),
          ...apiData4.data.map((item) => ({ ...item})),
          ...apiData5.data.map((item) => ({ ...item})),
          ...apiData6.data.map((item) => ({ ...item})),
        ];

        setClassList(combinedRecords)
      } catch (error) {
        console.error(error);
      }
    }

  
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

    const getData = async (ClassID123) => {
      if(role === 'Form Teacher'){
        if(ClassID123 != "")
        {
          try {
            const apiData = await API.get('api55db091d', '/attendance/generate', {queryStringParameters:{
              Date1:date.toISOString().substring(0, 10),
              ClassID:ClassID123
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
                console.log(newData)
              }
            }     
          } catch (error) {
            console.error(error);
          }
        }
      } else if (role === 'Teacher'){
          try {
            const apiData = await API.get('api55db091d', '/attendance/generate', {queryStringParameters:{
              Date1:date.toISOString().substring(0, 10),
              ClassID:selectedClassID
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
                console.log(newData)
              }
            }     
          } catch (error) {
            console.error(error);
          }
        }
    }

    const showClassList = () => {
      if(role === 'Teacher'){
        return(
          <SafeAreaView>
          <Text>Select ClassID:</Text>
            <SelectDropdown
                  data={classList}
                  onSelect={(selectedItem, index) => {
                    setSelectedClassID(selectedItem.ClassID)
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.ClassID
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.ClassID
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  dropdownIconPosition='right'
              />
          </SafeAreaView>
        )
      }
    }

    return (
      <BackgroundColor>
         <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>Generate Attendance List</Text>
      <SafeAreaView style={{flex:1,marginHorizontal:20,marginVertical:30}}>
      <TouchableOpacity style={styles.button} onPress={handlePreviousButtonClick}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
      </TouchableOpacity>
        <Text style={styles.selectedDate}>Selected Date: {moment(date).format('DD/MM/YYYY')}</Text>
        {show && (
          <DateTimePicker
            value={date}
            mode='date'
            onChange={onChange}
          />
        )}
        {showClassList()}
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
          <Button onPress={showDatepicker} title="Select Date" style={styles.selectDateButton}/>
          <Button onPress={() => getData(ClassID)} title="Generate Record" style={styles.selectDateButton}/>
        </DataTable>
      </SafeAreaView>  
      </BackgroundColor>
    )
  }

export default GenerateAlist

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  selectedDate: {
    fontSize: 18
  },
  selectDateButton:{
    position: 'absolute',
    bottom:10,
    left:0,
  },
  dropdown4BtnStyle: {
    width: '60%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#444',
  }
})