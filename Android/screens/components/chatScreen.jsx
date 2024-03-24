import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import { PreviewData } from '@flyerhq/react-native-link-preview';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
// import * as DocumentPicker from 'react-native-document-picker';
import storage from '../../components/storage';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { PermissionsAndroid } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';


//env variables
const serverURL = process.env.EXPO_PUBLIC_SERVER_URL;

const ChatScreen = ({ route, navigation }) => {
    const { username, friendId } = route.params;
    const user = { id: friendId };

    const [messages, setMessages] = useState([]);
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        // Load messages from AsyncStorage when the component mounts
        const storedMessages = storage.getString(`messages@${friendId}`);
        if (storedMessages)
            setMessages(JSON.parse(storedMessages));
    }, []);

    const handleSendPress = (message) => {
        const newMessage = {
            author: username,
            createdAt: Date.now(),
            id: uuidv4(),
            text: message.text,
            type: 'text',
        };
        const updatedMessages = [newMessage, ...messages];
        setMessages(updatedMessages);

        // Store the updated messages in AsyncStorage
        storage.set(`messages@${friendId}`, JSON.stringify(updatedMessages));

        //send the message to server for storage
        const fId = friendId;
        const uId = storage.getString('user.email');
        // fetch(`${serverURL}/api/message/add`, {
        //     method: "POST",
        //     credentials: 'include',
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ userId: uId, friendId: fId, message: newMessage })
        // })
        //     .catch(response => {
        //         console.log("response:", response);
        //     })
    };

    const handleAttachmentPress = () => {
        console.log("something");
        showActionSheetWithOptions(
            {
                options: ['File', 'Cancel'],
                cancelButtonIndex: 1,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    // case 0:
                    //     handleImageSelection()
                    //     break
                    case 0:
                        handleFileSelection()
                        break
                }
            }
        )
    }

    // const handleImageSelection = () => {
    //     launchImageLibrary(
    //         {
    //             includeBase64: true,
    //             maxWidth: 1440,
    //             mediaType: 'photo',
    //             quality: 0.7,
    //         },
    //         ({ assets }) => {
    //             const response = assets?.[0]

    //             if (response?.base64) {
    //                 const imageMessage = {
    //                     author: user,
    //                     createdAt: Date.now(),
    //                     height: response.height,
    //                     id: uuidv4(),
    //                     name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
    //                     size: response.fileSize ?? 0,
    //                     type: 'image',
    //                     uri: `data:image/*;base64,${response.base64}`,
    //                     width: response.width,
    //                 }
    //                 setMessages(imageMessage)
    //             }
    //         }
    //     )
    // }

    // const handleFileSelection = async () => {
    //     try {
    //         const response = await DocumentPicker.pickSingle({
    //             type: [DocumentPicker.types.allFiles],
    //         })
    //         const fileMessage = {
    //             author: user,
    //             createdAt: Date.now(),
    //             id: uuidv4(),
    //             mimeType: response.type ?? undefined,
    //             name: response.name,
    //             size: response.size ?? 0,
    //             type: 'file',
    //             uri: response.uri,
    //         }
    //         setMessages(fileMessage)
    //     } catch { }
    // }
    async function handleFileSelection() {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            console.log("granted");
            let result = await DocumentPicker.getDocumentAsync({});
            if (!result.cancelled) {
                const fileMessage = {
                    author: user,
                    createdAt: Date.now(),
                    id: uuidv4(),
                    mimeType: result.type, // Update this according to your needs
                    name: result.name,
                    size: result.size,
                    type: 'file',
                    uri: result.uri,
                }
                setMessages([fileMessage, ...messages]);
            }
        } else {
            console.log("Storage permission denied");
        }
    }

    // const handlePreviewDataFetched = ({ message, previewData }) => {
    //     setMessages(
    //         messages.map((m) =>
    //             m.id === message.id ? { ...m, previewData } : m
    //         )
    //     )
    // }


    return (
        <>
            <Chat
                messages={messages}
                onAttachmentPress={handleAttachmentPress}
                // onMessagePress={handleMessagePress}
                // onPreviewDataFetched={handlePreviewDataFetched}
                onSendPress={handleSendPress}
                user={user}
            />
        </>
    );
    // Now you can use `username` to load messages for this specific user
    // and display them in this Chat screen.
}

export default ChatScreen;
