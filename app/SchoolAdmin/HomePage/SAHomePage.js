import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment/moment';

Amplify.configure(awsExports);

const SAHomePage = () => {

  const [username,setUsername] = useState();
  const [absentTeacher, setAbsentTeacher] = useState([]);
  const [reliefTeacher, setReliefTeacher] = useState([]);
  const date = new Date();
  const [day, setDay] = useState(moment(date).format('dddd'));

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
  }

  useEffect(() => {
    getAbsentTeacher();
    getCurrectUser();
    getReliefTeacher();
  },[])

  const getAbsentTeacher = async () => {
    try {
      const apiData = await API.get('api55db091d','/teacher/getAbsentTeacher', {queryStringParameters:{
        Status:'Absent'
      }})
      setAbsentTeacher(apiData.data)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const getReliefTeacher = async () => {
    try {
      const apiData = await API.get('api55db091d','/reliefTeacher/getAll')
      setReliefTeacher(apiData.data)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const checkIsEmpty1 = () => {
    if(absentTeacher.length == 0){
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No absent teacher today.</Text>
          <Text style={styles.classText}>Date: {date.toISOString().substring(0, 10)} {day}</Text>
        </View>
        </ScrollView>
      )
    } else if (day === 'Saturday' || day === 'Sunday'){
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>Today is {day}.</Text>
          <Text style={styles.classText}>Have a good rest.</Text>
        </View>
        </ScrollView>
      )
    } else if (absentTeacher.length > 0){
      return(
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
        {absentTeacher?.map(items => {
          return(
            <View style={[styles.card, styles.cardElevated]} key={items.UserID}>
              <Text style={styles.classText}> {items.Name}</Text>
            </View>
          )
        })}
        </ScrollView>
      )
    }
  }

  const checkIsEmpty2 = () => {
    if(reliefTeacher.length == 0){
      return(
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No relief teacher available.</Text>
          <Text style={styles.classText}>Date: {date.toISOString().substring(0, 10)} {day}</Text>
        </View>
      )
    } 
  }

  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const handleUserIconClick = () => {
    //navigate to setting page
    navigation.navigate('SAProfile');
  };

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
          <Ionicons name="person-outline" size={35} color="black" />
        </TouchableOpacity>


        <View style={styles.scrollContainer}>
          <Text style={styles.headerText}>Absent Teacher Today:</Text>
          
            {checkIsEmpty1()}
            
        </View>


        <View style={styles.absentContainer}>
          <Text style={styles.headerText}>Available Relief Teacher:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
            {checkIsEmpty2()}
            {reliefTeacher?.map(items => {
                return(
                  <View style={[styles.card, styles.cardElevated]} key={items.UserID}>
                    <Text style={styles.classText}> {items.Name}</Text>
                  </View>
                )
              })}


          </ScrollView>
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
    paddingTop: height * 0.015,
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
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: 0,
    paddingLeft: height * 0.05,
    paddingBottom: height * 0.01,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.15, 
  },
});
export default SAHomePage;