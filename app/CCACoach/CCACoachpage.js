
import { StyleSheet,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

// Creating navigation path for bottom navigator 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';


//import from the respective file path
import CCAHomePageScreen from './Homepage/CCAHomePage';
import CCAAttendanceHomeScreen from './Attendance/CCAAttendanceHomepage';
import CCAMarkAttendanceScreen from './Attendance/CCAMarkAttendance';
import CCAViewAttendanceScreen from './Attendance/CCAViewAttendance';
import CCAUpdateAttendanceScreen from './Attendance/CCAUpdateAttendance';
import CCAGenerateAlistScreen from './Attendance/CCAGenerateAlist';
import CCATeachTimeTableScreen from './TimeTable/CCATimeTable';
import CCATeachProfileScreen from './Profile/CCAProfile';
import CCAUpdatePasswordScreen from './Profile/CCAUpdatePassword';
import CCAUpdateProfileScreen from './Profile/CCAUpdateProfile';
import CCAProfileScreen from './Profile/CCAProfile';

//Creating the bottom navigation tab, and stack pages for navigator
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

//Bottom navigator icons and words
function TabNavigator(){

    return(
      <Tab.Navigator screenOptions={{headerShown:false}}>
        
          <Tab.Screen name="Home" component={StackNavigatorHomePage} options={{
                        tabBarIcon: () => (
                          <Ionicons name="home" size={24}/>
                        ),
          }}/> 
          <Tab.Screen name="Attendance" component={StackNavigator} options={{
            tabBarIcon: () => (
              <Octicons name="checklist" size={24} color="black" />
            ),
          }}/>
          <Tab.Screen name="TimeTable" component={CCATeachTimeTableScreen} options={{
            tabBarIcon: () => (
              <Ionicons name="calendar-outline" size={24} color="black" />
            ),
          }}/>
                   
          <Tab.Screen name="Settings" component={StackSettingNavigator} options={{
            tabBarIcon: () => (
              <Ionicons name="settings-outline" size={24} color="black" />
            ),
          }}/>       
           
      </Tab.Navigator>
    )
}

//Re-direct the stack navigator in attendance page to the spilt paths.
function StackNavigator(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CCAAttendHP" component={CCAAttendanceHomeScreen} />
      <Stack.Screen name="CCAMarkAttendance" component={CCAMarkAttendanceScreen} />
      <Stack.Screen name="CCAUpdateAttendance" component={CCAUpdateAttendanceScreen} />
      <Stack.Screen name="CCAViewAttendance" component={CCAViewAttendanceScreen} />
      <Stack.Screen name="CCAGenerateAlist" component={CCAGenerateAlistScreen} />

      

    </Stack.Navigator>
  )
}



//Re-directing the Setting pages navigation
function StackSettingNavigator(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CCASetting" component={CCAProfileScreen} />
      <Stack.Screen name="CCAProfile" component={CCATeachProfileScreen} />
      <Stack.Screen name="CCAUpdatePassword" component={CCAUpdatePasswordScreen} />
  
      <Stack.Screen name="CCAUpdateProfile" component={CCAUpdateProfileScreen} />
      <Stack.Screen name="CCAHomePage" component={CCAHomePageScreen} />


    </Stack.Navigator>
  )
}

//Home Page navigation, goes to setting manageprofile.
function StackNavigatorHomePage(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CCAHomePage" component={CCAHomePageScreen} />
      <Stack.Screen name="CCAProfile" component={CCAProfileScreen} />
      <Stack.Screen name="CCAUpdatePassword" component={CCAUpdatePasswordScreen} />
      <Stack.Screen name="CCAUpdateProfile" component={CCAUpdateProfileScreen} />
    </Stack.Navigator>
  )
}




export default function CCACoachpage(){
  
  return(

      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen} options={tabBarStyle= {  headerShown: false}}/> */}

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

// export default Teacherpage;

