import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useIsConnected } from 'react-native-offline';

//components
import ButtonThemed from './components/button.js';
import Input from './components/input.js';
import Offline from './components/offline.js';
import storage from '../components/storage.js';

//environment variables
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;


// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();


const Login = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    const styleWithFont = (style, font) => {
        return {
            ...style,
            fontFamily: fontLoaded ? font : null
        }
    };

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                JetBrainsMonoLight: require('../assets/fonts/JetBrainsMono-Light.ttf'),
            });
            setFontLoaded(true);
        }

        loadFont();
    }, []);


    //const internet status function
    const isOnline = useIsConnected();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState({
        statusCode: '',
        message: ''
    });


    const handleLogin = async (release) => {

        if (email == '' && password == '') {
            setAuth({ statusCode: '401', message: 'Enter Login details!' });

            //timeout on button progress
            setTimeout(release, 30);
        }
        else if (email == '') {
            setAuth({ statusCode: '401', message: 'Enter Email Address!' });

            //timeout on button progress
            setTimeout(release, 30);
        }
        else if (password == '') {
            setAuth({ statusCode: '401', message: 'Enter Password!' });

            //timeout on button progress
            setTimeout(release, 30);
        }
        else {
            console.log(SERVER_URL);

            //timeout on button progress
            setTimeout(release, 10 * 1000); //10 seconds

            const url = await Linking.getInitialURL();
            console.log('Current URL:', url);
            console.log(JSON.stringify({ email, password }));

            fetch(SERVER_URL + '/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }).then(response => {
                setAuth(prevVal => ({ ...prevVal, statusCode: response.status }));
                if (response.status == 200)
                    storage.set('isAuth', true);

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
            storage.set('isAuth', true);
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


    return (
        <View style={styles.signup}>
            <Text style={styleWithFont(styles.heading, "JetBrainsMonoLight")}>Login</Text>
            <View style={styles.loginform}>
                <Text style={styleWithFont(styles.text, "JetBrainsMonoLight")}>Email</Text>
                <Input text={email} handleText={text => setEmail(text)} />
                <Text style={styleWithFont(styles.text, "JetBrainsMonoLight")}>Password</Text>
                <Input text={password} ifpass={true} handleText={text => setPassword(text)} />
                {auth.statusCode == '200' ? null : <Text style={[styles.smallText, styles.smallTextAlert]}>{auth.message}</Text>}
                <ButtonThemed text='Login' onPress={handleLogin} type='localAuth'
                // fontFamily={'JetBrainsMonoLight'} 
                />
                <Text style={styleWithFont(styles.smallText, "JetBrainsMonoLight")}>Don't have an account?⠀
                    <Text style={styleWithFont(styles.smallTextlink, "JetBrainsMonoLight")} onPress={() => { navigation.navigate("signup") }}>Signup</Text>
                </Text>
            </View>
            <Text style={styles.subheading}>⎯⎯⎯  or ⎯⎯⎯</Text>
            <View style={styles.oauth}>
                <ButtonThemed text='Google' onPress={handleGoogle} type='google' />
                <ButtonThemed text='Facebook' onPress={handleFacebook} type='facebook' />
            </View>
            <Text style={styleWithFont(styles.smallTextlink, "JetBrainsMonoLight")} onPress={() => { navigation.navigate("test") }}>Test</Text>
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
    },
    text: {
        color: '#f2f2f2',
        alignSelf: 'flex-start',
        fontSize: 16,
        paddingTop: '6%'
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



export default Login;
