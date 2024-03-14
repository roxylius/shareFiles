import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, Alert } from 'react-native';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';

//local assets
// // images
const app_logo = require('../../assets/images/new_logo.png');
const settings_logo = require('../../assets/images/setting.png');
const back_logo = require('../../assets/images/back.png');
const plus_logo = require('../../assets/images/plus.png');

//constants
import { SERVER_URL } from '../../assets/constants';



//recieves navigator from clipboard.js
const Navbar = ({ navigator, route,AddUser }) => {

    //stores screen name 
    const [screenName, setScreenName] = useState('');
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [friendUserName, setFriendUserName] = useState('');

    //sets screen name value from route prop
    useEffect(() => {
        console.log("route.name: ", route.name);
        setScreenName(route.name);
    }, []);

    //handle settings route
    const handleSettings = () => {
        console.log("settings image clicked");
        if (route.name === 'home')
            navigator.navigate("settings");
        else
            navigator.navigate('home');
    }

    //const add user
    const addUser = () => {
        setIsDialogVisible(true);
    }

    //handles dialog cancel
    handleCancel = () => {
        setIsDialogVisible(false);
    }

    //to add friend to localstorage
    async function addFriend(data) {
        let friendUsernames = JSON.parse(await AsyncStorage.getItem('friendUsernames')) || [];
    
        // Add the new username to the array
        friendUsernames.push(data.name);
    
        // Save the updated array back to AsyncStorage
        await AsyncStorage.setItem('friendUsernames', JSON.stringify(friendUsernames));
        console.log('Friend added successfully!');
    }

    //to add user to the list
    const handleAddUser = () => {
        console.log("friend username:",friendUserName);
        fetch(SERVER_URL+`/api/user/search-user`, {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name:friendUserName })
        })
            .then(response => {
                // console.log("response",response);
                return response.json();
            })
            .then(data => {
                console.log('data eixts:' , data.exists);
                if(data.exists == true){
                    addFriend(data);
                    Alert.alert('User added successfully');
                    addUser();
                }else{
                    Alert.alert('User not found');
                }
                setIsDialogVisible(false);
            })
            .catch(error => {
                console.log("error", error)
            });
    }

    return (
        <View style={styles.topNav}>
            <Image source={app_logo} alt="app logo" style={styles.app_logo} />
            <View style={styles.utility}>
                <Pressable onPress={addUser}>
                    <Image source={plus_logo} alt="app logo" style={styles.settings_logo} />
                </Pressable>

                <Pressable onPress={handleSettings}>
                    <Image source={screenName === 'home' ? settings_logo : back_logo} alt="app logo" style={styles.settings_logo} />
                </Pressable>
                <Dialog.Container visible={isDialogVisible}>
                    <Dialog.Title>Friend UserName: </Dialog.Title>
                    <Dialog.Input onChangeText={text => setFriendUserName(text)} value={friendUserName}/>
                    {/* <Dialog.Description>
                        Do you want to delete this account? You cannot undo this action.
                    </Dialog.Description> */}
                    <Dialog.Button label="Cancel" onPress={handleCancel} />
                    <Dialog.Button label="Add" onPress={handleAddUser} />
                </Dialog.Container>
            </View>
        </View >);
};

const styles = new StyleSheet.create({
    topNav: {
        left: 0,
        right: 0,
        top: 0,
        height: 80,
        backgroundColor: "#181818",
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "white"
    },
    app_logo: {
        width: 150,
        height: 60,
        marginLeft: 10
    },
    settings_logo: {
        width: 35,
        height: 35,
        marginRight: 20
    },
    utility: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Navbar;