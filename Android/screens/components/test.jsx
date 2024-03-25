import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonThemed from './button';
import { StatusBar } from 'expo-status-bar';



const Test = ({ navigation }) => {

    const [serverStatus, setServerStatus] = useState('null');
    const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

    const checkServerStatus = async () => {
        try {
            //fetches the server 
            const reponse = await fetch(SERVER_URL);
            const statusCode = reponse.status;
            console.log("server status: ", statusCode);

            if (statusCode === 200) {
                setServerStatus('true');
            }
            else {
                setServerStatus('false');
            }

        }
        catch (error) {
            // Handle fetch error
            console.error('Error checking server status:', error.message);
            setServerStatus('false');
        }
    }

    //checks if the server status state and set to 'null' after 2min of check status action
    useEffect(() => {
        let timer;
        if (serverStatus === 'true' || 'false') {
            timer = setTimeout(() => {
                setServerStatus('null');
                console.log("timeout successfully");
            }, 1 * 60 * 1000); //1 minutes
        };

        return () => clearTimeout(timer);
    })

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text>{`process.env.SERVER_URL:${SERVER_URL}`}</Text>
                {serverStatus === 'null' ? <ButtonThemed
                    text={'check Status'}
                    onPress={checkServerStatus}
                    type='serverStatus'
                // fontFamily={"JetBrainsMonoLight"}
                /> : null}
                <Text style={[styles.device_text, styles.status_text]}>Server Status: {serverStatus !== "null" ? ((serverStatus === 'true') ? 'Online🟢' : 'Offline🔴') : null}</Text>
                <Text style={styles.smallTextlink} onPress={() => { navigation.navigate("login") }}>Login</Text>

            </View>
            <StatusBar style="#181818" />
        </SafeAreaView>
    );
}


export default Test;