import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Image, Dimensions} from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {WebView} from 'react-native-webview';
import ImageView from 'react-native-image-viewing';
import Snackbar from 'react-native-snackbar';
import {TouchableRipple} from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import RNBackgroundDownloader from 'react-native-background-downloader';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';

const NewsScreen = ({route}) => {
  const {id} = route.params;
  const [news, setNews] = useState({});
  const [webViewHeight, setWebViewHeight] = useState(200);
  const [visible, setIsVisible] = useState(false);

  const [attachment, setAttachment] = useState({
    url: '',
    title: '',
    extension: '',
  });
  useEffect(() => {
    getNews();
  }, []);

  //   useEffect(() => {
  //     checkIfFileExists();
  //   }, [attachment]);

  //   async function checkIfFileExists() {
  //     const {title, extension} = attachment;
  //     const file_path = `${RNBackgroundDownloader.directories.documents}/${title}_${id}.${extension}`;

  //     const response = await RNFS.exists(file_path);
  //     response && showSnackbar('Attachment already available!', file_path);
  //   }

  //   function downloadAttachment() {
  //     const {url, title, extension} = attachment;
  //     const file_path = `${RNBackgroundDownloader.directories.documents}/${title}_${id}.${extension}`;

  //     RNBackgroundDownloader.download({
  //       id,
  //       url,
  //       destination: file_path,
  //       headers: {
  //         Pragma: 'no-cache',
  //       },
  //     })
  //       .begin((expectedBytes) => {
  //         console.log(`Going to download ${expectedBytes} bytes!`);
  //       })
  //       .progress((percent) => {
  //         console.log(`Downloaded: ${percent * 100}%`);
  //       })
  //       .done(() => {
  //         showSnackbar('Attachment downloadeded!', file_path);
  //       })
  //       .error((error) => {
  //         console.log('Download cancelled due to error: ', error);
  //       });
  //   }

  function showSnackbar(text, file_path) {
    Snackbar.show({
      text,
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'OPEN',
        onPress: () => {
          FileViewer.open(file_path, {showOpenWithDialog: true})
            .then(() => {
              console.log('File open successful!');
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    });
  }

  const getNews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.news + '/' + id,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success === true) {
        setNews(response.data.data);

        let {file_url, file_extension, title} = response.data.data;
        file_url &&
          setAttachment({url: file_url, title, extension: file_extension});
      } else {
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('AuthStack');
          Alert.alert('Error', 'Login from other device detected!');
        }
      }
    } catch (error) {
      console.log('catch ', error);
      // Alert.alert('Error', error)
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageView
        images={[{uri: news.file_url}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      <View style={styles.list_item}>
        <Text style={styles.title}>{news.title}</Text>
        <WebView
          source={{
            html: `<!DOCTYPE html>
                            <html>
                            <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                            <body>
                            ${news.content}
                            <script>
                            function ResizeImages(){
                                var myimg;
                                for(i=0;i <document.images.length;i++){
                                myimg = document.images[i];
                                myimg.width = ${
                                  Dimensions.get('window').width - 20
                                };
                                }
                            }
                            window.onload=function(){ 
                                ResizeImages()
                                window.location.hash = '#' + document.body.clientHeight;
                                document.title = document.body.clientHeight;
                            }
                            </script></body></html>`,
          }}
          style={{marginTop: 20, height: webViewHeight, width: '100%'}}
          injectedJavaScript={`
                        const meta = document.createElement('meta'); 
                        meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=1'); 
                        meta.setAttribute('name', 'viewport'); 
                        document.getElementsByTagName('head')[0].appendChild(meta);
                        setTimeout({
                        window.postMessage(document.documentElement.scrollHeight); 
                        }, 500);
                        true; // note: this is required, or you'll sometimes get silent failures
                        `}
          scalesPageToFit={false}
          onMessage={event => {
            console.log(event.nativeEvent.data);
            setWebViewHeight(parseInt(event.nativeEvent.data));
          }}
        />
        {news.file_type == 'image' ? (
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <Image
              style={{height: 200, width: 250}}
              source={{uri: news.file_url}}
            />
          </TouchableOpacity>
        ) : (
          news.file_type && (
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                marginTop: 10,
              }}>
              <Icon name={'file-pdf-outline'} size={35} />
              <Text
                style={{
                  marginLeft: 10,
                  textDecorationLine: 'underline',
                  color: 'royalblue',
                }}>
                {/* onPress={() => Linking.openURL(news.file_url)}> */}
                {news.file_url}
              </Text>
            </View>
          )
        )}
        {news.file_url && (
          <TouchableRipple
            style={styles.download_btn_wrapper}
            onPress={() => {}}>
            <View style={styles.download_btn}>
              <Text>Download Attachment </Text>
              <Icon name="file-download" size={22} color={'green'} />
            </View>
          </TouchableRipple>
        )}
      </View>
    </ScrollView>
  );
};

export default NewsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  head_title: {
    marginStart: 10,
    marginTop: 2,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  vender_name: {
    marginStart: 5,
    fontWeight: 'bold',
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  vender: {
    flexDirection: 'row',
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
    marginVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  icon: {
    marginStart: 10,
    marginEnd: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  download_btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  download_btn_wrapper: {
    alignSelf: 'flex-end',
    padding: 4,
    marginTop: 4,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
  },

  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
});
