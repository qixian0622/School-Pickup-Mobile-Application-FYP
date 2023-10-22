import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert , ActivityIndicator} from 'react-native';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation , useRoute} from '@react-navigation/native';
import BackgroundColor from '../../Genericscreens/BackgroundSetting/BackgroundColor';
import { API } from 'aws-amplify';

const SAManageClass = () => {
  const [searchValue, setsearchValue] = useState('');
  const [allRecords, setAllRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const data1 = useRoute();


  const handleEdit = (id, classid, day, endtime, starttime, subject, teacherid) => {
    console.log("Edit Clicked with ID:", id);

    navigation.navigate('SAUpdateClass', { id, classid, day, endtime, starttime, subject, teacherid });
  };

  useEffect(() => {
    getAllRecords();
  }, []);

  useEffect(() => {
    if(data1.params?.message == "Success")
    {
      getAllRecords();
    }
  }, [data1]);

  const getAllRecords = async () => {
    setIsLoading(true);
    try {
      const dataClass = await API.get('api55db091d', '/class/getinfo');
      const dataClassP2 = await API.get('api55db091d', '/classp2/getinfo');
      const dataClassP3 = await API.get('api55db091d', '/classp3/getinfo');
      const dataClassP4 = await API.get('api55db091d', '/classp4/getinfo');
      const dataClassP5 = await API.get('api55db091d', '/classp5/getinfo');
      const dataClassP6 = await API.get('api55db091d', '/classp6/getinfo');

      const combinedRecords = [
        ...dataClass.data.map((item) => ({ ...item, table: 'class' })),
        ...dataClassP2.data.map((item) => ({ ...item, table: 'classp2' })),
        ...dataClassP3.data.map((item) => ({ ...item, table: 'classp3' })),
        ...dataClassP4.data.map((item) => ({ ...item, table: 'classp4' })),
        ...dataClassP5.data.map((item) => ({ ...item, table: 'classp5' })),
        ...dataClassP6.data.map((item) => ({ ...item, table: 'classp6' })),
      ];
      setAllRecords(combinedRecords);
    } catch (error) {
      console.error(error);
    }finally {
      setIsLoading(false); 
    }
  };

  const columns = [
    { name: 'ClassID', selector: 'ClassID', sortable: true, width: 100 },
    { name: 'Day', selector: 'Day', sortable: true, width: 100 },
    { name: 'StartTime', selector: 'StartTime', sortable: true, width: 100 },
    { name: 'EndTime', selector: 'EndTime', sortable: true, width: 100 },
    { name: 'Subject', selector: 'Subject', sortable: true, width: 100 },
    {
      name: 'Actions',
      selector: 'actions',
      cell: (row) => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              handleEdit(
                row.ID,
                row.ClassID,
                row.Day,
                row.EndTime,
                row.StartTime,
                row.Subject,
                row.TeacherID
              )
            }
          >
            <Text style={{ color: 'white' }}>Edit</Text>
          </TouchableOpacity>
        </View>
      ),
      width: 200,
    },
  ];

  const searchedData = allRecords.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <BackgroundColor>
      <View style={styles.container}>
        <TextInput
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}
          placeholder="Enter Input"
          value={searchValue}
          onChangeText={(text) => setsearchValue(text)}
        />

{isLoading ? ( // Display activity indicator while loading
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="black" />
        ) : (
        <ScrollView>
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

              {searchedData.map((item, index) => (
                <DataTable.Row key={`${item.table}_${item.ID}_${index}`}>
                  {columns.map((column) => (
                    <DataTable.Cell
                      key={column.selector}
                      style={{ ...styles.dataTableCell, width: column.width }}
                      flex={column.flex}
                    >
                      {column.cell ? (
                        <Text>{column.cell(item)}</Text>
                      ) : (
                        item[column.selector]
                      )}
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </ScrollView>
        )}
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
});

export default SAManageClass;
