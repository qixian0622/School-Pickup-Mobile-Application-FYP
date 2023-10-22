import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

import { API, Auth } from 'aws-amplify';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { useNavigation } from '@react-navigation/native';

const ChildTimeTable = ({ navigation }) => {
  const [data,setData] = useState([{Day:'Monday'}, {Day:'Tuesday'}, {Day:'Wednesday'}, {Day:'Thursday'}, {Day:'Friday'}]);



const scheduleDay = (day) => {
  navigation.navigate('ChildSchedule', { selectedDay: day });
};

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <BackgroundColor>
      <View>
        <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
              <Ionicons name="chevron-back-outline" size={30} style={styles.icon} />
        </TouchableOpacity>

          <Text style={styles.headingText}>Weekly Timetable</Text>
          <ScrollView horizontal={true} style={styles.container}>
          {
              data?.map(data1 => {     
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

        <View style={styles.calendar}>
          <Calendar />
        </View>

      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  headingText: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingTop: '20%',
    color: 'black',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 100,
    borderRadius: 4,
    margin: 25,
  },
  cardElevated: {
    backgroundColor: 'white',
    elevation: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  calendar: {
    alignItems: 'center',
  },
  classText: {
    color: '#1DC1B1',
  },
  publicHolidayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  publicHolidayCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 5,
  },
  textHoliday: {
    color: 'black',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ChildTimeTable;
