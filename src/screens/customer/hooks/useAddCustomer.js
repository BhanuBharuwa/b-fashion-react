import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {useFormik} from 'formik';
import {useCallback, useRef, useState} from 'react';
import {Alert} from 'react-native';
import * as yup from 'yup';
import DistributorSearchForm from '../../../components/customer/DistributorSearchForm';
import NumberRegistration from '../../../components/customer/NumberRegistration';
import OuletLocationForm from '../../../components/customer/OuletLocationForm';
import OuletPhotoForm from '../../../components/customer/OuletPhotoForm';
import OutletDetailsForm from '../../../components/customer/OutletDetailsForm';
import OutletInformationForm from '../../../components/customer/OutletInformationForm';
import GeneralInformationForm from '../../../components/customer/GeneralInformationForm';
import {urls} from '../../../constants/urls';
import {useNavigation} from '@react-navigation/native';

const useAddCustomer = () => {
  const [customerChannels, setCustomerChannels] = useState([]);
  const [customerClasses, setCustomerClasses] = useState([]);
  const [customerCategories, setCustomerCategories] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const ref = useRef();
  const navigation = useNavigation();

  const checkTokenError = errors => {
    if (errors.token === 'token_invalid') {
      AsyncStorage.clear();
      navigation.navigate('AuthStack');
      navigation.closeDrawer();
      Alert.alert('Error', 'Login form another devices');
      return true;
    }
  };

  const fetchCustomerClasses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        url: urls.prefix + company + urls.customerClasses,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'application/json',
        },
      });

      const {success, data, errors} = response.data;

      if (success) {
        setCustomerClasses(data.customer_classes);
      } else {
        if (checkTokenError(errors)) return;

        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const fetchCustomerChannels = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        url: urls.prefix + company + urls.customerChannels,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'application/json',
        },
      });

      const {success, data, errors} = response.data;

      if (success) {
        setCustomerChannels(data.customer_channels);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const fetchCustomerTypes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        url: urls.prefix + company + urls.customerCategories,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'application/json',
        },
      });

      const {success, data, errors} = response.data;

      if (success) {
        setCustomerCategories(data.customer_categories);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const initialValues = {
    area_id: '',
    name: '',
    email: '',
    contact_number: '',
    address: '',
    longitude: '',
    latitude: '',
    customer_category_id: '',
    gst_type: '',
    photo: '',
    customer_channel_id: '',
    customer_class_id: '',
    distributor_id: '',
    market_name: '',
    pin_code: '',
    owner_name: '',
    whatsapp_number: '',
    competition_presence: false,
    length: '',
    width: '',
    gst_number: '',
    aadhar_card_number: '',
    pan: '',
    account_owner_name: '',
    account_number: '',
    ifsc_code: '',
    buying_stock_from: 'authorized distributor',
  };

  const contactNumberSchema = yup.object().shape({
    contact_number: yup
      .string()
      .required('Contact number is required')
      .max(10, 'Contact number must have 10 digits')
      .min(10, 'Contact number must have 10 digits'),
  });

  const distributorSchema = yup.object().shape({
    distributor_id: yup.string().required('Distributor needs to be selected'),
  });

  const generalSchema = yup.object().shape({
    area_id: yup.string().required('Area needs to be selected'),
    name: yup.string().required('Name is required'),
    market_name: yup.string().required('Market name is required'),
    pin_code: yup.string().required('Pin Code is required'),
    owner_name: yup.string().required('Owner name is required'),

    email: yup.string().email('Invalid email format'),
    aadhar_card_number: yup
      .string()
      .matches(/^[^!@#$%^&*+=<>:;|~]*$/, {
        message: 'Special characters are not allowed',
      })
      .min(10, 'Aadhar card must have 10 characters')
      .max(10, 'Aadhar card must have 10 characters'),
    gst_type: yup.string().required('GST type is required'),
    gst_number: yup
      .string()
      .when('gst_type', {
        is: value => value === 'regular' || value === 'composite',
        then: schema => schema.required('GST number is required'),
      })
      .matches(/^[^!@#$%^&*+=<>:;|~]*$/, {
        message: 'Special characters are not allowed',
      })
      .max(15, 'GST number must have 15 characters')
      .min(15, 'GST number must have 15 characters'),
  });

  const outletSchema = yup.object().shape({
    customer_class_id: yup
      .string()
      .required('Customer class needs to be selected'),
    customer_category_id: yup
      .string()
      .required('Customer category needs to be selected'),
    customer_channel_id: yup
      .string()
      .required('Customer channel needs to be selected'),
  });

  const locationSchema = yup.object().shape({
    latitude: yup
      .number()
      .required('Latitude is required')
      .typeError('Latitude is required'),
    longitude: yup
      .number()
      .required('Longitude is required')
      .typeError('Longitude is required'),
    address: yup.string().required('Address is required'),
  });

  const photoSchema = yup.object().shape({
    photo: yup.string().required('Photo is required'),
  });

  const outeletDetailsSchema = yup.object().shape({
    whatsapp_number: yup
      .string()
      .required('Whatsapp number is required')
      .min(10, 'Whatsapp number needs to have 10 digits')
      .max(10, 'Whatsapp number need to have 10 digits'),
    competition_presence: yup.boolean(),
    length: yup.string().required('Outlet length is required'),
    width: yup.string().required('Outlet width is required'),
    buying_stock_from: yup
      .string()
      .required('Buying stock from needs to be selected'),
  });

  const schemas = [
    contactNumberSchema,
    distributorSchema,
    generalSchema,
    outletSchema,
    locationSchema,
    photoSchema,
    outeletDetailsSchema,
  ];

  const onPreviousPress = () => {
    setActiveIndex(activeIndex - 1);
    scrollToIndex(activeIndex - 1);
  };

  const scrollToIndex = index => {
    setActiveIndex(index);
    ref?.current?.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5,
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schemas[activeIndex],
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        if (activeIndex === 0) {
          await searchContactNumber(values.contact_number);
        } else if (activeIndex === steps.length - 1) {
          await addCustomer();
        } else {
          scrollToIndex(activeIndex + 1);
        }
      } catch (err) {
        Alert.alert('Error', JSON.stringify(err));
      }
    },
  });

  const {values, setFieldValue, setSubmitting, resetForm} = formik;

  const onDistributorClick = useCallback(
    id => {
      setFieldValue('distributor_id', id);
    },
    [values.distributor_id],
  );

  const onClearPress = useCallback(() => {
    setFieldValue('distributor_id', '');
  }, [values.distributor_id]);

  const steps = [
    {
      index: 0,
      name: 'Phone Number Verification',
      element: <NumberRegistration {...formik} />,
    },
    {
      index: 1,
      name: 'Distributors',
      element: (
        <DistributorSearchForm
          {...formik}
          onDistributorClick={onDistributorClick}
          onClearPress={onClearPress}
          distributorId={values.distributor_id}
        />
      ),
    },
    {
      index: 2,
      name: 'General Information',
      element: <GeneralInformationForm {...formik} />,
    },
    {
      index: 3,
      name: 'Outlet Categorization',
      element: (
        <OutletInformationForm
          {...formik}
          customerClasses={customerClasses}
          customerChannels={customerChannels}
          customerCategories={customerCategories}
        />
      ),
    },
    {
      index: 4,
      name: 'Outlet Location',
      element: <OuletLocationForm {...formik} />,
    },
    {
      index: 5,
      name: 'Outlet Photo',
      element: <OuletPhotoForm {...formik} />,
    },
    {
      index: 6,
      name: 'Outlet Details',
      element: <OutletDetailsForm {...formik} />,
    },
  ];

  const fetchDistributors = async (page, name) => {
    try {
      setSubmitting(true);

      const token = await AsyncStorage.getItem('token');

      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.distributors,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
        params: {
          page: page,
          term: name,
        },
      });

      setSubmitting(false);
      if (response.data.success === true) {
        setHasMore(response.data.data.has_more);
        if (page === 1) {
          setDistributors(response.data.data.distributors);
        } else {
          setDistributors(distributors.concat(response.data.data.distributors));
        }
      } else {
        if (checkTokenError(errors)) return;

        Alert.alert('Distributor error', JSON.stringify(errors));
      }
    } catch (error) {
      setSubmitting(false);

      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const searchContactNumber = async number => {
    const company = await AsyncStorage.getItem('url');
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: urls.prefix + company + urls.customerNumberSearch,
      method: 'GET',
      headers: {
        version: '1',
        'x-auth': token,
      },
      params: {
        contact_number: number,
      },
    });

    const {success, data, errors} = response.data;

    if (success) {
      if (!data._id) {
        Alert.alert(
          'Alert',
          'Customer of this contact number not found, proceeding to next step',
          [
            {
              text: 'Ok',
              onPress: () => setActiveIndex(prev => prev + 1),
            },
          ],
        );
      } else {
        Alert.alert('Error', 'Customer of this contact number already exists');
      }
    } else {
      if (checkTokenError(errors)) return;

      Alert.alert('Error', JSON.stringify(errors));
    }
  };

  const addCustomer = async () => {
    try {
      const formData = new FormData();

      Object.entries(values).map(
        ([k, v]) => k !== 'photo' && formData.append(k, v),
      );

      formData.append('photo', {
        uri: values.photo,
        name: 'customer',
        type: 'image/jpeg',
      });

      console.log('formdata', formData);

      const company = await AsyncStorage.getItem('url');
      const token = await AsyncStorage.getItem('token');

      console.log(urls.prefix + company + urls.customers);
      console.log(token);

      const response = await axios({
        url: urls.prefix + company + urls.customers,
        method: 'POST',
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'multipart/form-data',
        },
        data: formData,
      });

      const {success, errors} = response.data;

      if (success) {
        Alert.alert('Success', 'New customer has been addedd');
        resetForm();
        scrollToIndex(0);
      } else {
        if (checkTokenError(errors)) return;

        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  return {
    formik,
    customerClasses,
    customerChannels,
    customerCategories,
    distributors,
    activeIndex,
    ref,
    hasMore,
    steps,
    onPreviousPress,
    setActiveIndex,
    fetchDistributors,
    fetchCustomerTypes,
    fetchCustomerChannels,
    fetchCustomerClasses,
  };
};

export default useAddCustomer;
