import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import local assets
const userIcon = require('../../assets/images/user.png');

const ChatContainer = ({ toAddUser }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [usernames, setUsernames] = useState([]);
    const navigation = useNavigation();

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

    useEffect(() => {
        async function loadUsernames() {
            const storedUsernames = await AsyncStorage.getItem('friendUsernames');
            console.log('stored usernames: ', storedUsernames);
            if (storedUsernames) {
                setUsernames(JSON.parse(storedUsernames));
            } else { }
        }

        loadUsernames();
    }, [toAddUser]);

    return (
        <View style={styles.chatContainer}>
            {usernames.map((username) => (
                <TouchableOpacity key={username} style={styles.chatBox} onPress={() => navigation.navigate('chat', { username })} >
                    <Image
                        style={styles.imageStyle}
                        source={userIcon}
                    />
                    <Text style={styleWithFont(styles.chatText, 'JetBrainsMonoLight')}>
                        {username}
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