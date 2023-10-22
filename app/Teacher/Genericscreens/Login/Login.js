import React, { Component, useState,useCallback } from 'react';
import { Alert, Button, TextInput, View, StyleSheet ,Text} from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";
import {useForm, Controller} from 'react-hook-form';
import { Link } from "expo-router";
import BackgroundColor from '../BackgroundSetting/BackgroundColor';
import { useNavigation } from '@react-navigation/native';



const Login = () => {
    const { handleSubmit, control } = useForm();
    const [profileOpen, setprofileOpen] = useState(false);
    const [profileValue, setprofileValue] = useState(null);
    const [profile, setprofile] = useState([
        { label: "Teacher", value: "teacher" },
        { label: "Guardians", value: "guardians" },
        { label: "Child", value: "child" },
        { label: "School Admin", value: "schooladmin" },
    ]);
    const navigation = useNavigation();

    const handleLoginClick = () => {
      //navigate to setting page
      navigation.navigate('Tab',{screen:"Home"});
    };

    const onProfileOpen = useCallback(() => {
        setprofileOpen(true)
    }, []);
      return (
        <BackgroundColor>

        <View style={styles.container}>
          <TextInput
            placeholder={'Username'}
            style={styles.input}
          />
          <TextInput
            placeholder={'Password'}
            style={styles.input}
          />
        <Controller
                name="profile"
                defaultValue=""
                control={control}
                render={({ field: { onChange, value } }) => (
                <View style={styles.dropdownprofile}>
                    <DropDownPicker
                    style={styles.dropdown}
                    open={profileOpen}
                    value={profileValue}
                    items={profile}
                    setOpen={setprofileOpen}
                    setValue={setprofileValue}
                    setItems={setprofile}
                    placeholder="Select Profile"
                    placeholderStyle={styles.placeholderStyles}
                    onOpen={onProfileOpen}
                    onChangeValue={onChange}
                    zIndex={3000}
                    zIndexInverse={1000}
                    />
                </View>
                )}
            />
           <Link style={styles.navigate} href="./screens/ForgotUsernamePassword">Forgot Username/Password</Link>
          <Button
            title={'Login'}
            onPress={handleLoginClick}
          />
        </View>
        </BackgroundColor>

      );
    }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    navigate:{
      alignItems: 'center',
      justifyContent: 'center',
      height:50,
    },
    input: {
        width: 200,
        height: 50,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15, 
        fontSize: 16,
    },
    dropdownprofile: {
        marginHorizontal: 10,
        width: "50%",
        marginBottom: 15,
      },
    placeholderStyles: {
        color: "grey",
    },
    dropdown: {
        borderColor: "#B7B7B7",
        height: 50,
    },
  });

export default Login;