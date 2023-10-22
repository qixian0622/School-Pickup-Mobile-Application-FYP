import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import React, { useEffect, useState,useRef} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../BackgroundColor';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';
import { set } from 'react-native-reanimated';
import { Logs } from 'expo';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAczBG_AOiQc8QHEHWFKl2d2Aql5KPqFJE",
  authDomain: "jracademy-86ecd.firebaseapp.com",
  databaseURL: "https://jracademy-86ecd-default-rtdb.firebaseio.com/",
  projectId: "jracademy-86ecd",
  storageBucket: "jracademy-86ecd.appspot.com",
  messagingSenderId: "902576728549",
  appId: "1:902576728549:android:7aaf59785bdad825ad670c",
};

firebase.initializeApp(firebaseConfig);
Logs.enableExpoCliLogging();
Amplify.configure(awsExports);


const TeachHomePage = () => {

  const [username,setUsername] = useState();
  const [uid,setUID] = useState("");
  const [role,setRole] = useState("");

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
    setRole(attributes.profile)
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  const [english,setEnglish] = useState([]);
  const [mt,setMT] = useState([]);
  const [math,setMath] = useState([]);
  const [adMath,setAdMath] = useState([]);
  const [science,setScience] = useState([]);
  const [music,setMusic] = useState([]);
  const [art,setArt] = useState([]);
  const [ss,setSS] = useState([]);
  const [pe,setPE] = useState([]);

  const [data,setData] = useState([]);
  const [data1,setData1] = useState([]);
  const [p1EndTime,setP1EndTime] = useState([]);
  const [p2EndTime,setP2EndTime] = useState([]);
  const [p3EndTime,setP3EndTime] = useState([]);
  const [p4EndTime,setP4EndTime] = useState([]);
  const [p5EndTime,setP5EndTime] = useState([]);
  const [p6EndTime,setP6EndTime] = useState([]);
  const [yesterday, setYesterday] = useState(new Date());
  const [prevDate, setPrevDate] = useState();
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));
  const [teachingSubject, setTeachingSubject] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [doneLoading,setDoneLoading] = useState(false);
  const [classID, setClassID] = useState("");
  const [listofchilds, setlistofchilds] = useState([]);
  const [guardian, setguardian] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const setPreviousDate = () => {
    yesterday.setDate(yesterday.getDate() - 1);
    setPrevDate(yesterday.toISOString().substring(0, 10));
  }
  useEffect(() => {
    getCurrectUser();
    setPreviousDate();
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response.notification.request.content.data.CName); // Get the Child Name From Notification
    });
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
   },[]);

   useEffect(() => {
    if(listofchilds && username && classID)
    {
      registerForPushNotificationsAsync(listofchilds,username,classID)
    }
   },[listofchilds,username,classID]);



   useEffect(() => {
    if(uid){
      getTeachingSubject(uid);
    }
   },[uid])

   useEffect(() => {
    if(teachingSubject){
      getUpcomingClasses(uid);
      setIsLoading(true);
    }
   },[teachingSubject])

   useEffect(() => {
    if(classID){
      getYtdAbsent(classID);
      getEndTime(classID);
      getchilds(classID);
      /* getguardianinfo(classID); */
    }
   },[classID])

   useEffect(() => {
    if(role === 'Teacher'){
      getTeacherEndTime();
      setDoneLoading(true);
    } else if (role === 'Form Teacher'){
      getClassID(uid)
    }
   },[role])


 async function registerForPushNotificationsAsync(listofchilds,formteachername,ClassID) {
    let formteachertoken;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      formteachertoken = (await Notifications.getExpoPushTokenAsync({projectId: Constants.expoConfig.extra.eas.projectId})).data;

       if(formteachertoken)
      {
        listofchilds.map(e => {
          const res = firebase
          .firestore()
          .collection("Alerts")
          .doc(e.UserID)
          .set({formteachertoken,formteachername},{merge:true});
        })

        listofchilds.map(e => {
          const res = firebase
          .firestore()
          .collection("Users")
          .doc(e.UserID)
          .set({ClassID},{merge:true});
        })
      
      } 
  }


  const sendPushNotification = async (token) =>  {
    console.log('sendPushNotification Token: '+token)
    const message = {
      to: token,
      sound: 'default',
      title: 'End Class Notification',
      body: 'Your Child has been dismissed from Class',
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  
  const sendPushNotificationtoAllUsers = async (classID) => 
  {
    const users = await firebase.firestore().collection("Users").where("ClassID",'==',classID).get()
    users.docs.map(user =>  
      sendPushNotification(user.data().Guardiantoken))
  }
  const getchilds = async(classid)  => 
  {
    if(classid != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/child/getchilds', {queryStringParameters:{
          ClassID: classid,
        }});
        setlistofchilds(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
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
        const apiData = await API.get('api55db091d', '/mothertongue/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setMT(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundEnglishLanguage){
      try {
        const apiData = await API.get('api55db091d', '/english/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setEnglish(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundMathematics){
      try {
        const apiData = await API.get('api55db091d', '/math/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setMath(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundAdMath){
      try {
        const apiData = await API.get('api55db091d', '/advancedmath/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setAdMath(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundArt){
      try {
        const apiData = await API.get('api55db091d', '/art/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setArt(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundScience){
      try {
        const apiData = await API.get('api55db091d', '/science/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setScience(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundMusic){
      try {
        const apiData = await API.get('api55db091d', '/music/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setMusic(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundPE){
      try {
        const apiData = await API.get('api55db091d', '/physicaleducation/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setPE(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    if(foundSS){
      try {
        const apiData = await API.get('api55db091d', '/socialstudies/getTodayClasses', {queryStringParameters:{
          TeacherID: uid,
          Date: date.toISOString().substring(0, 10)
        }});
        setSS(apiData.data)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  const getClassID = async (uid) => {
    try {
      const apiData = await API.get('api55db091d','/teacherclass/getClassID', {queryStringParameters:{
        TeacherID:uid
      }})
      setClassID(apiData.data[0]?.ClassID)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  //Get absentees yesterday
  const getYtdAbsent = async (classID) => {
    try {
      const apiData = await API.get('api55db091d','/attendance/getAbsent', {queryStringParameters:{
        Date1: yesterday.toISOString().substring(0, 10),
        Attendance: "Absent",
        ClassID: classID
      }})
      setData1(apiData.data)
    } catch (error) {
      console.error(error.response.data);
    }
  }
  
  // Get all dismissal time
  const getEndTime = async (classID) => {
    if(role === 'Form Teacher'){
      if(classID.charAt(0) === '1'){
        const apiData = await API.get('api55db091d', '/class/getspecificclass', {queryStringParameters:{
          Day:day,
          ClassID: classID
        }})
        var newDataP1 = apiData.data
        setP1EndTime(newDataP1)
      } else if (classID.charAt(0) === '2'){
        const apiData = await API.get('api55db091d', '/classp2/getspecificclass', {queryStringParameters:{
          Day:day,
          ClassID: classID
        }})
        var newDataP1 = apiData.data
        setP1EndTime(newDataP1)
      } else if(classID.charAt(0) === '3'){
        const apiData = await API.get('api55db091d', '/classp3/getspecificclass', {queryStringParameters:{
          Day:day,
          ClassID: classID
        }})
        var newDataP1 = apiData.data
        setP1EndTime(newDataP1)
      } else if (classID.charAt(0) === '4'){
        const apiData = await API.get('api55db091d', '/classp4/getspecificclass', {queryStringParameters:{
          Day:day,
          ClassID: classID
        }})
        var newDataP1 = apiData.data
        setP1EndTime(newDataP1)
      } else if(classID.charAt(0) === '5'){
        const apiData = await API.get('api55db091d', '/classp5/getspecificclass', {queryStringParameters:{
          Day:day,
          ClassID: classID
        }})
        var newDataP1 = apiData.data
        setP1EndTime(newDataP1)
      } else if (classID.charAt(0) === '6'){
        const apiData = await API.get('api55db091d', '/classp6/getspecificclass', {queryStringParameters:{
          Day:day,
          ClassID: classID
        }})
        var newDataP1 = apiData.data
        setP1EndTime(newDataP1)
      }
    } else {
      try {
        // Pri 1
        const apiDataP1 = await API.get('api55db091d', '/class/getEndTime', {queryStringParameters:{
          Day:day
        }})
        var newDataP1 = apiDataP1.data
        setP1EndTime(newDataP1)
        // Pri 2
        const apiDataP2 = await API.get('api55db091d', '/classp2/getEndTime', {queryStringParameters:{
          Day:day
        }});
        var newDataP2 = apiDataP2.data
        setP2EndTime(newDataP2)
        // Pri 3
        const apiDataP3 = await API.get('api55db091d', '/classp3/getEndTime', {queryStringParameters:{
          Day:day
        }});
        var newDataP3 = apiDataP3.data
        setP3EndTime(newDataP3)
        // Pri 2
        const apiDataP4 = await API.get('api55db091d', '/classp4/getEndTime', {queryStringParameters:{
          Day:day
        }});
        var newDataP4 = apiDataP4.data
        setP4EndTime(newDataP4)
        // Pri 2
        const apiDataP5 = await API.get('api55db091d', '/classp5/getEndTime', {queryStringParameters:{
          Day:day
        }});
        var newDataP5 = apiDataP5.data
        setP5EndTime(newDataP5)
        // Pri 6
        const apiDataP6 = await API.get('api55db091d', '/classp6/getEndTime', {queryStringParameters:{
          Day:day
        }});
        var newDataP6 = apiDataP6.data
        setP6EndTime(newDataP6)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }
  

  const getTeacherEndTime = async () => {
    try {
      // Pri 1
      const apiDataP1 = await API.get('api55db091d', '/class/getEndTime', {queryStringParameters:{
        Day:day
      }})
      var newDataP1 = apiDataP1.data
      setP1EndTime(newDataP1)
      // Pri 2
      const apiDataP2 = await API.get('api55db091d', '/classp2/getEndTime', {queryStringParameters:{
        Day:day
      }});
      var newDataP2 = apiDataP2.data
      setP2EndTime(newDataP2)
      // Pri 3
      const apiDataP3 = await API.get('api55db091d', '/classp3/getEndTime', {queryStringParameters:{
        Day:day
      }});
      var newDataP3 = apiDataP3.data
      setP3EndTime(newDataP3)
      // Pri 2
      const apiDataP4 = await API.get('api55db091d', '/classp4/getEndTime', {queryStringParameters:{
        Day:day
      }});
      var newDataP4 = apiDataP4.data
      setP4EndTime(newDataP4)
      // Pri 2
      const apiDataP5 = await API.get('api55db091d', '/classp5/getEndTime', {queryStringParameters:{
        Day:day
      }});
      var newDataP5 = apiDataP5.data
      setP5EndTime(newDataP5)
      // Pri 6
      const apiDataP6 = await API.get('api55db091d', '/classp6/getEndTime', {queryStringParameters:{
        Day:day
      }});
      var newDataP6 = apiDataP6.data
      setP6EndTime(newDataP6)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  // Get Teaching Subject
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

  // IF case for Saturday and Sunday
  const checkWeekDay = () => {
    if (day === 'Saturday' || day === 'Sunday'){
      return (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No class for today,</Text>
          <Text style={styles.classText}>have a good rest!</Text>
          <Text style={styles.classText}>Today: {day}</Text>
        </View>
      )
    }
  }

  const checkIsEmpty = () => {
     if(data1.length == 0){
      return(
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No absentees yesterday!</Text>
          <Text style={styles.classText}>Yesterday: </Text>
          <Text style={styles.classText}> {prevDate} {day}</Text>
        </View>
      )
    }
  }

  if(isLoading){
    math.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    english.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    adMath.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    mt.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    science.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    pe.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    ss.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    music.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    art.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }

  if(doneLoading){
    p1EndTime.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    p2EndTime.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    p3EndTime.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    p4EndTime.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    p5EndTime.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
    p6EndTime.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }
  

  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const handleUserIconClick = () => {
    //navigate to setting page
    navigation.navigate('TeachProfile');
  };
  //End Class message 
  const handleEndClass = (classID) => {
    if(role === 'Form Teacher'){
      Alert.alert('End Class', 'Are you sure to end class now?', [

        {
          text: 'Yes',
          onPress: () => {sendPushNotificationtoAllUsers(classID);Alert.alert('Successful','All guardians have been notified!')},
         
        },      
        {
          text: 'Cancel',
        },
      ]);
    } else {
      Alert.alert("Action not permitted", "You don't have the permission.")
    }

    
    
  };

  const checkAbsentees = () => {
    if(role === 'Form Teacher'){
      return(
        <View style={styles.absentContainer}>
          <Text style={styles.headerText}>Absentees Yesterday:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
            {checkIsEmpty()}
            {data1.map(items => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={items.ChildID}>
                    <Text style={styles.classText}>Name: {items.CName}</Text>
                    <Text style={styles.classText}>Absent on: {items.Date1}</Text>
                  </View>
                )
              })}
          </ScrollView>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.topLeft}>
          <Text style={styles.welcomeText}> {username}</Text>
        </View>

        
        <View style={styles.imageContainer}>
          <Image
            source={require('../../Genericscreens/Image/logo.png')} 
            style={styles.image}
            resizeMode="contain" 
          />
        </View>
        
        <TouchableOpacity style={styles.topRight} onPress={handleUserIconClick}>
          <Ionicons name="person-outline" size={35} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.scrollContainer}>
          <Text style={styles.headerText}>Upcoming classes for today:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
             {english.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>English</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}

              {mt.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Mother Tongue</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}

              {adMath.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Advanced Mathematics</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}

              {math.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Mathematics</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}  

              {science.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Science</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}  

              {music.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Music</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}  

              {art.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Art</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}  

              {pe.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Physical Education</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })} 

              {ss.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Social Studies</Text>
                    <Text style={styles.classText}>{data.Date}</Text>
                    <Text style={styles.classText}>{data.Time}</Text>
                    <Text style={styles.classText}>{data.ClassID}</Text>
                  </View>
                )
              })}
            
          </ScrollView>
        </View>

        <View style={styles.dismissalTimeContainer}>
          <Text style={styles.headerText}>Dismissal Time:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
              {checkWeekDay()}
              {p1EndTime.map(data => {
                  return(
                    <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                      <Text style={styles.classText}>Class: {data.ClassID}</Text>
                      <Text style={styles.classText}>Day: {data.Day}</Text>
                      <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
                    </View>
                  )
                })}

              {p2EndTime.map(data => {
                  return(
                    <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                      <Text style={styles.classText}>Class: {data.ClassID}</Text>
                      <Text style={styles.classText}>Day: {data.Day}</Text>
                      <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
                    </View>
                  )
                })}

              {p3EndTime.map(data => {
                  return(
                    <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                      <Text style={styles.classText}>Class: {data.ClassID}</Text>
                      <Text style={styles.classText}>Day: {data.Day}</Text>
                      <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
                    </View>
                  )
                })}

              {p4EndTime.map(data => {
                  return(
                    <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                      <Text style={styles.classText}>Class: {data.ClassID}</Text>
                      <Text style={styles.classText}>Day: {data.Day}</Text>
                      <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
                    </View>
                  )
                })}

              {p5EndTime.map(data => {
                  return(
                    <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                      <Text style={styles.classText}>Class: {data.ClassID}</Text>
                      <Text style={styles.classText}>Day: {data.Day}</Text>
                      <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
                    </View>
                  )
                })}

              {p6EndTime.map(data => {
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


        {checkAbsentees()}


        <TouchableOpacity style={styles.endClassButton} onPress={() => handleEndClass(classID)}>
            <Ionicons name="checkmark" size={32} color="#1DC1B1" />
          </TouchableOpacity>
          <Text style={styles.endClassText}>End Class</Text>
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
  topLeft: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
  },
  topRight: {
    position: 'absolute',
    top: height * 0.07,
    right: width * 0.05,
    zIndex: 1,
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
  scrollContainer: {
    marginTop:0,
    height:'21%',
  },

  dismissalTimeContainer: {
    marginTop:'8%',

    height:'20%',

  },

  absentContainer: {
    marginTop:'8%',

    height:'17%',
  },

  welcomeText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
  },
  headerText: {
    fontSize: height * 0.026,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.05,
    color: 'black',
  },
  classText: {
    fontSize: height * 0.02,
    color: '#1DC1B1',
  },
  scrollContent: {
    alignItems: 'center',
  },
  endClassButton: {
    position: 'absolute',
    bottom: "4.5%",
    right: width * 0.026,
    width: width * 0.17,
    height: width * 0.105,
    borderRadius: width * 0.1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endClassText: {
    position: 'absolute',
    bottom: height * 0.007,
    right: width * 0.01,
    fontWeight: 'bold',
    fontSize: height * 0.023,
    color: '#FFFFFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom:height* 0,
    paddingLeft: height * 0.05,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.15, 
  },
});
export default TeachHomePage;