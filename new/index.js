import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React from 'react';

import App from './App';
import store from './components/store';

const ReduxApp = () => {
    return (
        <Provider store={store}>
            <ActionSheetProvider>
                <App />
            </ActionSheetProvider>
        </Provider>
    );
}


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(ReduxApp);
