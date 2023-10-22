import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import { Amplify,API,Auth } from 'aws-amplify';
import awsExports from "../../../src/aws-exports";
import React, { useEffect,useCallback,useRef,useState } from 'react'
import moment from 'moment/moment';

Amplify.configure(awsExports);

const HomePage = ({ navigation1 }) => {

  const [username,setUsername] = useState();
  const [uid,setUID] = useState();

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUsername(attributes.name)
    setUID(attributes.sub)
  }

  //use for navigating/redirect to other page
  const navigation = useNavigation();
  const handleUserIconClick = () => {
    //navigate to setting page
    navigation.navigate('Profile');
  };
  const [classID,setClassID] = useState('');
  const [data,setData] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);
  const [day,setDay] = useState([{Day:'Monday'}, {Day:'Tuesday'}, {Day:'Wednesday'}, {Day:'Thursday'}, {Day:'Friday'}]);

  useEffect(() => { 
    getCurrectUser();
  },[])

  const scheduleDay = (day) => {
    navigation.navigate('GuardianSchedule', { selectedDay: day });
  };



  
    return (
      <View style={styles.background}>
        <ScrollView style={styles.container}>
          <TouchableOpacity style={styles.topRight} onPress={handleUserIconClick}>
            <Ionicons name="person-outline" size={35} color="black" />
          </TouchableOpacity>

          <Text style={styles.headingText}>Weekly Timetable</Text>
          <ScrollView horizontal={true} style={styles.container}>
          {
              day?.map(data1 => {     
                return (
                  <TouchableOpacity onPress={() => scheduleDay(data1.Day)}key={data1.Day}>
                    <View style={[styles.card, styles.cardElevated]}>
                      <Text style={styles.classText}>{data1.Day}</Text>
                    </View>
                  </TouchableOpacity>
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
    );
  }

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  background: {
    flex: 1,
    backgroundColor: '#B3EAE5',
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
    width: 200,
    minHeight: 100,
    borderRadius: 4,
    marginLeft: 25,
    marginRight: 25,

    
  },
  cardElevated: {
    backgroundColor: 'white',
    elevation: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  classText: {
    fontSize: height * 0.018,
    color: '#1DC1B1',
    marginBottom:10,
  },
  calendar:{
    maxHeight:360,
    paddingBottom: '10%',
    alignItems:'center',
  },
  headingText: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingTop: '20%',
    color: 'black',
  }
});
export default HomePage;