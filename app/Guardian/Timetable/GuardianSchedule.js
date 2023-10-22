import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { useNavigation } from '@react-navigation/native';
import { API,Auth } from 'aws-amplify';


const GuardianSchedule = ({ route }) => {

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }

  const { selectedDay } = route.params;
  const [classID,setClassID] = useState('');
  const [childID,setChildID] = useState();
  const [data,setData] = useState([]);
  const [doneLoading,setDoneLoading] = useState(false);
  const [ccaSubject,setCCASubject] = useState([]);
  const [cca,setCCA] = useState([]);

  useEffect(() => {
    getCurrectUser()
  }, []);

  useEffect(() => {
    if(uid){
      getData(uid)
    }
  },[uid])

  useEffect(() => { 
    if(classID){
      getscheduleday(classID);
      setDoneLoading(true);
    }
  },[classID]) 

  useEffect(() => {
    if(childID){
      getCCASubject(childID);
    }
  },[childID])

  useEffect(() => {
    if(ccaSubject){
      getCCASchedule(ccaSubject);
    }
  },[ccaSubject])
  
  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getSpecific',{queryStringParameters:{
        GuardianID: uid
      }});
      setClassID(apiData.data[0]?.ClassID);
      setChildID(apiData.data[0]?.UserID);
    } catch (error) {
      console.error(error);
    }
  };

  const getscheduleday = async (classID) => {
    if(classID.charAt(0) === '1'){
      try {
        const apiData = await API.get('api55db091d', '/class/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '2'){
      try {
        const apiData = await API.get('api55db091d', '/classp2/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '3'){
      try {
        const apiData = await API.get('api55db091d', '/classp3/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '4'){
      try {
        const apiData = await API.get('api55db091d', '/classp4/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '5'){
      try {
        const apiData = await API.get('api55db091d', '/classp5/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '6'){
      try {
        const apiData = await API.get('api55db091d', '/classp6/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  };

  const getCCASubject = async (childID) => {
    try {
      const apiData = await API.get('api55db091d', '/childcca/getCCASubject', {queryStringParameters:{
        ChildID: childID
      }});
      setCCASubject(apiData.data[0]?.CCASubject);
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const getCCASchedule = async (ccaSubject) => {
    if(ccaSubject === 'Badminton'){
      try {
        const apiData = await API.get('api55db091d', '/badminton/getTodayEndTime', {queryStringParameters:{
          Day: selectedDay
        }});
        var newData = apiData.data
        setCCA(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Basketball'){
      try {
        const apiData = await API.get('api55db091d', '/basketball/getTodayEndTime', {queryStringParameters:{
          Day: selectedDay
        }});
        var newData = apiData.data
        setCCA(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Netball'){
      try {
        const apiData = await API.get('api55db091d', '/netball/getTodayEndTime', {queryStringParameters:{
          Day: selectedDay
        }});
        var newData = apiData.data
        setCCA(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Soccer'){
      try {
        const apiData = await API.get('api55db091d', '/soccer/getTodayEndTime', {queryStringParameters:{
          Day: selectedDay
        }});
        var newData = apiData.data
        setCCA(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  if(doneLoading){
    data.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }



  const navigation = useNavigation();
  const BackAlert = () => {
    navigation.navigate('TimeTable');
  };
 

  return (
    <BackgroundColor>
      <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={BackAlert}>
            <Ionicons name="chevron-back-outline" size={30} />
          </TouchableOpacity>
        <Text style={styles.headingText}>Schedule for {selectedDay}</Text>
        <ScrollView style={styles.scrollView}>
            {data?.map(data => {   
                return (
                  <View style={styles.periodContainer} key={data.ID}>
                    <Text style={styles.subjectText}>Subject: {data.Subject}</Text>
                    <Text style={styles.timeText}>Time: {data.StartTime} - {data.EndTime}</Text>
                  </View>
                )
            })}

          {cca?.map(data => {   
                return (
                  <View style={styles.periodContainer} key={data.ID}>
                    <Text style={styles.ccaTitle}>CCA Subject: {ccaSubject}</Text>
                    <Text style={styles.timeText}>Time: {data.StartTime} - {data.EndTime}</Text>
                  </View>
                )
            })}
        </ScrollView>
      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headingText: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingTop: '20%',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  periodContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  periodText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subjectText: {
    fontSize: 18,
    color: '#1DC1B1',
  },
  ccaTitle: {
    fontSize: 18,
    color: '#ffffff',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'left',
    alignItems: 'left',
  },
  backText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default GuardianSchedule;
