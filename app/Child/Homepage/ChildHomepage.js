import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import * as Location from 'expo-location';
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
Amplify.configure(awsExports);

const ChildHomePage = () => {

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();

  const [classID,setClassID] = useState();
  const [childName,setChildName] = useState();
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));

  const [data,setData] = useState([]);
  const [firstLoading,setFirstLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [yesterdayAttendance, setYesterdayAttendance] = useState([]);
  const today = new Date();
  const [tempYtd, setTempYtd] = useState(new Date());
  const [yesterday, setYesterday] = useState();
  const [showTimer, setShowTimer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [emergency, setEmergency] = useState(false)
  const [teacherid, setteacherid] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();


  
  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }
  
  useEffect(() =>{
    setYesterdayDate();
    getCurrectUser();
    registerForPushNotificationsAsync()
    getPermissions();
  },[]);

  useEffect(() =>{
    if(uid){
      getData(uid);
      if(day === 'Saturday' || day === 'Sunday'){

      }else{
        getAttendanceRecord(uid);
      }
    }
  },[uid]);

  useEffect(() =>{
    if(classID){
      getTodayDismissalTime();
      setFirstLoading(true);
      getteacherid(classID)
    }
  },[classID]);
  
  const setYesterdayDate = () => {
    tempYtd.setDate(tempYtd.getDate() - 1);
    setYesterday(tempYtd.toISOString().substring(0, 10));
  }

  // GET coords
  const getPermissions = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      console.log('Permission denied')
      return;
    }
    
    let currentLocation = await Location.getCurrentPositionAsync({});

    // Uncomment for real-world coords
    // setLatitude(currentLocation.coords.latitude)
    // setLongitude(currentLocation.coords.longitude)

    // Hardcode for testing purposes
    setLatitude(1.329091)
    setLongitude(103.776942)
  }

  // GET CHILD's CLASS ID
  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getmyrecords', {queryStringParameters:{
        CID: uid
      }});
      setClassID(apiData.data[0]?.ClassID);
      setChildName(apiData.data[0]?.CName);
    } catch (error) {
      console.error(error.response.data);
    }
  }
  const getteacherid = async (classid) => {
    if(classid != "")
    {
      try {
        const apiData = await API.get('api55db091d', '/teacherclass/getteacherid', {queryStringParameters:{
          ClassID: classid
        }});
        setteacherid(apiData.data[0]?.TeacherID)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    
  }

  // Register the Notification for the Child
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
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
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })).data
    }
  }

  const sendPushNotification = async (token,message1,username) =>  {
    console.log(token)
    const message = {
      to: token,
      sound: 'default',
      title: 'Emergency Notification',
      body: message1,
      data: { CName: username }
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    
    })
  }

  const sendPushNotificationtoAllUsers = async (ChildID,username) => 
  {
    const message = `Child ${username} has pressed the emergency button`
    if(ChildID != "")
    {
      const users = await firebase.firestore().collection("Alerts").doc(String(ChildID)).get()
      sendPushNotification(users.data().Guardiantoken,message,username)
      sendPushNotification(users.data().formteachertoken,message,username)
    }
   
  }
  // GET TODAY DISMISSAL TIME
  const getTodayDismissalTime = async () => {
    if(classID.charAt(0) === '1'){
      try {
        const apiData = await API.get('api55db091d', '/class/getTodaySchedule', {queryStringParameters:{
          ClassID: classID,
          Day: day,
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
          Day: day,
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
          Day: day,
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
          Day: day,
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
          Day: day,
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
          Day: day,
        }});
        var newData = apiData.data
        setData(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  // GET TODAY ATTENDANCE
  const getAttendanceRecord = async (uid) => {
    // For Today
    try {
      const apiData = await API.get('api55db091d', '/attendance/getByChildIDAndDate', {queryStringParameters:{
        ChildID: uid,
        Date1: today.toISOString().substring(0, 10)
      }});
      setTodayAttendance(apiData.data);
    } catch (error) {
      console.error(error.response.data);
    }

    // For Yesteday
    try {
      const apiData = await API.get('api55db091d', '/attendance/getByChildIDAndDate', {queryStringParameters:{
        ChildID: uid,
        Date1: yesterday
      }});
      setYesterdayAttendance(apiData.data);
    } catch (error) {
      console.error(error.response.data);
    }
  }

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

  const getChildLocation = async () => {
    try {
      const apiData = await API.post('api55db091d', '/geolocation', {body:{
        UserID: uid,
        CName: childName,
        Date1: today.toISOString().substring(0, 10),
        Time1: moment(date).format('hh:mm a'),
        Longtitude: parseFloat(longitude),
        Latitude: parseFloat(latitude)
      }});
    } catch (error) {
      console.error(error.response.data);
    }
  }

   

  if(firstLoading){
    data.sort((a, b) => (a.ID > b.ID) ? 1 : -1);
  }



  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const handleUserIconClick = () => {
    //navigate to setting page
    navigation.navigate('ChildProfile');
  };

  if(showTimer){
    return (
      <View style={styles.background}>
        <View style={styles.timerStyle}>
          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={5}
            colors={['#00FF1F', '#DCFF00', '#FF0400']}
            colorsTime={[5, 3, 0]}
            onComplete={() => {setShowTimer(false); setEmergency(true);}}
          >
          {({ remainingTime }) => <Text style={{fontSize: 50}}>{remainingTime}</Text>}
          </CountdownCircleTimer>
          <Text></Text>
          <Button title='Cancel' onPress={() => {setIsPlaying(false); setShowTimer(false); setEmergency(false)}}></Button>
        </View>
      </View>
    )
  }

  if(emergency){
    getChildLocation();
    sendPushNotificationtoAllUsers(uid,username);
    Alert.alert('Emergency Situation Escalated!', 'Successfully notified related personnel!')
  }

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.topLeft}>
          <Text style={styles.welcomeText}>{username}</Text>
        </View>

        <View style={styles.imageContainer}>
      <Image
        source={require('../../Genericscreens/Image/logo.png')} 
        style={styles.image}
        resizeMode="contain" 
      />
    </View>


        <TouchableOpacity style={styles.topRight} onPress={handleUserIconClick}>
          <Ionicons name="person-outline" size={35} color="black" />
        </TouchableOpacity>
        <View style={styles.scrollContainer}>
          <Text style={styles.headerText}>Upcoming Classes Today:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
            {checkWeekDay()}
            {data.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Subject: {data.Subject}</Text>
                    <Text style={styles.classText}>Time: {data.StartTime} - {data.EndTime}</Text>
                    <Text style={styles.classText}>Day: {data.Day}</Text>
                  </View>
                )
              })}                                            
          </ScrollView>
        </View>
        <View style={styles.absentContainer}>
          <Text style={styles.headerText}>Attendance Record:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
            {checkIsEmpty()}
            {todayAttendance.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Today's attendance:</Text>
                    <Text style={styles.classText}>Attendance: {data.Attendance}</Text>
                    <Text style={styles.classText}>Date: {data.Date1}</Text>
                  </View>
                )
              })} 
                          
            {yesterdayAttendance.map(data => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                    <Text style={styles.classText}>Yesterday's attendance:</Text>
                    <Text style={styles.classText}>Attendance: {data.Attendance}</Text>
                    <Text style={styles.classText}>Date: {data.Date1}</Text>
                  </View>
                )
              })} 


          </ScrollView>
        </View>
        <TouchableOpacity style={styles.endClassButton} onPress={() => {setShowTimer(true); setIsPlaying(true)}}>
          <Ionicons name="alert-circle" size={80} color="red" />
        </TouchableOpacity>
        <Text style={styles.EmergencyText}>Emergency</Text>
        
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
    paddingTop: height * 0,
  },
  absentContainer: {
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
    fontSize: height * 0.02,
    color: '#1DC1B1',
  },
  scrollContent: {
    alignItems: 'center',
  },
  endClassButton: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.03,
  },
  EmergencyText: {
    position: 'absolute',
    bottom: height * 0.01,
    right: width * 0.03,
    fontWeight: 'bold',
    fontSize: height * 0.024,
    color: 'black',
  },
  timerStyle: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: 0,
    paddingLeft: height * 0.05,
    paddingBottom: 0 ,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.15, 
  },
});
export default ChildHomePage;