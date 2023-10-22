import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../BackgroundColor';
import {Amplify, API, Auth} from "aws-amplify";
import awsExports from "../../../src/aws-exports";

Amplify.configure(awsExports);

const AttendanceHomepage = () => {

    const [username,setUsername] = useState();
    const [uid,setUID] = useState();
    const [role,setRole] = useState();

    //Get current user info from Cognito
    async function getCurrectUser() {
        const { attributes } = await Auth.currentAuthenticatedUser();
        setUsername(attributes.name)
        setUID(attributes.sub)
        setRole(attributes.profile)
    }

    useEffect(() => {
        getCurrectUser();
    },[]);

    //use for navigating/redirect to other page
    const navigation = useNavigation();

    const handleMarkAttendanceClick = () => {
        navigation.navigate('MarkAttendance');

    };

    const handleUpdateAttendanceClick = () => {
        navigation.navigate('UpdateAttendance');

    };

    const handleGenerateAttendanceListClick = () => {
        navigation.navigate('GenerateAlist');

    };

    const handleViewAttendanceClick = () => {
        navigation.navigate('ViewAttendance');

    };

    const displayOptions = () => {
        if(role === 'Form Teacher'){
            return(
            <View style={styles.container}>

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
            )
        } else if (role === 'Teacher'){
            return(
                <View style={styles.containerTeacher}>
                    <View style={styles.containerTeacher}>
                        <TouchableOpacity style={styles.button} onPress={handleGenerateAttendanceListClick}>
                            <Text style={styles.buttonText}>View Attendance</Text>
                        </TouchableOpacity>
                    </View>
    
                </View>
            )
        }
    }


    

    return (
        <BackgroundColor>
            {displayOptions()}
        
  
    </BackgroundColor>


        
    );
};


const styles = StyleSheet.create({
   
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

    containerTeacher: {
        flex:1,
        paddingTop: 150,
        paddingLeft:20,
        width:'95%',
    },



});

export default AttendanceHomepage;
