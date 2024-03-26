import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import storage from '../components/storage.js';

import { useIsConnected } from 'react-native-offline';


//components
import ButtonThemed from './components/button.js';
import Input from './components/input.js';
import Offline from './components/offline.js';

//environment variables
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const GOOGLE_API = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

WebBrowser.maybeCompleteAuthSession();

const Signup = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState({
        statusCode: '',
        message: ''
    });
    const [fontLoaded, setFontLoaded] = useState(false);




    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                JetBrainsMonoLight: require('../assets/fonts/JetBrainsMono-Light.ttf'),
            });
            setFontLoaded(true);
        }

        loadFont();
    }, []);


    const styleWithFont = (style, font) => {
        return {
            ...style,
            fontFamily: fontLoaded ? font : null
        }
    };

    // const internet status function
    const isOnline = useIsConnected();


    const handleSignup = async (release) => {

        if (name == '' || email == '' || password == '') {
            //timeout on button progress
            setTimeout(release, 30);

            setAuth({ statusCode: '401', message: 'Enter The Missing User Field!' });
        }
        else {
            //timeout on button progress
            setTimeout(release, 10000);

            console.log(SERVER_URL);

            console.log(JSON.stringify({ name, email, password }));
            fetch(SERVER_URL + '/api/signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            }).then(response => {
                setAuth(prevVal => ({ ...prevVal, statusCode: response.status }));
                if (response.status == 200)
                    storage.set('isAuth', true);
                return response.json();
            })
                .then(data => {
                    setAuth(prevVal => ({ ...prevVal, message: data.message }));
                    console.log("data: ", data);
                })
                .catch(err => console.log("error", err));
        }
    };

    useEffect(() => {
        if (auth.statusCode == '200') {
            console.log(auth);
            storage.set('isAuth', true);
            storage.set('user.name', name);
            storage.set('user.email', email);
            navigation.navigate('home');
        }
    }, [auth])

    const handleGoogle = async (release) => {
        setTimeout(release, 10000);
        console.log('Google');
        try {
            const result = await WebBrowser.openBrowserAsync(SERVER_URL + '/api/auth/google');
            console.log(result);
        } catch (error) {
            console.error("GOOGLE: ", error);
        }
    };

    const handleFacebook = async (release) => {
        setTimeout(release, 10000);
        console.log('Facebook');
        console.log('Google');
        try {
            const result = await WebBrowser.openBrowserAsync(SERVER_URL + '/api/auth/facebook');
            console.log(result);
        } catch (error) {
            console.error("FACEBOOK: ", error);
        }
    }

    useEffect(() => {
        const handleUrl = async (url) => {
            console.log("handle url: ", url);
            if (WebBrowser.maybeCompleteAuthSession(url)) {
                let data = Linking.parse(url.url);
                console.log("data: ", data);
                if (data.queryParams.isUser == 'true') {
                    storage.set('isAuth', true);
                    storage.set('user.name', data.queryParams.name);
                    storage.set('user.email', data.queryParams.email);
                    // setName(data.queryParams.name);
                    // setEmail(data.queryParams.email);
                    navigation.navigate('home');
                }
                // Handle the deep link data in `data`
            }
        };

        const Listener = Linking.addEventListener("url", handleUrl);
        Linking.getInitialURL().then((url) => url && handleUrl(url));

        return () => Listener.remove();
    }, []);


    return (
        <View style={styles.signup}>
            <Text style={styleWithFont(styles.heading, "JetBrainsMonoLight")}>Sign Up</Text>
            <View style={styles.loginform}>
                <Text style={styleWithFont(styles.text, "JetBrainsMonoLight")}>Name</Text>
                <Input text={name} handleText={text => setName(text)} />
                <Text style={styleWithFont(styles.text, "JetBrainsMonoLight")}>Email</Text>
                <Input text={email} handleText={text => setEmail(text)} />
                <Text style={styleWithFont(styles.text, "JetBrainsMonoLight")}>Password</Text>
                <Input text={password} ifpass={true} handleText={text => setPassword(text)} />
                {auth.statusCode == '200' ? null : <Text style={[styles.smallText, styles.smallTextAlert]}>{auth.message}</Text>}
                <ButtonThemed text='Signup' onPress={handleSignup} type='localAuth'
                // fontFamily={'JetBrainsMonoLight'} 
                />
                <Text style={styleWithFont(styles.smallText, "JetBrainsMonoLight")}>Already have an account?⠀
                    <Text style={styleWithFont(styles.smallTextlink, "JetBrainsMonoLight")} onPress={() => { navigation.navigate("login") }}>Login</Text>
                </Text>
            </View>
            <Text style={styles.subheading}>⎯⎯⎯  or ⎯⎯⎯</Text>
            <View style={styles.oauth}>
                <ButtonThemed text='Google' onPress={handleGoogle} type='google' />
                <ButtonThemed text='Facebook' onPress={handleFacebook} type='facebook' />
            </View>
            {isOnline ? null : <Offline />}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    signup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    loginform: {
        width: "80%"
    },
    heading: {
        color: '#ffffff',
        fontSize: 40,
        padding: 24,
        paddingBottom: 15
    },
    text: {
        color: '#f2f2f2',
        alignSelf: 'flex-start',
        fontSize: 16,
        paddingTop: '3%'
    },
    subheading: {
        color: 'grey',
        fontSize: 16,
        padding: 20,
    },
    smallText: {
        color: '#f2f2f2',
        alignSelf: 'center',
        fontSize: 12,
        paddingTop: '5%',
    },
    smallTextlink: {
        color: '#2f61ff',
        textDecorationLine: 'underline'
    },
    smallTextAlert: {
        color: 'red'
    }
});



export default Signup;
