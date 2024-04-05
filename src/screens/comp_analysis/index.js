import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../constants/theme';
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from 'react-native-paper';
import useAddProduct from './hooks/useAddProduct';
import {askCameraPermission} from '../../utils/camera_permission';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {askStoragePermission} from '../../utils/storage_permission';

const defaultImg = 'https://cdn-icons-png.flaticon.com/512/4211/4211763.png';

const {width} = Dimensions.get('window');

const AddCompProductScreen = () => {
  const formik = useAddProduct();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = formik;

  const [image, setImage] = useState({index: 0, open: false});

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

          setFieldValue('photo' + image.index, imageUrl.uri);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleGallery = () => {
    const options = {quality: 0.5, base64: true};

    askStoragePermission(async () => {
      try {
        const result = await launchImageLibrary(options);

        if (result.didCancel) {
          return;
        }

        if (result.assets) {
          const imageUrl = result.assets[0];

          if (imageUrl.fileSize > 2000000) {
            Alert.alert('Too large', 'File sie is too large');
            return;
          }

          setFieldValue('photo' + image.index, imageUrl.uri);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        value={values.competitor_name}
        onChangeText={handleChange('competitor_name')}
        label="Competitor name"
        style={styles.input}
      />
      {errors.competitor_name && (
        <HelperText type="error">{errors.competitor_name}</HelperText>
      )}
      <TextInput
        value={values.product_name}
        onChangeText={handleChange('product_name')}
        label="Product name"
        style={styles.input}
      />
      {errors.product_name && (
        <HelperText type="error">{errors.product_name}</HelperText>
      )}

      <TextInput
        value={values.price}
        onChangeText={handleChange('price')}
        label="Product price"
        style={styles.input}
        keyboardType="number-pad"
      />
      {errors.price && <HelperText type="error">{errors.price}</HelperText>}

      <TextInput
        value={values.remarks}
        onChangeText={handleChange('remarks')}
        label="Remarks"
        style={styles.input}
        keyboardType="number-pad"
      />
      {errors.remarks && <HelperText type="error">{errors.remarks}</HelperText>}

      <View style={styles.row}>
        <Pressable onPress={() => setImage({index: 1, open: true})}>
          <Image
            source={{uri: values.photo1 ? values.photo1 : defaultImg}}
            style={styles.img}
          />
        </Pressable>
        <Pressable onPress={() => setImage({index: 2, open: true})}>
          <Image
            source={{uri: values.photo2 ? values.photo2 : defaultImg}}
            style={styles.img}
          />
        </Pressable>
        <Pressable onPress={() => setImage({index: 3, open: true})}>
          <Image
            source={{uri: values.photo3 ? values.photo3 : defaultImg}}
            style={styles.img}
          />
        </Pressable>
      </View>
      <Button
        onPress={handleSubmit}
        disabled={isSubmitting}
        loading={isSubmitting}
        mode="contained">
        Submit
      </Button>
      <Portal>
        <Dialog
          visible={image.open}
          onDismiss={() => setImage({...image, open: false})}>
          <Dialog.Content>
            <Button
              onPress={() => {
                setImage({...image, open: false});
                handleCamera();
              }}>
              Open camera
            </Button>
            <Button
              onPress={() => {
                setImage({...image, open: false});
                handleGallery();
              }}>
              Open gallery
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    padding: 10,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  img: {
    width: 0.25 * width,
    height: 0.25 * width,
  },
  btn: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default AddCompProductScreen;
