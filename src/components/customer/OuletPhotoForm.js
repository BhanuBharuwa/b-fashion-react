import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {memo} from 'react';
import {askCameraPermission} from '../../utils/camera_permission';
import {launchCamera} from 'react-native-image-picker';
import {Button, HelperText} from 'react-native-paper';

const {height} = Dimensions.get('window');

const OuletPhotoForm = ({values, errors, setFieldValue}) => {
  const handleCamera = () => {
    const options = {quality: 0.5, base64: true};

    askCameraPermission(async () => {
      try {
        const result = await launchCamera(options);

        if (result.didCancel) {
          return;
        }

        if (result.assets) {
          const imageUrl = result.assets[0];

          if (imageUrl.fileSize > 2000000) {
            Alert.alert('Too large', 'File sie is too large');
            return;
          }

          setFieldValue('photo', imageUrl.uri);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {values.photo.length > 0 ? (
        <>
          <Image
            source={{uri: values.photo}}
            style={styles.image}
            resizeMode="contain"
            resizeMethod="auto"
          />
          <Button
            onPress={handleCamera}
            mode="contained"
            icon="camera"
            style={styles.button}>
            Open camera
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={handleCamera}
            mode="contained"
            icon="camera"
            style={styles.button}>
            Open camera
          </Button>
          {errors.photo && <HelperText type="error">{errors.photo}</HelperText>}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    height: 0.6 * height,
    width: '100%',
  },
  button: {
    marginVertical: 10,
  },
});

export default memo(OuletPhotoForm);
