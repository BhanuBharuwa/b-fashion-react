import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import Extypo from 'react-native-vector-icons/Entypo';
import { colors, theme } from "../../constants/theme";

const RenderSigleView = ({ permissions, checkInCustomer, item, statusColor, visitedStatus, navigation }) => (
    <Card style={styles.card}>
        <TouchableOpacity
            onPress={() => {
                permissions['view-customer-api']
                    ? navigation.navigate('CustomerDetailScreen', {
                        id: item._id,
                        permissions: permissions,
                        punchStatus: checkInCustomer,
                        customer: item,
                    })
                    : null;
            }}
            style={styles.activity_item}>
            <View style={styles.iconContainer}>
                <Extypo
                    name="shop"
                    size={28}
                    color={colors.light}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text variant="titleMedium">{item.name}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Text>
                        Order status : {" "}
                    </Text>
                    <Text
                        style={{
                            fontWeight: '600',
                            color: item.is_order_taken ? colors.success : colors.error,
                        }}>
                        {item.is_order_taken ? 'Taken' : 'Not taken'}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View>
                        <Text>
                            {item.customer_category_name
                                ? item.customer_category_name
                                : 'N/A'}
                        </Text>
                        <Text>{item.area_name}</Text>
                        <Text>{item.contact_number}</Text>
                    </View>
                    {item.is_confirmed ? (
                        
                            <Text style={[styles.visit_status, { backgroundColor: statusColor }]}>
                                {visitedStatus}
                            </Text>
                        
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    </Card>
);

export default RenderSigleView;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginVertical: 5,
        marginHorizontal: 2
    },

    activity_item: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },

    visit_status: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        color: '#FFF',
        borderRadius: 8,
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: '700',
        fontSize: 12,
        marginRight: 10,
    },

    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: colors.primary,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
})