import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, Alert } from 'react-native';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

//local assets
// // images
const app_logo = require('../../assets/images/new_logo.png');
const settings_logo = require('../../assets/images/setting.png');
const back_logo = require('../../assets/images/back.png');
const plus_logo = require('../../assets/images/plus.png');

//constants
import { SERVER_URL } from '../../assets/constants';
import { actions, reducer } from '../../redux/slice';


//recieves navigator from clipboard.js
const Navbar = ({ navigator, route, AddUser }) => {
    const friends = useSelector(state => state.user.friends);
    const dispatch = useDispatch();

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

    //to add user to the list
    const handleAddUser = () => {
        console.log("friend username:", friendUserName);
        fetch(SERVER_URL + `/api/user/search-user`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: friendUserName })
        })
            .then(response => response.json())
            .then(data => {
                // Check if the user exists
                if (data.exists == true) {
                    // Check if the friends array already contains a friend with the same _id
                    const friendExists = friends.some(friend => friend._id === data._id);

                    if (!friendExists) {
                        // If the friend does not exist, dispatch the Addfriend action with the received data
                        dispatch(actions.Addfriend(data));
                    } else {
                        Alert.alert('Friend already exists');
                    }
                }else{
                    Alert.alert('User does not exist');
                
                }

                setIsDialogVisible(false);
            })
            .catch(error => console.error('Error:', error));
    };

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
                    <Dialog.Input onChangeText={text => setFriendUserName(text)} value={friendUserName} />
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