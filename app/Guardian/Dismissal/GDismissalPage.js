import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';

Amplify.configure(awsExports);

const DismissalPage = () => {

  const [data,setData] = useState([]);
  const [data1,setData1] = useState([]);
  const [ccaTodayDismissal,setCCATodayDismissal] = useState([]);
  const [todayDismissal,setTodayDismissal] = useState([]);
  const [classID, setClassID] = useState();
  const [childID, setChildID] = useState();
  const [ccaSubject, setCCASubject] = useState();
  const [doneLoading,setDoneLoading] = useState(false);
  const [doneLoading2,setDoneLoading2] = useState(false);
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }

  useEffect(() => { 
    getCurrectUser();
  },[])

  useEffect(() => {
    if(uid){
      getData(uid);
    }
  },[uid]);

  useEffect(() => {
    if(childID){
      getCCASubject(childID);
    }
    if(classID){
      getSubjects(classID);
      getTodayDismissalTime(classID)
      setDoneLoading2(true);
    }
  },[childID,classID]);

  useEffect(() => {
    if(ccaSubject){
      getCCASchedule(ccaSubject);
      getCCATodayDismissalTime(ccaSubject)
      setDoneLoading(true);
    }
  },[ccaSubject]);

  // Get chidl ID
  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getSpecific', {queryStringParameters:{
        GuardianID: uid
      }});
      setChildID(apiData.data[0]?.UserID);
      setClassID(apiData.data[0]?.ClassID);
    } catch (error) {
      console.error(error.response.data);
    }
  }

  // GET CHILD's CCA CLASS
  const getCCASubject = async (childID) => {
    try {
      const apiData = await API.get('api55db091d', '/childcca/getCCASubject', {queryStringParameters:{
        ChildID: childID
      }});
      setCCASubject(apiData.data[0].CCASubject);
    } catch (error) {
      console.error(error.response.data);
    }
  }

  // GET ALL DISMISSAL TIME
  const getCCASchedule = async (ccaSubject) => {
    if(ccaSubject === 'Badminton'){
      try {
        const apiData = await API.get('api55db091d', '/badminton/getAllSchedule');
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Basketball'){
      try {
        const apiData = await API.get('api55db091d', '/basketball/getAllSchedule');
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Netball'){
      try {
        const apiData = await API.get('api55db091d', '/netball/getAllSchedule');
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Soccer'){
      try {
        const apiData = await API.get('api55db091d', '/soccer/getAllSchedule');
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  // Get Class Timetable
  const getSubjects = async (classID) => {
    if(classID.charAt(0) === '1'){
      try {
        const apiData = await API.get('api55db091d', '/class/getAllDismissal', {queryStringParameters:{
          classID: classID
        }});
        var newData = apiData.data
        setData1(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '2'){
      try {
        const apiData = await API.get('api55db091d', '/classp2/getAllDismissal', {queryStringParameters:{
          classID: classID
        }});
        var newData = apiData.data
        setData1(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '3'){
      try {
        const apiData = await API.get('api55db091d', '/classp3/getAllDismissal', {queryStringParameters:{
          classID: classID
        }});
        var newData = apiData.data
        setData1(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '4'){
      try {
        const apiData = await API.get('api55db091d', '/classp4/getAllDismissal', {queryStringParameters:{
          classID: classID
        }});
        var newData = apiData.data
        setData1(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '5'){
      try {
        const apiData = await API.get('api55db091d', '/classp5/getAllDismissal', {queryStringParameters:{
          classID: classID
        }});
        var newData = apiData.data
        setData1(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '6'){
      try {
        const apiData = await API.get('api55db091d', '/classp6/getAllDismissal', {queryStringParameters:{
          classID: classID
        }});
        var newData = apiData.data
        setData1(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  const getCCATodayDismissalTime = async (ccaSubject) => {
    if(ccaSubject === 'Badminton'){
      try {
        const apiData = await API.get('api55db091d', '/badminton/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCATodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Basketball'){
      try {
        const apiData = await API.get('api55db091d', '/basketball/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCATodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Netball'){
      try {
        const apiData = await API.get('api55db091d', '/netball/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCATodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Soccer'){
      try {
        const apiData = await API.get('api55db091d', '/soccer/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCATodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  const getTodayDismissalTime = async (classID) => {
    if(classID.charAt(0) === '1'){
      try {
        const apiData = await API.get('api55db091d', '/class/getspecificclass', {queryStringParameters:{
          ClassID: classID,
          Day: day,
        }});
        var newData = apiData.data
        setTodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '2'){
      try {
        const apiData = await API.get('api55db091d', '/classp2/getspecificclass', {queryStringParameters:{
          ClassID: classID,
          Day: day,
        }});
        var newData = apiData.data
        setTodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '3'){
      try {
        const apiData = await API.get('api55db091d', '/classp3/getspecificclass', {queryStringParameters:{
          ClassID: classID,
          Day: day,
        }});
        var newData = apiData.data
        setTodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '4'){
      try {
        const apiData = await API.get('api55db091d', '/classp4/getspecificclass', {queryStringParameters:{
          ClassID: classID,
          Day: day,
        }});
        var newData = apiData.data
        setTodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '5'){
      try {
        const apiData = await API.get('api55db091d', '/classp5/getspecificclass', {queryStringParameters:{
          ClassID: classID,
          Day: day,
        }});
        var newData = apiData.data
        setTodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if (classID.charAt(0) === '6'){
      try {
        const apiData = await API.get('api55db091d', '/classp6/getspecificclass', {queryStringParameters:{
          ClassID: classID,
          Day: day,
        }});
        var newData = apiData.data
        setTodayDismissal(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  if (doneLoading) {
    data.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }

  if (doneLoading2) {
    data1.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }

  const checkTodayDismissalTime = () => {
    if(ccaTodayDismissal.length == 0){
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {todayDismissal.map(data => {
            return(
              <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                <Text style={styles.classText}>Dismissal Reminder:</Text>
                <Text style={styles.classText}></Text>
                <Text style={styles.classText}>Your child will be dismissed on {data.EndTime}</Text>
              </View>
            )
        })}
        </ScrollView>
      )
    } else if (ccaTodayDismissal.length > 0) {
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {ccaTodayDismissal.map(data => {
            return(
              <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                <Text style={styles.classText}>Dismissal Reminder:</Text>
                <Text style={styles.classText}></Text>
                <Text style={styles.classText}>Your child will be dismissed on {data.EndTime}</Text>
              </View>
            )
        })}
        </ScrollView>
      )
    }
  }

  const ifIsWeekend = () => {
    if (day === 'Saturday' || day === 'Sunday'){
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
              <View style={[styles.card, styles.cardElevated]}>
                <Text style={styles.classText}>Today is {day}.</Text>
                <Text style={styles.classText}>Have a good rest.</Text>
              </View>
          </ScrollView>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.background}>

      <View style={styles.dismissalTimeContainer}>
          <Text style={styles.headerText}>Class Dismissal Time:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
              {data1?.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Class: {data.ClassID}</Text>
                    <Text style={styles.classText}>Day: {data.Day}</Text>
                    <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
                  </View>
                )
              })}
          </ScrollView>
      </View>

        <View style={styles.ccaTimeContainer}>
          <Text style={styles.headerText}>CCA Dismissal Time:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
            {data?.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>{ccaSubject}</Text>
                    <Text style={styles.classText}>Day: {data.Day}</Text>
                    <Text style={styles.classText}>Start Time: {data.StartTime}</Text>
                    <Text style={styles.classText}>End Time: {data.EndTime}</Text>
                  </View>
                )
            })}
          </ScrollView>
        </View>

        <View style={styles.reminderContainer}>
        <Text style={styles.headerText}>Dismissal Reminder:</Text>
            
          {checkTodayDismissalTime()}
          {ifIsWeekend()}

        </View>
        
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#B3EAE5',
  },

  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.65,
    height: height * 0.16,
    width: width * 0.60,
    height: height * 0.15,
    borderRadius: 4,
    margin: width * 0.05,
    backgroundColor: '#FFFFFF',
  },
  cardElevated: {
    elevation: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  dismissalTimeContainer: {
    paddingTop: height * 0.05,
  },

  ccaTimeContainer:{
    paddingTop: height * 0.03,
    paddingBottom:0,
  },

  reminderContainer:{
    paddingTop: height * 0.03,
  },

  welcomeText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
  },
  headerText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.05,
    color: 'black',
  },
  classText: {
    fontSize: height * 0.018,
    color: '#1DC1B1',
  },
  scrollContent: {
    alignItems: 'center',
  },

});
export default DismissalPage;
