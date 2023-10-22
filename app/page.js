import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import Teacherpage from './Teacher/Teacherpage';
import Studentpage from './Child/Childpage';
import Guardianpage from './Guardian/Guardianpage';
import SchoolAdminpage from './SchoolAdmin/SchoolAdminpage';
import CCACoachPage from './CCACoach/CCACoachpage';
import awsExports from '../src/aws-exports';
import { Authenticator, withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

Amplify.configure(awsExports);

const Pagepage = () => {


    const [userProfile, setUserProfile] = useState(null);


    useLayoutEffect(() => {
        checkUserProfile();
    }, []);

  const checkUserProfile = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      const { attributes } = userInfo;
      const userProfile = attributes.profile;
      setUserProfile(userProfile);
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  };

  return (
    
    

        <SafeAreaView style={styles.main}>
          {userProfile === 'Form Teacher' ||
          userProfile === 'Teacher' || userProfile === 'teacher'  ? (
            <Teacherpage />
          ) : userProfile === 'Student' || userProfile === 'student' ? (
            <Studentpage />
          ) : userProfile === 'Guardian' || userProfile === 'guardian' ? (
            <Guardianpage />
          ) : userProfile === 'schooladmin' ? (
            <SchoolAdminpage />
          ) : userProfile === 'CCA Teacher' ? (
            <CCACoachPage />
          ) : (
            <Text>no profile found</Text>
          )}
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
});

export default Pagepage;