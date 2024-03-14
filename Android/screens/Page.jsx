import React,{useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';


//local components imports
import Navbar from './components/navbar';
import ChatContainer from "./components/chatContainer";


const Page = ({ navigation, route }) => {
    const [userAdded,setuserAdded] = useState(false);

    const AddUser = () => {
        setuserAdded(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Navbar navigator={navigation} route={route} styles={styles.navbar} toAddUser={userAdded} />
                <ChatContainer AddUser={AddUser}/>
            </View>
            <StatusBar style="#181818" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#181818"
    },
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#181818",
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        color: "white"
    }
});

export default Page;