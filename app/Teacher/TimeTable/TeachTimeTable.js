import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import BackgroundColor from '../BackgroundColor';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import moment from 'moment/moment';

Amplify.configure(awsExports);

const TeachTimeTable = () => {

  const [uid,setUID] = useState();
  const [english,setEnglish] = useState([]);
  const [mt,setMT] = useState([]);
  const [math,setMath] = useState([]);
  const [adMath,setAdMath] = useState([]);
  const [science,setScience] = useState([]);
  const [music,setMusic] = useState([]);
  const [art,setArt] = useState([]);
  const [ss,setSS] = useState([]);
  const [pe,setPE] = useState([]);
  const [teachingSubject, setTeachingSubject] = useState([]);
  const date = new Date();

  getCurrectUser();
  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUID(attributes.sub)
  }

  useEffect(() => {
    getTeachingSubject(uid);
   },[uid])

   useEffect(() => {
    getUpcomingClasses(uid);
   },[teachingSubject])

  const getTeachingSubject = async (uid) => {
    try {
      const apiData = await API.get('api55db091d','/teacherSubject/getTeachingSubject', {queryStringParameters:{
        TeacherID:uid
      }})
      setTeachingSubject(apiData.data)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  //Get teacher upcoming class
  const getUpcomingClasses = async (uid) => {
    const foundMotherTongue = teachingSubject.some(element => {
      return element.Subject === 'Mother Tongue';
    });
    const foundEnglishLanguage = teachingSubject.some(element => {
      return element.Subject === 'English Language';
    });
    const foundMathematics = teachingSubject.some(element => {
      return element.Subject === 'Mathematics';
    });
    const foundAdMath = teachingSubject.some(element => {
      return element.Subject === 'Advanced Mathematics';
    });
    const foundArt = teachingSubject.some(element => {
      return element.Subject === 'Art';
    });
    const foundScience = teachingSubject.some(element => {
      return element.Subject === 'Science';
    });
    const foundMusic = teachingSubject.some(element => {
      return element.Subject === 'Music';
    });
    const foundPE = teachingSubject.some(element => {
      return element.Subject === 'Physical Education';
    });
    const foundSS = teachingSubject.some(element => {
      return element.Subject === 'Social Studies';
    });

    if(foundMotherTongue){
      try {
        const apiData = await API.get('api55db091d', '/mothertongue/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setMT(apiData.data)
        mt.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundEnglishLanguage){
      try {
        const apiData = await API.get('api55db091d', '/english/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setEnglish(apiData.data)
        english.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundMathematics){
      try {
        const apiData = await API.get('api55db091d', '/math/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setMath(apiData.data)
        math.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundAdMath){
      try {
        const apiData = await API.get('api55db091d', '/advancedmath/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setAdMath(apiData.data)
        adMath.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundArt){
      try {
        const apiData = await API.get('api55db091d', '/art/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setArt(apiData.data)
        art.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundScience){
      try {
        const apiData = await API.get('api55db091d', '/science/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setScience(apiData.data)
        science.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundMusic){
      try {
        const apiData = await API.get('api55db091d', '/music/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setMusic(apiData.data)
        music.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundPE){
      try {
        const apiData = await API.get('api55db091d', '/physicaleducation/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setPE(apiData.data)
        pe.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundSS){
      try {
        const apiData = await API.get('api55db091d', '/socialstudies/getclasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setSS(apiData.data)
        ss.sort((a, b) => (a.Date > b.Date) ? 1 : -1);
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  //use for navigating/redirect to other page
  const navigation = useNavigation();

  return (
<BackgroundColor>

<View>
<ScrollView style={styles.container}>
    <Text style={styles.headingText}>Timetable</Text>
    <ScrollView horizontal={true} style={styles.container}>
              {english.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>English</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}

              {mt.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Mother Tongue</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}

              {adMath.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Advanced Mathematics</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}

              {math.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Mathematics</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}  

              {science.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Science</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}  

              {music.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Music</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}  

              {art.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Art</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}  

              {pe.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Physical Education</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })} 

              {ss.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Social Studies</Text>
                    <Text style={styles.classText}>Date:{data.Date}</Text>
                    <Text style={styles.classText}>Time:{data.Time}</Text>
                    <Text style={styles.classText}>Class:{data.ClassID}</Text>
                  </View>
                )
              })}
    </ScrollView>

   
    </ScrollView>

    <Text style={styles.headingText}>Calendar:</Text>
    <Text></Text>
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
    card:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      minHeight: 100,
      borderRadius: 4,
      marginLeft: 25,
      marginRight: 25,
    },
    cardElevated:{
        backgroundColor: 'white',
        elevation: 4,
        shadowOffset: {
            width: 1,
            height: 1
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
      fontSize: 16,
      color: '#1DC1B1',
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

export default TeachTimeTable;


