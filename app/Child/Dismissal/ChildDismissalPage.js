import React, { useEffect, useId, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import {Amplify, API,Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';

Amplify.configure(awsExports);


const ChildDismissalPage = () => {
  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const [data,setData] = useState([]);
  const [data1,setData1] = useState([]);
  const [classID, setClassID] = useState("");
  const date = new Date();
  const [username,setUsername] = useState();
  const [uid,setUID] = useState();
  const [ccaSubject, setCCASubject] = useState();
  const [day, setDay] = useState(moment(date).format('dddd'));
  const [loadingDone, setLoadingDone] = useState(false);
  const [loadingDone1, setLoadingDone1] = useState(false);

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
      getCCASubject(uid);
    }
  },[uid]);

  useEffect(() => {
    if(classID){
      if(day === 'Saturday' || day === 'Sunday'){
        
      } else {
        getSubjects(classID)
        setLoadingDone(true);
      }
    }
  },[classID]);

  useEffect(() => {
    if(ccaSubject){
      if(day === 'Saturday' || day === 'Sunday'){
        
      } else {
        getCCASchedule(ccaSubject);
        setLoadingDone1(true);
      }
    }
  },[ccaSubject]);

    // GET CHILD's CLASS ID
  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getClassIDByUserID', {queryStringParameters:{
        UserID:uid
      }});
      setClassID(apiData.data[0]?.ClassID);
    } catch (error) {
      console.error(error.response.data);
    }
  }
    // GET CHILD's CCA CLASS
  const getCCASubject = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/childcca/getCCASubject', {queryStringParameters:{
        ChildID: uid
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

  if(loadingDone){
    data1.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }

  if(loadingDone1){
    data.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }

  const checkIsEmpty = () => {
    if (day === 'Saturday' || day === 'Sunday'){
      return (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No record for today,</Text>
          <Text style={styles.classText}>have a good rest!</Text>
          <Text style={styles.classText}>Today: {day}</Text>
        </View>
      )
    }
   }
   
    
  return (
  <BackgroundColor>
<View>

<ScrollView style={styles.container}>
    <Text style={styles.headerText}>Class Dismissal Timing:</Text>
    <ScrollView horizontal={true} style={styles.container}>
      {checkIsEmpty()}
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
    </ScrollView>

    <ScrollView style={styles.container}>
    <Text style={styles.headerText}>CCA Dismissal Timing:</Text>
    <ScrollView horizontal={true} style={styles.container}>
        {checkIsEmpty()}
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
    </ScrollView>
  
</View>
</BackgroundColor>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  headerText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.05,
    color: 'black',
  },
    sizeText:{
      fontSize:20,
    },
    card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: width * 0.60,
      height: height * 0.13,
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
  
    container: {
      padding: 8
    },
    scrollView: {
      backgroundColor: 'white',
      marginHorizontal: 20,
    },
    classText: {
      fontSize: height * 0.02,
      color: '#1DC1B1',
    },
  });

export default ChildDismissalPage;
