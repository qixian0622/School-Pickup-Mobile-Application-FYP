import React, { useEffect, useState,useRef} from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';

const HomePage = () => {

  

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();
  const [childID,setChildID] = useState();
  const [childName,setChildName] = useState();
  const [attendance,setAttendance] = useState([]);
  const date = new Date();
  const [doneLoading,setDoneLoading] = useState(false);

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
  },[uid])

  useEffect(() => {
    if(childName){
      getTodayAttendance(childName);
      setDoneLoading(true)
    }
  },[childName])

  // GET CHILD's CLASS ID
  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getSpecific', {queryStringParameters:{
        GuardianID: uid
      }});
      setChildID(apiData.data[0]?.UserID);
      setChildName(apiData.data[0]?.CName);
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const getTodayAttendance = async (childName) => {
    try {
      const apiData = await API.get('api55db091d', '/attendance/getSpecificStudent', {queryStringParameters:{
        CName: childName
      }});
      var newData = apiData.data
      setAttendance(newData)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  if(doneLoading){
    attendance.sort((a, b) => (a.Date1 > b.Date1) ? -1 : 1);
  }

  const renderAttendance = () => {
    if(attendance.length > 0){
      return (
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {attendance.map(data => {
          return(
            <View style={[styles.card, styles.cardElevated]} key={data.ID}>
              <Text style={styles.classText}>Your child attendance record:</Text>
              <Text style={styles.classText}></Text>
              <Text style={styles.classText}>Child Name: {data.CName}</Text>
              <Text style={styles.classText}>Attendance: {data.Attendance}</Text>
              <Text style={styles.classText}>Date: {data.Date1}</Text>
            </View>
          )
        })}
        </ScrollView>
      )
    } else {
      return (
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.classText}>No record found.</Text>
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
 
 

  const checkGPS = () => {
    //navigate to GPS Page
    navigation.navigate('GLocation');
  };


  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <TouchableOpacity style={styles.topRight} onPress={handleUserIconClick}>
          <Ionicons name="person-outline" size={35} color="black" />
        </TouchableOpacity>
        <View style={styles.scrollContainer}>
          <Text style={styles.headerText}>Notification Center</Text>
            {renderAttendance()}
        </View>


        <View style={styles.locationContainer}>
        <TouchableOpacity onPress={checkGPS}>
        <ScrollView horizontal={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.classText}>Click to view your child's location:</Text>
          </View>
 
        </ScrollView>
        </TouchableOpacity>
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
    //width: width * 0.60,
    //height: height * 0.15,
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
    paddingTop: height * 0.2,
  },
  locationContainer: {
    paddingTop: height * 0.05,
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
    marginBottom: height * 0.04,
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
export default HomePage;