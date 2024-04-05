import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { urls } from "../../../constants/urls";

const useProduct = () => {

    const [product, setProduct] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProductUnits()
    }, [])

    const getProductWithSubCategory = async (id, unit) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem('token');
            const company = await AsyncStorage.getItem('url');
            const response = await axios({
                url: urls.prefix + company + urls.products,
                params: {
                    sub_category_id: id,
                    unit_id: unit
                },
                method: 'GET',
                headers: {
                    'x-auth': token,
                    version: '1',
                    'Content-type': 'application/json',
                },
            });
            if (response.data.success === true) {
                setProduct(response.data.data.products)
            } else {
            }
        } catch (error) {
            // Alert.alert('Error', error)
        }
        setLoading(false)
    }

    const getProductUnits = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const company = await AsyncStorage.getItem('url');
            const response = await axios({
                url: urls.prefix + company + urls.units,
                method: 'GET',
                headers: {
                    'x-auth': token,
                    version: '1',
                    'Content-type': 'application/json',
                },
            });
            if (response.data.success === true) {
                setUnits(response.data.data.units)
            } else {
            }
        } catch (error) {
            // Alert.alert('Error', error)
        }
    }

    return {
        getProductWithSubCategory,
        getProductUnits,
        units,
        product,
        loading
    };
};

export default useProduct;
