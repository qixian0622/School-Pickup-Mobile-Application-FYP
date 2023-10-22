import React, { useEffect, useState,useRef} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import moment from 'moment/moment';
import { render } from 'react-dom';
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

const CCAHomePage = () => {


  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));
  const [cca, setCCA] = useState("");
  const [ccaSchedule, setCCASchedule] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);
  const [tempYtd, setTempYtd] = useState(new Date());
  const [yesterday, setYesterday] = useState();
  const [ytdAbsent, setYtdAbsent] = useState([]);
  const [listofchilds, setlistofchilds] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }

  useEffect(() => {
    getCurrectUser();
    setYesterdayDate();
    registerForPushNotificationsAsync()
  },[]);

  useEffect(() => {
    if(listofchilds && cca)
    {
      registerForPushNotificationsAsync(listofchilds,cca)
    }
  },[listofchilds,cca]);

  useEffect(() => {
    if(uid){
      getData(uid);
    }
  },[uid])

  useEffect(() => {
    if(cca){
      getCCASchedule(cca);
      getYesterdayAbsentees(cca);
      getchildcca(cca)
      setDoneLoading(true);
    }
  },[cca])

  const setYesterdayDate = () => {
    tempYtd.setDate(tempYtd.getDate() - 1);
    setYesterday(tempYtd.toISOString().substring(0, 10));
  }

  const getData = async (uid) => {
    try {
        const apiData = await API.get('api55db091d', '/ccacoach/getSubject',{queryStringParameters:{
          TeacherID: uid
        }})
        setCCA(apiData.data[0]?.CCAName)
      } catch (error) {
        console.error(error);
    }
  }

  async function registerForPushNotificationsAsync(listofchilds,cca) {
    let ccateachertoken;
  
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
      ccateachertoken = (await Notifications.getExpoPushTokenAsync({projectId: Constants.expoConfig.extra.eas.projectId})).data;
      // Debugging
      // console.log(ccateachertoken)

      if(ccateachertoken)
      {
        listofchilds?.map(e => {
          const res = firebase
          .firestore()
          .collection("CCA")
          .doc(e.ChildID)
          .set({cca},{merge:true});
        })
       
      } 
  }

  const sendPushNotificationtoAllUsers = async (cca) => 
  {
    // Debugging
    // console.log(cca)
    if(cca != "")
    {
      const users = await firebase.firestore().collection("CCA").where("cca",'==',cca).get()
      users.docs.map(user =>  
        sendPushNotification(user.data().Guardiantoken))
    }
   
  }

  const sendPushNotification = async (token) =>  {
    // For Debugging purposes
    // console.log('sendPushNotification Token: '+token)
    const message = {
      to: token,
      sound: 'default',
      title: 'CCA End Session Notification',
      body: 'Your Child has been dismissed from CCA',
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

  const getCCASchedule = async (cca) => {
    if(cca === 'Badminton'){
      try {
        const apiData = await API.get('api55db091d', '/badminton/getTodayEndTime',{queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(cca === 'Basketball'){
      try {
        const apiData = await API.get('api55db091d', '/basketball/getTodayEndTime',{queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(cca === 'Netball'){
      try {
        const apiData = await API.get('api55db091d', '/netball/getTodayEndTime',{queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    } else if(cca === 'Soccer'){
      try {
        const apiData = await API.get('api55db091d', '/soccer/getTodayEndTime',{queryStringParameters:{
          Day: day
        }});
        var newData = apiData.data
        setCCASchedule(newData)
      } catch (error) {
        console.error(error.response.data);
      }
    }
  }

  const getYesterdayAbsentees = async (cca) => {
    try {
      const apiData = await API.get('api55db091d', '/ccaAttendance/getAbsent',{queryStringParameters:{
        Subject: cca,
        Date1: yesterday,
        Attendance: 'Absent',
      }});
      var newData = apiData.data
      setYtdAbsent(newData)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const getchildcca = async(cca) => {
    try {
      const apiData = await API.get('api55db091d', '/childcca/getchildid',{queryStringParameters:{
        CCA:cca
      }});
      var newData = apiData.data
      setlistofchilds(newData)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  if(doneLoading){
    ccaSchedule.sort((a,b) => (a.ID > b.ID) ? 1 : -1)
    ytdAbsent.sort((a,b) => (a.ID > b.ID) ? 1 : -1)
  }


  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const handleUserIconClick = () => {
    //navigate to setting page
    navigation.navigate('CCAProfile');
  };
  //End Class message 
  const handleEndClass = (cca) => {
    Alert.alert('End CCA Session', 'Are you sure to end session now?', [
      {
        text: 'Yes',
        onPress: () => {sendPushNotificationtoAllUsers(cca);Alert.alert('Successful','All guardians have been notified!')},
      },      
      {
        text: 'Cancel',
      },
    ]);
  };

  const checkTodayClass = () => {
    if (ccaSchedule.length > 0){
      return (
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {ccaSchedule?.map(data => {
          return(
            <View style={[styles.card, styles.cardElevated]} key={data.ID}>
              <Text style={styles.classText}>Subject: {cca}</Text>
              <Text style={styles.classText}>Day: {data.Day}</Text>
              <Text style={styles.classText}>Time: {data.StartTime} - {data.EndTime}</Text>
            </View>
          )
        })}
        </ScrollView>
      )
    } else if (day === 'Sunday' || day === 'Saturday'){
        return (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.classText}>No class for today,</Text>
            <Text style={styles.classText}>have a good rest!</Text>
            <Text style={styles.classText}>Today: {day}</Text>
          </View>
        )
    } else if (ccaSchedule.length == 0){
      return (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No class for today,</Text>
          <Text style={styles.classText}>have a good rest!</Text>
          <Text style={styles.classText}>Today: {day}</Text>
        </View>
      )
    }
  }

  const checkTodayEndTime = () => {
    if (ccaSchedule.length > 0){
      return (
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {ccaSchedule?.map(data => {
          return(
            <View style={[styles.card, styles.cardElevated]} key={data.ID}>
              <Text style={styles.classText}>Subject: {cca}</Text>
              <Text style={styles.classText}>Dismissal Time: {data.EndTime}</Text>
            </View>
          )
        })}
        </ScrollView>
      )
    } else if (day === 'Saturday' || day === 'Sunday'){
        return (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.classText}>No class for today,</Text>
            <Text style={styles.classText}>have a good rest!</Text>
            <Text style={styles.classText}>Today: {day}</Text>
          </View>
        )
    } else if (ccaSchedule.length == 0){
      return (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No class for today,</Text>
          <Text style={styles.classText}>have a good rest!</Text>
          <Text style={styles.classText}>Today: {day}</Text>
        </View>
      )
    }
  }

  const checkAbsentees = () => {
    if (ytdAbsent.length > 0){
      return (
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {ytdAbsent?.map(data => {
          return(
            <View style={[styles.card, styles.cardElevated]} key={data.ID}>
              <Text style={styles.classText}>Name: {data.CName}</Text>
            </View>
          )
        })}
        </ScrollView>
      )
    } else{
        return (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.classText}>No absentees yesterday.</Text>
            <Text style={styles.classText}>Yesterday: {yesterday}</Text>
          </View>
        )
    }
  }

  return (
    <BackgroundColor>
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
          <Ionicons name="person-outline" size={35} color="black" />
        </TouchableOpacity>

        <View style={styles.scrollContainer}>
          <Text style={styles.headerText}>Upcoming Classes:</Text>
          
            {checkTodayClass()}
            
        </View>

        <View style={styles.dismissalTimeContainer}>
            <Text style={styles.headerText}>Class Dismissal Timing</Text>

            {checkTodayEndTime()}

        </View>


        <View style={styles.absentContainer}>
          <Text style={styles.headerText}>Absentees Yesterday:</Text>
            {checkAbsentees()}
        </View>


        <TouchableOpacity style={styles.endClassButton} onPress={() => handleEndClass(cca)}>
          <Ionicons name="checkmark" size={32} color="#1DC1B1" />
        </TouchableOpacity>
        <Text style={styles.endClassText}>End Class</Text>
      </View>
    </View>
    </BackgroundColor>
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
    height:'23%',
  },

  dismissalTimeContainer: {
    marginTop:'1%',

    height:'23%',

  },

  absentContainer: {
    marginTop:'1%',

    height:'16%',
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
    marginBottom: 0,
    paddingLeft: height * 0.05,
    paddingBottom: 0 ,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.15, 
  },
});
export default CCAHomePage;