import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { useNavigation } from '@react-navigation/native';
import { API,Auth } from 'aws-amplify';


const ChildSchedule = ({ route }) => {
  const [data,setData] = useState([]);
  const [classid,setclassid] = useState("");
  const [id, setid] = useState('');
  const [doneLoading, setDoneLoading] = useState(false);
  const [doneLoading2, setDoneLoading2] = useState(false);
  const [ccaSubject,setCCASubject] = useState([]);
  const [cca,setCCA] = useState([]);

  const { selectedDay } = route.params;

  const fetchUserData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setid(user.attributes.sub || '');
    } catch (error) {
      console.log('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData()
  }, []);

  useEffect(() => { // Get the class id from the child table based on the guardianID 
    if(id){
      getData(id)
      getCCASubject(id)
    }
  },[id])// <- this means it only run once

  useEffect(() => { // Get the subjects from the class table based on the classid
    if(classid){
      getscheduleday(classid)
      setDoneLoading(true)
    }
  },[classid]) // <- this means it will run once the classid changes

  useEffect(() => {
    if(ccaSubject){
      getCCASchedule(ccaSubject);
      setDoneLoading2(true);
    }
  }, [ccaSubject])


  const getData = async (id) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getmyrecords',{queryStringParameters:{
        CID:id
      }})
      setclassid(apiData.data[0]?.ClassID)
    } catch (error) {
      console.error(error);
    }
  }
    
  const getscheduleday = async (classid) => {
    if(classid.charAt(0) === '1'){
      try {
        const apiData = await API.get('api55db091d', '/class/getTodaySchedule', {queryStringParameters:{
          ClassID: classid,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classid.charAt(0) === '2'){
      try {
        const apiData = await API.get('api55db091d', '/classp2/getTodaySchedule', {queryStringParameters:{
          ClassID: classid,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classid.charAt(0) === '3'){
      try {
        const apiData = await API.get('api55db091d', '/classp3/getTodaySchedule', {queryStringParameters:{
          ClassID: classid,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classid.charAt(0) === '4'){
      try {
        const apiData = await API.get('api55db091d', '/classp4/getTodaySchedule', {queryStringParameters:{
          ClassID: classid,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classid.charAt(0) === '5'){
      try {
        const apiData = await API.get('api55db091d', '/classp5/getTodaySchedule', {queryStringParameters:{
          ClassID: classid,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classid.charAt(0) === '6'){
      try {
        const apiData = await API.get('api55db091d', '/classp6/getTodaySchedule', {queryStringParameters:{
          ClassID: classid,
          Day: selectedDay,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  };

    // GET CHILD's CCA CLASS
    const getCCASubject = async (id) => {
      try {
        const apiData = await API.get('api55db091d', '/childcca/getCCASubject', {queryStringParameters:{
          ChildID: id
        }});
        setCCASubject(apiData.data[0]?.CCASubject);
      } catch (error) {
        console.error(error.response.data);
      }
    }
  
    // GET ALL DISMISSAL TIME
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

  if(doneLoading2){
    cca.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }




  const navigation = useNavigation();
  const BackAlert = () => {
    navigation.goBack();
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
    color: 'black',
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

export default ChildSchedule;
