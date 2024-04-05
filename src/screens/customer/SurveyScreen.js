import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import React from 'react'
import { Appbar, Button, Card, Checkbox, Divider, HelperText, RadioButton, Text } from 'react-native-paper'
import { theme } from '../../constants/theme';

const SurveyScreen = ({navigation}) => {
    const [checkL1, setCheckL1] = React.useState(false);
    const [checkL2, setCheckL2] = React.useState(false);
    const [standee, setStandee] = React.useState('');
    const [Sun, setSun] = React.useState('');
    const [Festival, setFestival] = React.useState('');
    const [Poster, setPoster] = React.useState('');
    const [New, setNew] = React.useState('');
    const [error, setError] = React.useState(null);

    const onHandlePress = () =>{
        var tempError
        if(!checkL1 && !checkL2){
            tempError = {...tempError,
                catalogue:'Please select catalogue'
            }
        }
        if(!standee){
            tempError={...tempError,
                standee:'Please select option'
            }
        }
        if(!Sun){
            tempError={...tempError,
                sun:'Please select option'
            }
        }
        if(!Festival){
            tempError={...tempError,
                festival:'Please select option'
            }
        }
        if(!Poster){
            tempError={...tempError,
                poster:'Please select option'
            }
        }
        if(!New){
            tempError={...tempError,
                new:'Please select option'
            }
            console.log(tempError)

        }
        if(tempError){
            setError(tempError)
        }
        else{
            Alert.alert('Success','Survey is successfully submited')
        navigation.pop(2)
        }
      
    }
    return (
        <>
            <Appbar.Header style={{ backgroundColor: '#fff' }}>
                <Appbar.Content color={theme.primaryColor} title="Survey Question" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.container}>
                    <Text style={styles.question}>Catalogue Execution on retailer</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            status={checkL1 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setCheckL1(!checkL1);
                            }}
                        />
                        <Text>L1 – Hawai</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            status={checkL2 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setCheckL2(!checkL2);
                            }}
                        />
                        <Text>L2 – Non Hawai</Text>
                    </View>
                    {error?.catalogue&& <HelperText type='error'>{error.catalogue}</HelperText>}
                    <Divider />
                    <Text style={styles.question}>Standee Execution </Text>
                    <RadioButton.Group onValueChange={newValue => setStandee(newValue)} value={standee}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Yes</Text>
                                <RadioButton value="Yes" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>No</Text>
                                <RadioButton value="No" />
                            </View>
                        </View>
                    </RadioButton.Group>
                    {error?.standee&& <HelperText type='error'>{error.standee}</HelperText>}

                    <Divider />

                    <Text style={styles.question}>Sun pack Execution </Text>
                    <RadioButton.Group onValueChange={newValue => setSun(newValue)} value={Sun}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Yes</Text>
                                <RadioButton value="Yes" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>No</Text>
                                <RadioButton value="No" />
                            </View>
                        </View>
                    </RadioButton.Group>
                    {error?.sun&& <HelperText type='error'>{error.sun}</HelperText>}

                    <Divider />

                    <Text style={styles.question}>Festival Banner execution </Text>
                    <RadioButton.Group onValueChange={newValue => setFestival(newValue)} value={Festival}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Yes</Text>
                                <RadioButton value="Yes" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>No</Text>
                                <RadioButton value="No" />
                            </View>
                        </View>
                    </RadioButton.Group>
                    {error?.festival&& <HelperText type='error'>{error.festival}</HelperText>}

                    <Divider />

                    <Text style={styles.question}>Poster execution  </Text>
                    <RadioButton.Group onValueChange={newValue => setPoster(newValue)} value={Poster}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Yes</Text>
                                <RadioButton value="Yes" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>No</Text>
                                <RadioButton value="No" />
                            </View>
                        </View>
                    </RadioButton.Group>
                    {error?.poster&& <HelperText type='error'>{error.poster}</HelperText>}

                    <Divider />
                    <Text style={styles.question}>New Calendar 2023 Execution </Text>
                    <RadioButton.Group onValueChange={newValue => setNew(newValue)} value={New}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Yes</Text>
                                <RadioButton value="Yes" />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>No</Text>
                                <RadioButton value="No" />
                            </View>
                        </View>
                    </RadioButton.Group>
                    {error?.new&& <HelperText type='error'>{error.new}</HelperText>}

                </Card>
                <Button mode='contained' onPress={onHandlePress} style={{ borderRadius: 0, marginTop: 30 }}>
                    Submit
                </Button>
            </ScrollView>
        </>
    )
}

export default SurveyScreen

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff'
    },
    question: {
        marginVertical: 10
    }
})