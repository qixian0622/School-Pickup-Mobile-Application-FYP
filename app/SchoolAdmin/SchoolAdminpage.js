import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text, Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

//import from the respective file path
import SARegisterProfile from './RegisterUser/SARegisterUser';
import SAManageProfile from './ManageProfile/SAManageProfile';
import SAManageClass from './ManageClass/SAManageClass';
import SAHomePage from './HomePage/SAHomePage';
import SAProfile from './SAProfile/SAProfile';
import SAUpdatePassword from './SAProfile/SAUpdatePW';
import SAUpdateProfile from './SAProfile/SAUpdateOwnProfile';
import LoginScreen from '../Genericscreens/Login/Login';
import SAUpdateClassScreen from './ManageClass/SAUpdateClass';
import SAUpdateTeacherProfileScreen from './ManageProfile/SAUpdateTeacherProfile';
import SAUpdateFormTeacherProfileScreen from './ManageProfile/SAUpdateFormTeacherProfile';
import SAUpdateGuardianProfileScreen from './ManageProfile/SAUpdateGuardianProfile';
import SAUpdateChildProfileScreen from './ManageProfile/SAUpdateChildProfile';


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


function TabNavigator(){
    return(
      <Tab.Navigator screenOptions={{headerShown:false}}>
          

          <Tab.Screen name="Home" component={StackNavigatorHomePage} options={{
                        tabBarIcon: () => (
                          <Ionicons name="home" size={24}/>
                        ),
          }}/>       
          
          <Tab.Screen name="Register" component={SARegisterProfile} options={{
            tabBarIcon: () => (
              <Ionicons name="person-add-outline" size={24} color="black" />
            ),
          }}/>

        <Tab.Screen name="Manage Profiles" component={StackNavigatorManageProfilePage} options={{
                    tabBarIcon: () => (
                    <Ionicons name="people-outline" size={24} color="black" />
                    ),
          }}/>
            
            
            <Tab.Screen name="Manage Class" component={StackNavigatorManageClassPage} options={{
            tabBarIcon: () => (
              <Ionicons name="newspaper-outline" size={24} color="black" />
            ),
          }}/>
          
          
          <Tab.Screen name="Settings" component={SAProfile} options={{
            tabBarIcon: () => (
              <Ionicons name="settings-outline" size={24} color="black" />
            ),
          }}/>       
           
      </Tab.Navigator>
    )
}
function StackNavigatorManageClassPage(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SAManageClass" component={SAManageClass} />
      <Stack.Screen name="SAUpdateClass" component={SAUpdateClassScreen} />


    </Stack.Navigator>
  )
}

function StackNavigatorManageProfilePage(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SAManageProfile" component={SAManageProfile} />
      <Stack.Screen name="SAUpdateTeacherProfile" component={SAUpdateTeacherProfileScreen} />
      <Stack.Screen name="SAUpdateChildProfile" component={SAUpdateChildProfileScreen} />
      <Stack.Screen name="SAUpdateGuardianProfile" component={SAUpdateGuardianProfileScreen} />
      <Stack.Screen name="SAUpdateFormTeacherProfile" component={SAUpdateFormTeacherProfileScreen} />


    </Stack.Navigator>
  )
}


function StackNavigatorHomePage(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SAHomePage" component={SAHomePage} />
      <Stack.Screen name="SAProfile" component={SAProfile} />
      <Stack.Screen name="SAUpdatePassword" component={SAUpdatePassword} />
      <Stack.Screen name="SAUpdateOwnProfile" component={SAUpdateProfile} />

    </Stack.Navigator>
  )
}



export default function SchoolAdminpage(){
  
  return(

      <Stack.Navigator>

        <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
  )
}



const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',

    justifyContent: 'center',
  },
});


