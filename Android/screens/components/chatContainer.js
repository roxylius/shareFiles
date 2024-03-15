import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

//import local assets
const userIcon = require('../../assets/images/user.png');
import { actions, reducer } from '../../redux/slice';

const ChatContainer = ({ toAddUser }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    const navigation = useNavigation();

    //implementing redux
    const dispatch = useDispatch();

    // Get the user data from the Redux store
    const userData = useSelector(state => state.user.data);
    const isUser = useSelector(state => state.user.isUser);
    const findUser = useSelector(state => state.user.findUser);
    const friends = useSelector(state => state.user.friends);
    const chats = useSelector(state => state.user.chats);

    // Use the dispatch function to dispatch actions
    const setUserData = (data) => dispatch(actions.setUserData(data));
    const setIsUserTrue = () => dispatch(actions.setIsUserTrue());
    const setIsUserFalse = () => dispatch(actions.setIsUserFalse());
    const setTrue = () => dispatch(actions.setTrue());
    const setFalse = () => dispatch(actions.setFalse());
    const addChat = (chat) => dispatch(actions.addChat(chat));
    const addFriend = (friend) => dispatch(actions.Addfriend(friend));

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                JetBrainsMonoLight: require('../../assets/fonts/JetBrainsMono-Light.ttf'),
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


    // async function loadUsernames() {
    //     const storedUsernames = await AsyncStorage.getItem('friendUsernames');
    //     console.log('stored usernames: ', storedUsernames);
    //     if (storedUsernames) {
    //         setUsernames(JSON.parse(storedUsernames));
    //     } else { console.log("no frineds") }
    // }

    // // ChatContainer.js
    // useEffect(() => {
    //     loadUsernames();
    // }, [toAddUser]);
    console.log('friends: ', friends);


    return (
        <View style={styles.chatContainer}>
            {friends.map((friend) => (
                <TouchableOpacity key={friend.userId} style={styles.chatBox} onPress={() => navigation.navigate('chat', { username: friend.name })} >
                    <Image
                        style={styles.imageStyle}
                        source={userIcon}
                    />
                    <Text style={styleWithFont(styles.chatText, 'JetBrainsMonoLight')}>
                        {friend.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

styles = StyleSheet.create({
    chatText: {
        color: 'white',
        fontSize: 20,
    },
    chatContainer: {
        flex: 1,
        paddingTop: 90,
        alignItems: 'center',
        width: '100%'

    },
    chatBox: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        width: '99%',
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: '#dcdcdc',
        borderBottomWidth: 3,
        backgroundColor: '#1f1f1f',
        borderRadius: 10,
        opacity: 0.8

    },
    imageStyle: {
        width: 50,
        height: 40,
    }
});

export default ChatContainer;