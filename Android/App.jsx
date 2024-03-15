import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider } from 'react-native-offline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';

const Stack = createNativeStackNavigator();

//import local components
import Login from './screens/Login';
import Signup from './screens/Signup';
import Settings from './screens/Settings';
import Page from './screens/Page';
import ChatScreen from './screens/components/chatScreen';
import store from './redux/store';


export default function App() {
  //handle if user already logged in
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by reading from AsyncStorage
    const checkLoginStatus = async () => {
      const isAuth = await AsyncStorage.getItem("isAuth");
      console.log(isAuth);
      if (!isAuth || isAuth === "false") {
        setIsLogin(false);
        console.log("Not logged in, redirecting to signup screen");
      }
    };

    checkLoginStatus();
  }, []); // Make sure to include navigation in the dependency array


  return (
    <Provider store={store}>
      <NetworkProvider>
        <NavigationContainer >
          <SafeAreaProvider >
            <Stack.Navigator screenOptions={{ headerShown: false }} >
              {isLogin ? <Stack.Screen name="home" component={Page} /> : <Stack.Screen name="signup" component={Signup} />}
              {!isLogin ? <Stack.Screen name="home" component={Page} /> : <Stack.Screen name="signup" component={Signup} />}
              <Stack.Screen name="login" component={Login} />
              <Stack.Screen name="settings" component={Settings} />
              <Stack.Screen name="chat" component={ChatScreen} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </NetworkProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
