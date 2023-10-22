import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import {Amplify, API, Auth} from "aws-amplify";

const CCAAttendanceHomepage = () => {

    //use for navigating/redirect to other page
    const navigation = useNavigation();
    const [teacherid, setteacherid] = useState('');
    const [ccaname, setccaname] = useState('');

    const handleMarkAttendanceClick = () => {
        navigation.navigate('CCAMarkAttendance');

    };

    const handleUpdateAttendanceClick = () => {
        navigation.navigate('CCAUpdateAttendance');

    };

    const handleGenerateAttendanceListClick = () => {
        navigation.navigate('CCAGenerateAlist');

    };

    const handleViewAttendanceClick = () => {
        navigation.navigate('CCAViewAttendance');

    };

    useEffect(() => {
        fetchUserData();
      }, []);

    useEffect(() => {
        getCCA(teacherid)
    }, [teacherid]);




    const fetchUserData = async () => {
        try {
          const user = await Auth.currentAuthenticatedUser();
          setteacherid(user.attributes.sub || '');
        } catch (error) {
          Alert.alert('Error fetching user data, please contact administrator.');
        }
      };

    const getCCA = async (teacherid) => {
        if(teacherid != "")
        {
            try {
                const apiData = await API.get('api55db091d', '/ccacoach/getCCA',{queryStringParameters:{
                  UserID:teacherid
                }})
                setccaname(apiData.data[0]?.CCAName)
              } catch (error) {
                console.error(error);
              }
        }
        
    }



    return (
        <BackgroundColor>
        <View style={styles.container}>
            <Text style={styles.fclass}>
                CCA Sport: {ccaname}
            </Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={handleMarkAttendanceClick}>

                    <Text style={styles.buttonText}>Mark Attendance</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={handleUpdateAttendanceClick}>
                    <Text style={styles.buttonText}>Update Attendance</Text>

                </TouchableOpacity>

            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={handleGenerateAttendanceListClick}>
                    <Text style={styles.buttonText}>Generate Attendance List</Text>

                </TouchableOpacity>

            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={handleViewAttendanceClick}>
                    <Text style={styles.buttonText}>View Attendance</Text>

                </TouchableOpacity>

            </View>

            

        </View>
        
  
    </BackgroundColor>


        
    );
};


const styles = StyleSheet.create({

    fclass:{
        fontSize: 35,
        fontWeight: 'bold',
        color: 'black'
    },
   
    button:{
      alignItems:'center',
      backgroundColor: '#FFFFFF',
      padding: 20,
        
    },
    buttonText:{
        color: '#1DC1B1',
        fontSize:15,

    },

    container: {

        paddingTop: 70,
        paddingLeft:20,
        width:'95%',
    },



});

export default CCAAttendanceHomepage;
