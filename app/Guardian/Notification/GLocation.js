import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import MapView, { Marker } from 'react-native-maps';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";

Amplify.configure(awsExports);

const TeachLocation = () => {

  const [uid, setUID] = useState();
  const [childID, setChildID] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [doneLoading, setDoneLoading] = useState(false);

  //Get current user info from Cognito
  async function getCurrectUser() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    setUID(attributes.sub)
  }

  useEffect(() =>{
    getCurrectUser();
  },[]);

  useEffect(() =>{
    if(uid){
      getData(uid)
    }
  },[uid]);

  useEffect(() =>{
    if(childID){
      getLocation(childID)
    }
  },[childID]);

  useEffect(() =>{
    if(latitude){
      console.log('lat: '+latitude)
      console.log('long: '+longitude)
      setDoneLoading(true);
    }
  },[latitude]);

  const getData = async (uid) => {
    try {
      const apiData = await API.get('api55db091d', '/child/getSpecific', {queryStringParameters:{
        GuardianID: uid
      }});
      setChildID(apiData.data[0]?.UserID);
      console.log(apiData.data[0]?.UserID)
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const getLocation = async (childID) => {
    try {
      const apiData = await API.get('api55db091d', '/geolocation/getData', {queryStringParameters:{
        UserID: childID
      }});
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
    return(
      <BackgroundColor>
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
          title={"Your Child's Location"}
        />
      </MapView>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={BackAlert}>
          <Ionicons name="chevron-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.backText}>Back</Text>
      </View>
    </BackgroundColor>
    )
  }
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TeachLocation;
