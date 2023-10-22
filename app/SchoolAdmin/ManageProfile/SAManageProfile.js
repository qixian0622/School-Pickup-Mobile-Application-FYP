import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation,useRoute } from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { API} from 'aws-amplify';

const SAManageProfile = () => {
  const [searchValue, setsearchValue] = useState('');
  const navigation = useNavigation();
  const [child,setchild] = useState([])
  const [teacher,setteacher] = useState([])
  const [guardian,setguardian] = useState([])
  const [data,setdata] = useState([])
  const [data2,setdata2] = useState('')
  const data1 = useRoute();

    useEffect(() => {
      getchildinfo()
    }, []);
  
    useEffect(() => {
      getteacherinfo()
    }, [child]);
  
    useEffect(() => {
      getguardianinfo()
    }, [teacher]);
  
    useEffect(() => {
      total(child,guardian,teacher) 
    }, [guardian]);

    useEffect(() => {
      if(data1.params?.message == "Success")
      {
        getchildinfo()
        getteacherinfo()
        getguardianinfo()
        total(child,guardian,teacher) 
      }
    }, [data1]);

    useEffect(() => {
      getchildinfo()
      getteacherinfo()
      getguardianinfo()
      total(child,guardian,teacher) 
    }, [data2]);

  

  const getchildinfo = async () => {
    try {
      const apiData = await API.get('api55db091d', '/child/getinfo');
      var newData = apiData.data
      setchild(newData)
      
    } catch (error) {
      console.error(error);
    }
  }

  const getteacherinfo = async () => {
    try {
      const apiData = await API.get('api55db091d', '/teacher/getinfo');
      var newData = apiData.data
      setteacher(newData)
    } catch (error) {
      console.error(error);
    }
  }

  const getguardianinfo = async () => {
    try {
      const apiData = await API.get('api55db091d', '/guardian/getinfo');
      var newData = apiData.data
      setguardian(newData)
    } catch (error) {
      console.error(error);
    }
  }

  const total = (child,teacher,guardian) => {
    if(guardian.length != 0)
    {
      setdata([...child,...teacher,...guardian])
      
      return [...data]
    }
  }


  const handleEdit = (UserID,Role,Contact,Email,Status,ClassID,CName,GuardianID,ChildID,GName,Name,Address) => {
    if(Role == "Form Teacher")
    {
      navigation.navigate('SAUpdateFormTeacherProfile',{ ID:UserID,ClassID1:ClassID,Contact1:Contact,Email1:Email,Name1:Name,Status1:Status,Role1:Role,Address1:Address});
    }
    else if (Role == "Child")
    {
      navigation.navigate('SAUpdateChildProfile',{ ID:UserID,Address1:Address,ClassID1:ClassID,CName1:CName,Contact1:Contact,Email1:Email,GID:GuardianID
        ,Status1:Status,Role1:Role});
    }
    else if (Role == "Guardian")
    {
      navigation.navigate('SAUpdateGuardianProfile',{ ID:UserID,Address1:Address,Contact1:Contact,Email1:Email
        ,Status1:Status,ChildID1:ChildID,GName1:GName,Role1:Role,ClassID1:ClassID});
    }
    else if (Role == "Teacher" || Role == "CCA Teacher")
    {
      navigation.navigate('SAUpdateTeacherProfile',{ ID:UserID,Contact1:Contact,Email1:Email,Name1:Name,Status1:Status,Role1:Role,Address1:Address});
    }

    
  };

  const handleActivate = async (UserID,Role,Contact,Email,Status,ClassID,CName,GuardianID,ChildID,GName,Name,Address) => {
    if(Role == "Teacher" || Role == "Form Teacher" || Role == "CCA Teacher")
    {
      const data1 = {
        body: {
          UserID: UserID,
          ClassID:ClassID,
          Contact: Contact,
          Email:Email,
          Name: Name,
          Role: Role,
          Status: "Suspend",
        },
      };
      try {
        const apiData = await API.put('api55db091d', '/teacher/updateprofile', data1);
        setdata2("Success")
        Alert.alert('Suspend Successful', 'Profile has been suspended successfully.')
        console.log(apiData);
      } catch (error) {
        throw new Error(error.message || 'Error updating DynamoDB profile');
      }
    }
    else if (Role == "Child")
    {
      const data1 = {
        body: {
          UserID: UserID,
          Address:Address,
          ClassID:ClassID,
          Contact: Contact,
          Email:Email,
          CName: CName,
          Role: Role,
          Status: "Suspend",
          GuardianID:GuardianID
        },
      };
      try {
        const apiData = await API.put('api55db091d', '/child/updateprofile', data1);
        setdata2("Success")
        Alert.alert('Suspend Successful', 'Profile has been suspended successfully.')
        console.log(apiData);
      } catch (error) {
        throw new Error(error.message || 'Error updating DynamoDB profile');
      }
    }
    else if (Role == "Guardian")
    {
      const data1 = {
        body: {
          UserID: UserID,
          Address:Address,
          ChildID:ChildID,
          Contact: Contact,
          Email:Email,
          GName: GName,
          Role: Role,
          Status: "Suspend",
        },
      };
      try {
        const apiData = await API.put('api55db091d', '/guardian/updateprofile', data1);
        setdata2("Success")
        Alert.alert('Suspend Successful', 'Profile has been suspended successfully.')
        console.log(apiData);
      } catch (error) {
        throw new Error(error.message || 'Error updating DynamoDB profile');
      }
    }
  };


  const columns = [
    { name: 'User Id', selector: 'UserID', sortable: true, width: 100 },
    { name: 'Contact', selector: 'Contact', sortable: true, width: 100 },
    { name: 'Role', selector: 'Role', sortable: true, width: 100 },
    { name: 'Email', selector: 'Email', sortable: true, width: 100 },
    { name: 'Status', selector: 'Status', sortable: true, width: 100 },
    {
      name: 'Actions',
      selector: 'actions',
      cell: (row) => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(row.UserID,row.Role,row.Contact,row.Email,row.Status,row.ClassID
              ,row.CName,row.GuardianID,row.ChildID,row.GName,row.Name,row.Address)}
          >
            <Text style={{ color: 'white' }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suspendButton}
            onPress={() => handleActivate(row.UserID,row.Role,row.Contact,row.Email,row.Status,row.ClassID
              ,row.CName,row.GuardianID,row.ChildID,row.GName,row.Name,row.Address)}
          >
            <Text style={{ color: 'white' }}>Suspend</Text>
          </TouchableOpacity>
        </View>
      ),
      width: 200,
    },
  ];

  const searchedData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <BackgroundColor>
      <Text style={{fontSize: 30,fontWeight: "bold",textAlign:"center"}}>School Admin Manage Profile</Text>
      <View style={styles.container}>
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
          placeholder="Enter Input"
          value={searchValue}
          onChangeText={(text) => setsearchValue(text)}
        />
        <ScrollView >
        <ScrollView horizontal>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              {columns.map((column) => (
                <DataTable.Title
                  key={column.selector}
                  style={{ ...styles.headerCell, width: column.width }}
                >
                  {column.name}
                </DataTable.Title>
              ))}
            </DataTable.Header>

         {searchedData.map((item) => (
              <DataTable.Row key={item.UserID}>
                {columns.map((column) => (
                  <DataTable.Cell
                    key={column.selector}
                    style={{ ...styles.dataTableCell, width: column.width }}
                    flex={column.flex}
                  >
                    {column.cell ? <Text>{column.cell(item)}</Text> : item[column.selector]}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
        </ScrollView>
      </View>
    </BackgroundColor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 2,
    paddingTop: 100,
    maxHeight: '94%',
  },
  scrollView: {
    flex: 1,
  },
  dataTable: {},
  headerCell: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  dataTableCell: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  editButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  suspendButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default SAManageProfile;
