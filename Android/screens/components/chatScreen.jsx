import React,{useState,useEffect} from 'react';
import { Text } from 'react-native';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const ChatScreen = ({ route, navigation }) => {
    const { username } = route.params;
    const user = {id: username};

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Load messages from AsyncStorage when the component mounts
        AsyncStorage.getItem(username)
            .then(storedMessages => {
                if (storedMessages) {
                    setMessages(JSON.parse(storedMessages));
                }
            });
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
        AsyncStorage.setItem(username, JSON.stringify(updatedMessages));
    };

//     const handleMessagePress = async (message: MessageType.Any) => {
//     if (message.type === 'file') {
//       try {
//         await FileViewer.open(message.uri, { showOpenWithDialog: true })
//       } catch {}
//     }
//   }

    return (
        <>
        <Chat
            messages={messages}
            // onAttachmentPress={handleAttachmentPress}
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
