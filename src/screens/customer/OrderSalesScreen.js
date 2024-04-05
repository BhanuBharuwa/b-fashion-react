import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import moment from 'moment';
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native"
import { Divider, Subheading, Text } from "react-native-paper";
import { urls } from "../../constants/urls";
import { colors } from "../../constants/theme";

const OrderSalesScreen = ({ self, id }) => {
    const [orderSales, setOrderSales] = useState({});

    useEffect(() => {
        fetchOrderSales(self);
    }, []);

    const fetchOrderSales = async self => {
        try {
            const token = await AsyncStorage.getItem('token');

            const company = await AsyncStorage.getItem('url');

            const response = await axios({
                url: urls.prefix + company + urls.orderSales,
                method: 'GET',
                headers: {
                    version: '1',
                    'x-auth': token,
                },
                params: {
                    self: self === 0 ? true : false,
                    customer_id: id,
                },
            });

            if (response.data.success === true) {
                setOrderSales(response.data.data.sales);
            } else {
                Alert.alert('Distributor error', JSON.stringify(response.data.errors));
            }
        } catch (error) {
            Alert.alert('Error', JSON.stringify(error));
        }
    };

    return (
        <View>
            <View style={styles.row}>
                <View style={styles.hightlightTextContainer}>
                    <Text style={styles.hightlight_text}>MTD</Text>
                </View>
                <View style={styles.col}>
                    <Subheading style={styles.title}>
                        Rs {orderSales.total_value}
                    </Subheading>
                    <Text>Total order value</Text>
                </View>
                <View style={styles.col}>
                    <Subheading style={styles.title}>
                        {orderSales.total_quantity}
                    </Subheading>
                    <Text>Total order quantity</Text>
                </View>
            </View>
            <Divider />
            <Divider />
            <Divider />
            <View style={styles.row}>
                <View style={styles.hightlightTextContainer}>
                    <Text style={styles.hightlight_text}>Last 5 orders</Text>
                </View>
                <View style={styles.col}>
                    <Subheading style={styles.title}>
                        Rs {orderSales.avg_value}
                    </Subheading>
                    <Text>Avg value</Text>
                </View>
                <View style={styles.col}>
                    <Subheading style={styles.title}>
                        {orderSales.avg_quantity}
                    </Subheading>
                    <Text>Avg qty</Text>
                </View>
                <View style={styles.col}>
                    <Subheading style={styles.title}>{orderSales.lpc}</Subheading>
                    <Text>LPC</Text>
                </View>
            </View>
            <Divider />
            <Divider />
            <Divider />
            {self === 0 && (
                <View style={[styles.row, { paddingLeft: 10 }]}>
                    <View style={styles.col}>
                        <Subheading style={styles.title}>
                            {moment().diff(orderSales.last_visit, 'days')} day(s) ago
                        </Subheading>
                        <Text>Last visit</Text>
                    </View>
                    <View style={styles.col}>
                        <Subheading style={styles.title}>
                            {moment().diff(orderSales.last_order_date, 'days')} day(s) ago
                        </Subheading>
                        <Text>Last order</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

export default OrderSalesScreen;

const styles = StyleSheet.create({

    row: {
        height: 80,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    col: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginVertical: 3,
    },

    hightlightTextContainer: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        width: 45,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    hightlight_text: {
        color: colors.light,
        opacity: 0.8,
        transform: [{ rotate: '-90deg'}],
      },
});