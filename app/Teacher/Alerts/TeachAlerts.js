import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundColor from '../BackgroundColor';
import { Amplify, API } from 'aws-amplify';
import awsExports from '../../../src/aws-exports';

Amplify.configure(awsExports);

const TeachAlerts = () => {
  const [data, setData] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);
  const navigation = useNavigation();

  const checkGPS = (child) => {
    navigation.navigate('TeachLocation', { selectedChild: child });
  };

  useEffect(() => {
    getData();
    setDoneLoading(true);
  }, []);

  const getData = async () => {
    try {
      const apiData = await API.get('api55db091d', '/geolocation/getAll');
      setData(apiData.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const renderNewest = () => {
    if (data.length > 0) {
      return (
        <TouchableOpacity onPress={() => checkGPS(data[0].CName)}>
          <View style={[styles.cardText, styles.cardElevated]}>
            <Text style={styles.classText}>Child Name: {data[0].CName}</Text>
            <Text style={styles.classText}>Date: {data[0].Date1}</Text>
            <Text style={styles.classText}>Time: {data[0].Time1}</Text>
            <Text style={styles.classText}>Click to view location</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.classText}>No emergency situation reported.</Text>
        </View>
      );
    }
  };

  if (doneLoading) {
    data.sort((a, b) => (a.Date1 < b.Date1 ? 1 : -1));
  }

  return (
    <BackgroundColor>
      <View style={styles.container}>
        <View style={styles.middle}>
          <Text style={styles.welcometext}>Emergency Alerts:</Text>
        </View>
        <View style={styles.scrollContainer}>
          <Text style={styles.headertext}>Most Recent Emergency Alert:</Text>
          {renderNewest()}
        </View>
        <View style={styles.absentContainer}>
          <Text style={styles.headertext}>All Alerts:</Text>
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContent}>
            {data.map((data1) => (
              <TouchableOpacity key={data1.UserID} onPress={() => checkGPS(data1.CName)}>
                <View style={[styles.cardText, styles.cardElevated]}>
                  <Text style={styles.classText}>Child Name: {data1.CName}</Text>
                  <Text style={styles.classText}>Date: {data1.Date1}</Text>
                  <Text style={styles.classText}>Time: {data1.Time1}</Text>
                  <Text style={styles.classText}>Click to view location</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  middle: {
    position: 'relative',
    top: 50,
    left: 5,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 120,
    borderRadius: 4,
    margin: 25,
  },
  cardText: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 120,
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
  scrollContainer: {
    paddingTop: 110,
    paddingBottom: 50,
  },
  welcometext: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
  },
  headertext: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 19,
    color: 'black',
  },
  classText: {
    fontSize: 16,
    color: '#1DC1B1',
  },
});

export default TeachAlerts;
