import React, { useEffect, useState } from 'react';
import { View, Text,ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Calendar,} from 'react-native-calendars';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import moment from 'moment/moment';

Amplify.configure(awsExports);


const CCATimeTable = () => {

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();
  const [ccaSubject, setCCASubject] = useState();
  const [ccaSchedule, setCCASchedule] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false)

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }

  useEffect(() => {
    getCurrectUser();
  },[]);

  
  useEffect(() => {
    if(uid){
      getData(uid);
    }
  },[uid]);

  useEffect(() => {
    if(ccaSubject){
      getCCASchedule(ccaSubject);
      setDoneLoading(true);
    }
  },[ccaSubject]);
 
  const getData = async (uid) => {
    try {
        const apiData = await API.get('api55db091d', '/ccacoach/getSubject',{queryStringParameters:{
          TeacherID: uid
        }})
        setCCASubject(apiData.data[0]?.CCAName)
      } catch (error) {
        console.error(error);
    }
  }

  const getCCASchedule = async (ccaSubject) => {
    if(ccaSubject === 'Badminton'){
      try {
        const apiData = await API.get('api55db091d', '/badminton/getAllSchedule');
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Basketball'){
      try {
        const apiData = await API.get('api55db091d', '/basketball/getAllSchedule');
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Netball'){
      try {
        const apiData = await API.get('api55db091d', '/netball/getAllSchedule');
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Soccer'){
      try {
        const apiData = await API.get('api55db091d', '/soccer/getAllSchedule');
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  if(doneLoading){
    ccaSchedule.sort((a,b) => (a.ID > b.ID) ? 1 : -1)
  }




  //use for navigating/redirect to other page
  const navigation = useNavigation();

  return (
<BackgroundColor>

<View>
<ScrollView style={styles.container}>
    <Text style={styles.headingText}>Timetable</Text>
    <ScrollView horizontal={true} style={styles.container}>
      {ccaSchedule?.map(data => {
          return(
            <View style={[styles.card, styles.cardElevated]} key={data.ID}>
              <Text style={styles.classText}>Subject: {ccaSubject}</Text>
              <Text style={styles.classText}>Day: {data.Day}</Text>
              <Text style={styles.classText}>Time: {data.StartTime} - {data.EndTime}</Text>
            </View>
          )
        })}
    </ScrollView>

   
    </ScrollView>

    <View style={styles.calendar}>
        <Calendar  style={styles.calendartest}/>
    </View> 
  
</View>

</BackgroundColor>


  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    headingText: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingTop:'20%',
        color:'black',
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
  
    calendar:{
      //paddingLeft:20,
      //flex: 1,
      alignItems:'center',
      //width: "10%",
      //height:"10%",
    },
    classText: {
      color: '#1DC1B1',
      fontSize: 18
    },
    container: {
      padding: 8
    },
    scrollView: {
      backgroundColor: 'white',
      marginHorizontal: 20,
    },
    text: {
      fontSize: 42,
    },
  });

export default CCATimeTable;


