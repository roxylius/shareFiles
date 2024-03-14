import { StyleSheet, Text, View, Dimensions, Pressable, BackHandler } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{ useEffect, useState } from 'react';
import * as Font from 'expo-font';


//local assets
import { SERVER_URL } from '../assets/constants';
import Navbar from './components/navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';


const Settings = ({ navigation, route }) => {
    //change status bar color
    // StatusBar.setBackgroundColor("#181818");

    //server url to get User details and logout
    const userURL = SERVER_URL + '/api/user';
    const logoutURL = SERVER_URL + '/api/logout';


    //react hooks
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    //logout response
    const [auth, setAuth] = useState({
        statusCode: '',
        message: ''
    });

    //gets height and width of the current device
    console.log(Dimensions.get('window').width);

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
            });
            setFontLoaded(true);
        }

        loadFont();
    }, []);



    useEffect(() => {
        const setUserInfo = async () => {
            console.log("setUserInfo callled");
            const name = await AsyncStorage.getItem('name');

            if (name === null) {
                console.log('name null');
                try {
                    const response = await fetch(userURL, {
                        method: 'GET',
                        credentials: 'include' //imp
                    })
                    const data = await response.json();

                    console.log(data);

                    // stores the user data in local AsyncStorage
                    await AsyncStorage.setItem("name", data.name);
                    await AsyncStorage.setItem('email', data.email);
                    await AsyncStorage.setItem("id", data._id);

                    // set name and email in react hooks
                    setUsername(data.name);
                    setEmail(data.email);

                    console.log("data added"); //dev test
                }
                catch (error) {
                    console.log("AsyncStorage data storage Error!", error);
                }
            }
            else {
                //set name using local Storage
                setUsername(name);

                //set email using local Storage
                const email = await AsyncStorage.getItem('email');
                setEmail(email);

                console.log("else", name, email);
            }
        };

        setUserInfo();

    }, [])

    //handle Logout
    const handleLogout = async () => {
        console.log("logout clicked");
        await AsyncStorage.removeItem('name', (err) => {
            if (!err)
                console.log("name removed successfully!"); //dev test 
        });
        await AsyncStorage.removeItem('email', (err) => {
            if (!err)
                console.log("email removed successfully!"); //dev test
        });

        await AsyncStorage.clear();

        // fetches and get the response from logout 
        const response = await fetch(logoutURL, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //set the response code in Auth
        setAuth(prevVal => ({ ...prevVal, statusCode: response.status }));

        //parses the json request from the response
        const data = await response.json();

        //sets the message from the reponse in Auth
        setAuth(prevVal => ({ ...prevVal, message: data.message }));
    };

    //handles logout based on response from server
    useEffect(() => {
        if (auth.statusCode == '200') {
            console.log(auth);
            navigation.navigate('login');
        }
    }, [auth])

    //handle exist
    const handleExit = () => {
        //closes the app
        console.log("exit clicked");
        BackHandler.exitApp();
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.settings_container}>
                <Navbar navigator={navigation} route={route} />
                <View style={styles.item}>
                    <Text style={styleWithFont(styles.settings_text,'JetBrainsMonoLight')}>Name: {username}</Text>
                    <Text style={styleWithFont(styles.settings_text,'JetBrainsMonoLight')}>Email: {email}</Text>
                </View>
                <View style={styles.item}>
                    <Pressable onPress={handleLogout}>
                        <Text style={styleWithFont(styles.settings_heading,'JetBrainsMonoLight')}>Logout</Text>
                    </Pressable>
                </View>
                <View style={styles.item}>
                    <Pressable onPress={handleExit}>
                        <Text style={styleWithFont(styles.settings_heading,'JetBrainsMonoLight')}>Exit</Text>
                    </Pressable>
                </View>
                {/* {auth.statusCode == '200' ? null : <Text style={styles.smallTextAlert}>{auth.message}</Text>} */}
                {/* <Text style={styles.settings_text}>hello</Text> */}
                {/* <Image source={app_logo} alt="app logo" style={styles.app_logo} />
             <Pressable onPress={handleSettings}>
                 <Image source={settings_logo} alt="app logo" style={styles.settings_logo} />
             </Pressable> */}
            <StatusBar backgroundColor='#181818'/>
            </View >
        </ SafeAreaView>
    );
}

const styles = new StyleSheet.create({
    safeArea: {
        flex: 1
    },
    settings_container: {
        backgroundColor: "#282828",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: "white",
        paddingTop: 80,
    },
    item: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 15,
        width: Dimensions.get('window').width,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    settings_heading: {
        color: 'whitesmoke',
        fontSize: 26
    },
    settings_text: {
        color: 'white',
        fontSize: 20,
        paddingTop: 4
    },
    smallTextAlert: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 15,
        paddingTop: '5%',
    }
});

export default Settings;