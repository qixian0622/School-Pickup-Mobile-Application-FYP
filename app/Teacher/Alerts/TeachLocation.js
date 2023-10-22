import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TeachAlerts from './TeachAlerts';
import BackgroundColor from '../BackgroundColor';
import MapView, { Marker } from 'react-native-maps';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";

Amplify.configure(awsExports);


const TeachLocation = ({route}) => {

  const { selectedChild } = route.params;
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    getLocation();
  },[])

  useEffect(() =>{
    if(latitude){
      setDoneLoading(true);
    }
  },[latitude]);

  const getLocation = async () => {
    try {
      const apiData = await API.get('api55db091d', '/geolocation/getByName', {queryStringParameters:{
        CName: selectedChild
      }});
      console.log(apiData.data)
      setLongitude(apiData.data[0]?.Longtitude);
      setLatitude(apiData.data[0]?.Latitude);
    } catch (error) {
      console.error(error.response.data);
    }
  }

     //use for navigating/redirect to other page
  const navigation = useNavigation();

  const BackAlert = () => {
    //navigate to GPS Page
    navigation.goBack();

  };

  if(doneLoading){
    return (
      <BackgroundColor>
    
        <View>
           <Text style={styles.backText}>Back</Text>       
            <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={30} onPress={BackAlert}/>
          </TouchableOpacity>
        </View>
    
        <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{latitude,longitude}}
              title={"Child's Location"}
            />
          </MapView>
        </BackgroundColor>
    
     )
  }
};


 const styles = StyleSheet.create({


    backButton: {

        position: 'absolute',
        top: 80,
        left: 30,
        zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      flex: 1,
    },

    backText:{
        position: 'relative',
        top:50,
        left:30,
        fontSize:15,
      fontWeight: 'bold',
    },
  
});
  
export default TeachLocation;