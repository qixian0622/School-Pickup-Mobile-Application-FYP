import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import Teacherpage from './Teacher/Teacherpage';
import Studentpage from './Child/Childpage';
import Guardianpage from './Guardian/Guardianpage';
import SchoolAdminpage from './SchoolAdmin/SchoolAdminpage';
import Pagepage from './page';
import CCACoachPage from './CCACoach/CCACoachpage';
import awsExports from '../src/aws-exports';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react-native';

Amplify.configure(awsExports);

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  useLayoutEffect(() => {
    // checkUserProfile();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      checkUserProfile();
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

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
    
    <Authenticator.Provider>
      <Authenticator
        components={{
          SignIn: (props) => (
            <Authenticator.SignIn {...props} hideSignUp />
          ),
        }}
        
      >

        <SafeAreaView style={styles.main}>
          <Pagepage/>
        </SafeAreaView>
      </Authenticator>
    </Authenticator.Provider>
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

export default App;