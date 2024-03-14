import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { SERVER_URL } from '../assets/constants.js';
import { useIsConnected } from 'react-native-offline';


//components
import ButtonThemed from './components/button.js';
import Input from './components/input.js';
import Offline from './components/offline.js';

const Signup = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState({
        statusCode: '',
        message: ''
    });
    const [fontLoaded, setFontLoaded] = useState(false);

    const styleWithFont = (style,font)=>{
        return {
            ...style,
            fontFamily: fontLoaded ? font : null
        }
    };

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                JetBrainsMonoLight: require('../assets/fonts/JetBrainsMono-Light.ttf'),
                HelveticaNeueMedium: require('../assets/fonts/Helvetica-Neue-Font/Helvetica-Neue-Font/Helvetica Neue Medium Extended/Helvetica Neue Medium Extended.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
                RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
                RobotoMonoLight: require('../assets/fonts/RobotoMono-Light.ttf')
            });
            setFontLoaded(true);
        }

        loadFont();
    }, []);


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

            const url = await Linking.getInitialURL();
            console.log('Current URL:', url);
            console.log(JSON.stringify({ name, email, password }));
            fetch(SERVER_URL + '/api/signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setAuth(prevVal => ({ ...prevVal, statusCode: response.status }));
                if(response.status == 200)
                    AsyncStorage.setItem('isAuth', 'true');
                return response.json();
            })
                .then(data => {
                    setAuth(prevVal => ({ ...prevVal, message: data.message }));
                })
                .catch(err => console.log("error", err));
        }
    };

    useEffect(() => {
        if (auth.statusCode == '200') {
            console.log(auth);
            navigation.navigate('home');
        }
    }, [auth])
    
    
    return (
        <View style={styles.signup}>
            <Text style={styleWithFont(styles.heading,"JetBrainsMonoLight")}>Sign Up</Text>
            <View style={styles.loginform}>
                <Text style={styleWithFont(styles.text,"JetBrainsMonoLight")}>Name</Text>
                <Input text={name} handleText={text => setName(text)} />
                <Text style={styleWithFont(styles.text,"JetBrainsMonoLight")}>Email</Text>
                <Input text={email} handleText={text => setEmail(text)} />
                <Text style={styleWithFont(styles.text,"JetBrainsMonoLight")}>Password</Text>
                <Input text={password} ifpass={true} handleText={text => setPassword(text)} />
                {auth.statusCode == '200' ? null : <Text style={[styles.smallText, styles.smallTextAlert]}>{auth.message}</Text>}
                <ButtonThemed text='Signup' onPress={handleSignup} type='localAuth'
                // fontFamily={'JetBrainsMonoLight'} 
                />
                <Text style={styleWithFont(styles.smallText,"JetBrainsMonoLight")}>Already have an account?⠀
                    <Text style={styleWithFont(styles.smallTextlink,"JetBrainsMonoLight")} onPress={() => { navigation.navigate("login") }}>Login</Text>
                </Text>
            </View>
            {/* <Text style={styles.subheading}>⎯⎯⎯  or ⎯⎯⎯</Text>
            <View style={styles.oauth}>
                <ButtonThemed text='Google' onPress={handleSignup} type='google' />
                <ButtonThemed text='Github' onPress={handleSignup} type='github' />
            </View> */}
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
        backgroundColor: '#0a0a0a',
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
        fontSize: 22,
        paddingTop: '6%'
    },
    subheading: {
        color: 'grey',
        fontSize: 25,
        padding: 20,
    },
    smallText: {
        color: '#f2f2f2',
        alignSelf: 'center',
        fontSize: 15,
        paddingTop: '5%',
    },
    smallTextlink: {
        color: 'blue',
        textDecorationLine: 'underline'
    },
    smallTextAlert: {
        color: 'red'
    }
});



export default Signup;
