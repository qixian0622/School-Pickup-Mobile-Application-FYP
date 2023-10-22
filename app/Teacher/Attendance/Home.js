import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from "react-native";
import {Amplify, AmplifyTheme} from "aws-amplify";
import { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import { Link } from "expo-router";
//import {app} from "../amplify/backend/function/LambdaFc01/src/app";


//INSERT
addRecord = async () => {
  const data = {
    body: {
      UserID: 1001,
      Name: 'tester1001',
      Email: 'test1001@test.com',
      Contact: 61472917
    }
  };

  console.log(data);
  try {
    const apiData = await API.post('api55db091d', '/resources', data);
    console.log({apiData});
  } catch (error) {
    console.error(error);
  }
}

// SHOW ALL RECORD
getAllRecords = async () => {
  try {
    const apiData = await API.get('api55db091d', '/resources')
    console.log(apiData);
  } catch (error) {
    console.error(error);
  }
}

// GET SPECFIC RECORD FROM PARTITION KEY AND SORT KEY BASED ON USER INPUT(${USERID}/${NAME})
getSpecficRecord = async () => {
  try {
    const apiData = await API.get('api55db091d', '/resources',{queryStringParameters:{
      UserID:1,
      Name:"Tester999"
    }})
    console.log(apiData);
  } catch (error) {
    console.error(error);
  }
}

// UPDATE RECORD BASED ON USER INPUT(${EMAIL}/${PHONE})

updateRecord = async () => {
  try {
    const apiData = await API.put('api55db091d', `/resources/${"Test33@gmail.com"}/${"12345"}`)
    console.log(apiData);
  } catch (error) {
    console.error(error);
  }
}

const home = () => {

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView>
        <Text style={styles.title}>Attendance Home Page</Text>
        <Link style={styles.container} href="/Teacher/Attendance/MarkAttendance">Mark Attendance</Link>
      </ScrollView>

      
      
    </SafeAreaView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
    padding: 100,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 54,
    fontWeight: "bold",
    justifyContent: "center",
    padding: 50,
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

export default home;