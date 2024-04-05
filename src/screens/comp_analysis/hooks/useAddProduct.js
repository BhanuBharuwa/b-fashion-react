import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {useFormik} from 'formik';
import {Alert} from 'react-native';
import {urls} from '../../../constants/urls';

const useAddProduct = () => {
  const initialValues = {
    competitor_name: '',
    product_name: '',
    price: '',
    remarks: '',
    photo1: '',
    photo2: '',
    photo3: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, {setSubmitting, resetForm, setErrors}) => {
      setSubmitting(true);
      try {
        const token = await AsyncStorage.getItem('token');

        const company = await AsyncStorage.getItem('url');

        const data = new FormData();

        Object.entries(values).map(
          ([k, v]) => !k.includes('photo') && data.append(k, v),
        );
        Object.entries(values).map(
          ([k, v], index) =>
            k.includes('photo') &&
            v.length !== 0 &&
            data.append(k, {
              uri: v,
              name: 'customer' + index.toString(),
              type: 'image/jpeg',
            }),
        );

        const response = await axios({
          url: urls.prefix + company + urls.compAnalysis,
          method: 'POST',
          headers: {
            version: '1',
            'x-auth': token,
            'Content-type': 'multipart/form-data',
            Accept: 'application/json',
          },
          data,
        });

        if (response.data.success === true) {
          Alert.alert('Success', 'Competitive Product has been submitted');
          resetForm();
        } else {
          setErrors(response.data.errors);

          if (response.data.errors.token_permission) {
            Alert.alert('Permission', response.data.errors.token_permission);
          }
        }
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error));
      }
    },
  });

  return formik;
};

export default useAddProduct;
