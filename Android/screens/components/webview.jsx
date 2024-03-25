import { WebView } from 'react-native-webview';


const WebViewScreen = ({ route }) => {
    const { uri } = route.params;

    return (
        <WebView
            source={{ uri }}
            onNavigationStateChange={async (navState) => {
                console.log("WebView url: ", navState.url);
                let data = Linking.parse(navState.url);
                console.log("data: ", data);
                if (data.queryParams.isUser == 'true') {
                    storage.set('isAuth', true);
                    storage.set('user.name', data.queryParams.name);
                    storage.set('user.email', data.queryParams.email);
                    navigation.navigate('home');
                }
            }}
        />
    );
};

export default WebViewScreen;
