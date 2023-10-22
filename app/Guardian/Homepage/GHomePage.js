import React, { useEffect, useState,useRef} from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';
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


const HomePage = () => {

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

 

  getCurrectUser();
  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [data,setData] = useState([]);
  const [data1,setData1] = useState([]);
  const [ccaSchedule,setCCASchedule] = useState([]);
  const [classID, setClassID] = useState('');
  const [childName, setChildName] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));
  const [ccaSubject, setCCASubject] = useState();
  const [childID, setChildID] = useState();
  const [teacherid, setteacherid] = useState("");
  const [ccaendtime, setccaendtime] = useState("");
  const [ccadate, setccadate] = useState();
  const [normalendtime, setnormalendtime] = useState("");
  const [normaldate, setnormaldate] = useState();
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
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
    getData(uid);
  },[uid]);

  useEffect(() => {
    if(classID){
      getteacherid(classID)
      getTodayDismissalTime();
    }
  },[classID]);

  useEffect(() => {
    if(classID && uid && username && childID){
      registerForPushNotificationsAsync(uid,classID,username,childID)
    }
  },[uid,classID,username,childID]);

 

  useEffect(() => {
    if(childID){
      getAttendance();
    }
  },[childID]);

  useEffect(() => {
    if(childID){
      getCCASubject(childID);
    }
  },[childID]);

  useEffect(() => {
    if(ccaSubject){
      getCCASchedule(ccaSubject);
    }
  },[ccaSubject]);

  // GET CHILD's CLASS ID
  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getSpecific', {queryStringParameters:{
        GuardianID: uid
      }});
      setClassID(apiData.data[0]?.ClassID);
      setChildName(apiData.data[0]?.CName);
      setChildID(apiData.data[0]?.UserID);
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
        console.log(apiData.data[0]?.TeacherID)
        setteacherid(apiData.data[0]?.TeacherID)
      } catch (error) {
        console.error(error.response.data);
      }
    }
    
  }
  async function registerForPushNotificationsAsync(uid,ClassID,GName,childID) {
    let Guardiantoken;
  
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
      Guardiantoken = (await Notifications.getExpoPushTokenAsync({projectId: Constants.expoConfig.extra.eas.projectId})).data;
      console.log(Guardiantoken)
      
      if(Guardiantoken)
      {
        const res = await firebase
        .firestore()
        .collection("Users")
        .doc(childID)
        .set({Guardiantoken,ClassID},{merge:true});
        const res1 = await firebase
        .firestore()
        .collection("Alerts")
        .doc(childID)
        .set({Guardiantoken,GName},{merge:true});
        const res2 = await firebase
        .firestore()
        .collection("CCA")
        .doc(childID)
        .set({Guardiantoken,GName},{merge:true});

      } 
  }

  // GET TODAY DISMISSAL TIME
  const getTodayDismissalTime = async () => {
    if(classID.charAt(0) === '1'){
      try {
        const apiData = await API.get('api55db091d', '/class/getspecificclass', {queryStringParameters:{
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
        const apiData = await API.get('api55db091d', '/classp2/getspecificclass', {queryStringParameters:{
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
        const apiData = await API.get('api55db091d', '/classp3/getspecificclass', {queryStringParameters:{
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
        const apiData = await API.get('api55db091d', '/classp4/getspecificclass', {queryStringParameters:{
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
        const apiData = await API.get('api55db091d', '/classp5/getspecificclass', {queryStringParameters:{
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
        const apiData = await API.get('api55db091d', '/classp6/getspecificclass', {queryStringParameters:{
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

  // GET ATTENDANCE RECORD
  const getAttendance = async () => {
    try {
      const apiData = await API.get('api55db091d', '/attendance/getByChildIDAndDate', {queryStringParameters:{
        ChildID: childID,
        Date1: date.toISOString().substring(0, 10)
      }});
      var newData = apiData.data
      setData1(newData)
    } catch (error) {
      console.error(error.response.data);
    }
  }

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

  const getCCASchedule = async (ccaSubject) => {
    if(ccaSubject === 'Badminton'){
      try {
        const apiData = await API.get('api55db091d', '/badminton/getTodayEndTime' , {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Basketball'){
      try {
        const apiData = await API.get('api55db091d', '/basketball/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Netball'){
      try {
        const apiData = await API.get('api55db091d', '/netball/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(ccaSubject === 'Soccer'){
      try {
        const apiData = await API.get('api55db091d', '/soccer/getTodayEndTime', {queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  const checkTodayDismissalTime = () => {
    if(ccaSchedule.length == 0){
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {data.map(data => {
            return(
              <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                <Text style={styles.classText}>Today's dimissal time:</Text>
                <Text style={styles.classText}>ClassID: {data.ClassID}</Text>
                <Text style={styles.classText}>Day: {data.Day}</Text>
                <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
              </View>
            )
        })}
        </ScrollView>
      )
    } else if (ccaSchedule.length > 0) {
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {ccaSchedule.map(data => {
            return(
              <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                <Text style={styles.classText}>Today's dimissal time:</Text>
                <Text style={styles.classText}>CCA: {ccaSubject}</Text>
                <Text style={styles.classText}>Day: {data.Day}</Text>
                <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
              </View>
            ) 
        })}
        </ScrollView>
      )


      
    }
  }

  const checkTodayAttendance = () => {
    if (data1.length > 0) {
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {data1.map(data => {
            return(
              <View style={[styles.card, styles.cardElevated]} key={data.ID}>
                <Text style={styles.classText}>Class: {data.ClassID}</Text>
                <Text style={styles.classText}>Date: {data.Date1}</Text>
                <Text style={styles.classText}>Attendance: {data.Attendance}</Text> 
              </View>
            ) 
        })}
        </ScrollView>
      )
    } else {
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, styles.cardElevated]} key={data.ID}>
            <Text style={styles.classText}>No attendance found.</Text>
          </View>
        </ScrollView>
      )
    }
  }

  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const handleUserIconClick = () => {
    //navigate to setting page
    navigation.navigate('Profile');
  };
 
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
          <Text style={styles.headerText}>Dismissal Time:</Text>
            {checkTodayDismissalTime()}
        </View>
        <View style={styles.absentContainer}>
          <Text style={styles.headerText}>Your child's attendance for today:</Text>
          {checkTodayAttendance()}
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
    paddingTop: 0,
  },
  absentContainer: {
    paddingTop: height * 0.07,
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
  endClassButton: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.03,
    width: width * 0.2,
    height: width * 0.14,
    borderRadius: width * 0.1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endClassText: {
    position: 'absolute',
    bottom: height * 0.01,
    right: width * 0.03,
    fontWeight: 'bold',
    fontSize: height * 0.024,
    color: 'black',
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
export default HomePage;