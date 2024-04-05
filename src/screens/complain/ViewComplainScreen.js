import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ListItem from '../../components/ListItem';
import {theme} from '../../constants/theme';
import ImageView from 'react-native-image-viewing';

import {urls} from '../../constants/urls';
const ViewComplainScreen = ({route}) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setIsVisible] = useState(false);

  const {id} = route.params;
  useEffect(() => {
    getComplainsData();
  }, []);
  const getComplainsData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        method: 'GET',
        url: urls.prefix + company + urls.complaints + '/' + id,
        headers: {
          version: '1',
          'x-auth': token,
        },
      });

      const {data} = response;

      if (data.success) {
        setData(data.data);
        setIsLoading(false);
      } else {
        const {errors} = data;
        if (errors.id) {
        } else {
          Alert.alert(null, 'Unable to fetch complaints data.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <ImageView
        images={[{uri: data.photo_url}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      <View style={styles.list_item}>
        <ListItem title="Complain number" value={data.complaint_number} />
        <ListItem title="Complain Type" value={data.complaint_type_name} />
        <ListItem
          title="Date"
          value={moment(data.created_at).format('YYYY-MM-DD')}
        />
        <ListItem title="Customer Name" value={data.customer_name} />
        <ListItem title="Message" value={data.message} />
        <ListItem title="Status" value={data.status} />
        <ListItem title="Remarks" value={data.remarks ? data.remarks : 'N/A'} />
        {data.thumb_url && (
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <Image
              source={{uri: data.thumb_url}}
              style={{
                width: '50%',
                height: 200,
                resizeMode: 'cover',
                margin: 20,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ViewComplainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  shareBtton: {
    color: '#000',
    marginLeft: 20,
    marginRight: 20,
    // fontWeight: "bold",
    fontSize: 14,
    paddingBottom: 5,
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  vender: {
    flexDirection: 'row',
    marginStart: 20,
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  text_date: {
    marginStart: 20,
  },

  checkbox: {
    position: 'absolute',
    right: 20,
  },
});
